"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const TEMPLATES = [
  {
    id: "classic",
    name: "Сонгодог",
    description: "Ногоон, алтлаг",
    icon: "🌿",
  },
  {
    id: "rose",
    name: "Rose",
    description: "Ягаан, крем",
    icon: "🌸",
  },
  {
    id: "sage",
    name: "Sage",
    description: "Зөөлөн ногоон",
    icon: "🕊️",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Хар хөх, алтлаг",
    icon: "✨",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Цэвэр минимал",
    icon: "🤍",
  },
];

export default function Home() {
  const [screen, setScreen] = useState("home");
  const [template, setTemplate] = useState("classic");

  const heroInput = useRef(null);
  const venueInput = useRef(null);
  const galleryInput = useRef(null);
  const flipTimer = useRef(null);

  const [form, setForm] = useState({
    groom: "",
    bride: "",
    date: "",
    time: "",
    venueName: "",
    venueAddress: "",
    mapUrl: "",
    message: "",
    heroPhoto: "",
    venuePhoto: "",
    gallery: [],
  });
useEffect(() => {
  async function loadInvitation() {
    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get("invite");

    if (!inviteId) return;
setScreen("preview");
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("id", inviteId)
      .single();

    if (error) {
      console.error("Supabase load error:", error);
      return;
    }

    if (!data) return;

    setTemplate(data.template || "classic");

    setForm((prev) => ({
      ...prev,
      groom: data.groom || "",
      bride: data.bride || "",
      date: data.date || "",
      time: data.time || "",
      venueName: data.venue_name || "",
      venueAddress: data.venue_address || "",
      mapUrl: data.map_url || "",
      message: data.message || "",
      heroPhoto: data.hero_image_url || "",
      venuePhoto: data.venue_image_url || "",
      gallery: data.gallery_urls || [],
    }));
  }

  loadInvitation();
}, []);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  });

  const [galleryIndex, setGalleryIndex] = useState(0);

  const [flip, setFlip] = useState({
    active: false,
    from: 0,
    to: 0,
    direction: "next",
  });

  const [rsvpName, setRsvpName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("Ирнэ");
  const [rsvpSent, setRsvpSent] = useState(false);

  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState([]);

  const names = `${form.groom || "Хүргэн"} & ${
    form.bride || "Бүсгүй"
  }`;

  const greeting =
    form.message ||
    "Эрхэм зочид оо! Бидний амьдралын хамгийн дурсамжтай энэ өдөр хүрэлцэн ирж, аз жаргалтай мөчийг маань хуваалцахыг хүндэтгэн урьж байна.";

  function updateForm(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function readImage(file, callback) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Зөвхөн зураг сонгоно уу.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function chooseHero(e) {
    const file = e.target.files?.[0];

    readImage(file, (src) => {
      setForm((prev) => ({
        ...prev,
        heroPhoto: src,
      }));
    });
  }

  function chooseVenue(e) {
    const file = e.target.files?.[0];

    readImage(file, (src) => {
      setForm((prev) => ({
        ...prev,
        venuePhoto: src,
      }));
    });
  }

  async function chooseGallery(e) {
    const files = Array.from(e.target.files || [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 8);

    if (!files.length) return;

    const photos = await Promise.all(
      files.map(
        (file, index) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve({
                id: `${Date.now()}-${index}`,
                src: reader.result,
              });
            };

            reader.readAsDataURL(file);
          })
      )
    );

    setForm((prev) => ({
      ...prev,
      gallery: photos,
    }));

    setGalleryIndex(0);

    if (galleryInput.current) {
      galleryInput.current.value = "";
    }
  }

  function removeHero() {
    setForm((prev) => ({
      ...prev,
      heroPhoto: "",
    }));

    if (heroInput.current) {
      heroInput.current.value = "";
    }
  }

  function removeVenue() {
    setForm((prev) => ({
      ...prev,
      venuePhoto: "",
    }));

    if (venueInput.current) {
      venueInput.current.value = "";
    }
  }

  function removeGalleryPhoto(id) {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((photo) => photo.id !== id),
    }));

    setGalleryIndex(0);
  }

  function turnPage(targetIndex, direction = "next") {
    if (flip.active) return;
    if (!form.gallery.length) return;
    if (targetIndex === galleryIndex) return;

    setFlip({
      active: true,
      from: galleryIndex,
      to: targetIndex,
      direction,
    });

    if (flipTimer.current) {
      clearTimeout(flipTimer.current);
    }

    flipTimer.current = setTimeout(() => {
      setGalleryIndex(targetIndex);

      setFlip({
        active: false,
        from: targetIndex,
        to: targetIndex,
        direction,
      });
    }, 760);
  }

  function previousGallery() {
    if (!form.gallery.length || flip.active) return;

    const nextIndex =
      galleryIndex === 0
        ? form.gallery.length - 1
        : galleryIndex - 1;

    turnPage(nextIndex, "prev");
  }

  function nextGallery() {
    if (!form.gallery.length || flip.active) return;

    const nextIndex =
      galleryIndex === form.gallery.length - 1
        ? 0
        : galleryIndex + 1;

    turnPage(nextIndex, "next");
  }

  useEffect(() => {
    return () => {
      if (flipTimer.current) {
        clearTimeout(flipTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!form.date) {
      setCountdown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        finished: false,
      });

      return;
    }

    function calculate() {
      const selectedTime = form.time || "00:00";

      const target = new Date(
        `${form.date}T${selectedTime}:00`
      ).getTime();

      const difference = target - Date.now();

      if (Number.isNaN(target) || difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          finished: true,
        });

        return;
      }

      setCountdown({
        days: Math.floor(difference / 86400000),
        hours: Math.floor(
          (difference % 86400000) / 3600000
        ),
        minutes: Math.floor(
          (difference % 3600000) / 60000
        ),
        seconds: Math.floor(
          (difference % 60000) / 1000
        ),
        finished: false,
      });
    }

    calculate();

    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [form.date, form.time]);

  function sendRsvp() {
    if (!rsvpName.trim()) {
      alert("Нэрээ бичнэ үү.");
      return;
    }

    setRsvpSent(true);

    setTimeout(() => {
      setRsvpSent(false);
    }, 3000);

    setRsvpName("");
    setRsvpStatus("Ирнэ");
  }

  function sendWish() {
    if (!wishName.trim()) {
      alert("Нэрээ бичнэ үү.");
      return;
    }

    if (!wishText.trim()) {
      alert("Ерөөлөө бичнэ үү.");
      return;
    }

    setWishes((prev) => [
      {
        id: Date.now(),
        name: wishName.trim(),
        text: wishText.trim(),
      },
      ...prev,
    ]);

    setWishName("");
    setWishText("");
  }

 async function buildShareLink() {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .insert([
        {
          template: template,
          groom: form.groom || "",
          bride: form.bride || "",
          date: form.date || null,
          time: form.time || "",
          venue_name: form.venueName || "",
          venue_address: form.venueAddress || "",
          map_url: form.mapUrl || "",
          message: form.message || "",
          hero_image_url: heroImage || "",
          venue_image_url: venueImage || "",
          gallery_urls: galleryImages || [],
        },
      ])
      .select("id")
      .single();

    if (error) throw error;

    return `${window.location.origin}/?invite=${data.id}`;
  } catch (error) {
    console.error("Supabase save error:", error);
    alert("Урилгыг хадгалахад алдаа гарлаа.");
    return "";
  }
}

  async function copyShareLink() {
    const link = await buildShareLink();
    try {
      await navigator.clipboard.writeText(link);
      alert("Урилгын линк хуулагдлаа.");
    } catch {
      window.prompt("Энэ линкийг хуулна уу:", link);
    }
  }

  async function nativeShare() {
    const link = await buildShareLink();

    if (navigator.share) {
      try {
        await navigator.share({
          title: names,
          text: "Бидний хуримын урилга",
          url: link,
        });

        return;
      } catch {
        return;
      }
    }

    copyShareLink();
  }

  if (screen === "home") {
    return (
      <>
        <style>{css}</style>

        <main className="home-page">
          <section className="home-card">
            <div className="home-ring">💍</div>

            <div className="tiny-title">
              ONLINE WEDDING INVITATION
            </div>

            <h1>Хуримын урилга</h1>

            <p>
              Загвараа сонгоод өөрийн хуримын онлайн урилгаа
              бүтээнэ үү.
            </p>

            <button
              className="main-button"
              onClick={() => setScreen("templates")}
            >
              Урилга бүтээх
            </button>
          </section>
        </main>
      </>
    );
  }

  if (screen === "templates") {
    return (
      <>
        <style>{css}</style>

        <main className="template-page">
          <div className="template-page-inner">
            <button
              className="back-link"
              onClick={() => setScreen("home")}
            >
              ← Буцах
            </button>

            <div className="template-heading">
              <div className="tiny-title">
                CHOOSE YOUR STYLE
              </div>

              <h1>Урилгын загвар сонгох</h1>

              <p>
                Доорх 5 загвараас өөрт таалагдсанаа сонгоно уу.
              </p>
            </div>

            <div className="template-grid">
              {TEMPLATES.map((item) => (
                <button
                  key={item.id}
                  className={`template-card template-${item.id} ${
                    template === item.id ? "active" : ""
                  }`}
                  onClick={() => setTemplate(item.id)}
                >
                  <div className="template-preview">
                    <div className="template-mini-heart">
                      ♥
                    </div>

                    <div className="template-mini-photo">
                      {item.icon}
                    </div>

                    <div className="template-mini-name">
                      A & B
                    </div>

                    <div className="template-mini-line" />

                    <div className="template-mini-box" />
                    <div className="template-mini-box small" />
                  </div>

                  <div className="template-info">
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                  </div>

                  {template === item.id && (
                    <div className="template-selected">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              className="continue-button"
              onClick={() => {
                setScreen("form");
                window.scrollTo(0, 0);
              }}
            >
              Үргэлжлүүлэх →
            </button>
          </div>
        </main>
      </>
    );
  }

  if (screen === "form") {
    return (
      <>
        <style>{css}</style>

        <main className="form-page">
          <section className="editor-card">
            <button
              className="back-link"
              onClick={() => setScreen("templates")}
            >
              ← Загвар солих
            </button>

            <div className="editor-head">
              <div className="tiny-title">
                CREATE YOUR INVITATION
              </div>

              <h1>Урилгын мэдээлэл</h1>

              <p>
                Мэдээлэл болон зургаа оруулна уу.
              </p>
            </div>

            <div className="selected-template-label">
              Сонгосон загвар:{" "}
              <strong>
                {
                  TEMPLATES.find(
                    (item) => item.id === template
                  )?.name
                }
              </strong>
            </div>

            <div className="form-grid">
              <Field
                label="Хүргэний нэр"
                name="groom"
                value={form.groom}
                onChange={updateForm}
                placeholder="Хүргэний нэр"
              />

              <Field
                label="Бүсгүйн нэр"
                name="bride"
                value={form.bride}
                onChange={updateForm}
                placeholder="Бүсгүйн нэр"
              />

              <div className="two-column">
                <label className="field">
                  <span>Хуримын огноо</span>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={updateForm}
                  />
                </label>

                <label className="field">
                  <span>Цаг</span>

                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={updateForm}
                  />
                </label>
              </div>

              <Field
                label="Хурим болох газрын нэр"
                name="venueName"
                value={form.venueName}
                onChange={updateForm}
                placeholder="Жишээ: Хуримын ордон"
              />

              <Field
                label="Хурим болох газрын хаяг"
                name="venueAddress"
                value={form.venueAddress}
                onChange={updateForm}
                placeholder="Хаяг..."
              />

              <Field
                label="Google Maps линк"
                name="mapUrl"
                value={form.mapUrl}
                onChange={updateForm}
                placeholder="Google Maps линк"
              />

              <ImagePicker
                title="Хосын нүүр зураг"
                subtitle="Урилгын нүүрэнд харагдана"
                image={form.heroPhoto}
                inputRef={heroInput}
                onChange={chooseHero}
                onRemove={removeHero}
              />

              <ImagePicker
                title="Байршлын зураг"
                subtitle="Хурим болох газрын зураг"
                image={form.venuePhoto}
                inputRef={venueInput}
                onChange={chooseVenue}
                onRemove={removeVenue}
              />

              <div className="upload-card">
                <div className="upload-icon">🖼</div>

                <h3>Бидний түүхийн зургууд</h3>

                <p>
                  Дээд тал нь 8 зураг. Нэг нэгээрээ номын хуудас
                  шиг эргэж харагдана.
                </p>

                <input
                  ref={galleryInput}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={chooseGallery}
                  hidden
                />

                <button
                  className="choose-photo"
                  onClick={() =>
                    galleryInput.current?.click()
                  }
                >
                  ＋ Зургууд сонгох
                </button>

                {form.gallery.length > 0 && (
                  <div className="gallery-editor">
                    {form.gallery.map((photo, index) => (
                      <div
                        className="gallery-edit-item"
                        key={photo.id}
                      >
                        <img src={photo.src} alt="" />

                        <span>{index + 1}</span>

                        <button
                          onClick={() =>
                            removeGalleryPhoto(photo.id)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="field">
                <span>Урилгын мэндчилгээ</span>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateForm}
                  rows={4}
                  maxLength={800}
                  placeholder="Эрхэм зочид оо..."
                />

                <small>{form.message.length}/800</small>
              </label>

              <button
                className="preview-btn"
                onClick={() => {
                  setScreen("preview");
                  window.scrollTo(0, 0);
                }}
              >
                Урилгаа харах
              </button>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>

      <main
        className={`invitation invitation-${template}`}
      >
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setScreen("form")}
          >
            ☰
          </button>

          <div className="topbar-name">{names}</div>

          <div className="music-note">♪</div>
        </header>

        <section className="hero-section">
          <div className="hero-stage">
            {form.heroPhoto ? (
              <img
                src={form.heroPhoto}
                className="hero-image"
                alt="Хосын зураг"
              />
            ) : (
              <div className="hero-placeholder">
                📷 Хосын зураг
              </div>
            )}

            <div className="hero-gradient" />

            <div className="hero-overlay">
              <div className="hero-label">
                ХУРИМЫН УРИЛГА
              </div>

              <h1>{names}</h1>

              <div className="heart-line">
                <span />
                ♥
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="compact-section greeting-width">
          <div className="greeting-card">
            <div className="ornament">✦</div>

            <div className="section-label">
              УРИЛГЫН МЭНДЧИЛГЭЭ
            </div>

            <div className="short-line" />

            <h3>{names}</h3>

            <p>{greeting}</p>

            <div className="ornament bottom">❦</div>
          </div>
        </section>

        <section className="compact-section date-width">
          <div className="date-time-card">
            <div className="date-block">
              <div className="date-icon">▣</div>

              <div className="section-label">
                ОГНОО / DATE
              </div>

              <strong>{formatDate(form.date)}</strong>
            </div>

            <div className="vertical-line" />

            <div className="date-block">
              <div className="date-icon">◷</div>

              <div className="section-label">
                ЦАГ / TIME
              </div>

              <strong>
                {form.time || "17:00"} ЦАГТ
              </strong>
            </div>
          </div>
        </section>

        <section className="countdown-section">
          <div className="section-label">
            ХУРИМ ХҮРТЭЛ
          </div>

          {!form.date ? (
            <p className="empty-text">
              Огноогоо сонгоно уу
            </p>
          ) : countdown.finished ? (
            <div className="today-card">
              ♥ ӨНӨӨДӨР БИДНИЙ ХУРИМЫН ӨДӨР ♥
            </div>
          ) : (
            <div className="countdown-grid">
              <CountBox
                value={countdown.days}
                label="Өдөр"
              />

              <CountBox
                value={countdown.hours}
                label="Цаг"
              />

              <CountBox
                value={countdown.minutes}
                label="Минут"
              />

              <CountBox
                value={countdown.seconds}
                label="Секунд"
              />
            </div>
          )}
        </section>

        <section className="compact-section venue-width">
          <div className="venue-card">
            <div className="venue-photo-area">
              {form.venuePhoto ? (
                <img
                  src={form.venuePhoto}
                  alt="Хурим болох газар"
                />
              ) : (
                <div className="venue-placeholder">
                  📍 Байршлын зураг
                </div>
              )}
            </div>

            <div className="venue-body">
              <div className="section-label left">
                ★ БАЙРШИЛ / VENUE
              </div>

              <h2>
                {form.venueName ||
                  "Хурим болох газар"}
              </h2>

              <p>
                {form.venueAddress ||
                  "Хурим болох газрын хаяг"}
              </p>

              {form.mapUrl && (
                <a
                  href={form.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-btn"
                >
                  📍 ГАЗРЫН ЗУРГААС ХАРАХ
                </a>
              )}
            </div>
          </div>
        </section>

        {form.gallery.length > 0 && (
          <section className="story-section">
            <div className="story-header">
              <div className="section-label">
                БИДНИЙ ТҮҮХ
              </div>

              <h2>Хуримын дурсамжууд</h2>

              <p>Зургийг хуудас шиг эргүүлж үзээрэй</p>
            </div>

            <div className="book-area">
              <button
                className="book-arrow"
                onClick={previousGallery}
                disabled={flip.active}
              >
                ‹
              </button>

              <div className="album-shell">
                <div className="album-corner top-left" />
                <div className="album-corner top-right" />
                <div className="album-corner bottom-left" />
                <div className="album-corner bottom-right" />

                <div className="book">
                  <div className="book-base">
                    <img
                      src={
                        form.gallery[
                          flip.active
                            ? flip.to
                            : galleryIndex
                        ]?.src
                      }
                      alt=""
                    />
                  </div>

                  {flip.active && (
                    <div
                      className={`turning-page turning-${flip.direction}`}
                    >
                      <div className="turning-front">
                        <img
                          src={
                            form.gallery[flip.from]?.src
                          }
                          alt=""
                        />
                      </div>

                      <div className="turning-back">
                        <img
                          src={
                            form.gallery[flip.to]?.src
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  )}

                  <div className="book-spine" />
                </div>
              </div>

              <button
                className="book-arrow"
                onClick={nextGallery}
                disabled={flip.active}
              >
                ›
              </button>
            </div>

            <div className="page-number">
              {flip.active
                ? flip.to + 1
                : galleryIndex + 1}{" "}
              / {form.gallery.length}
            </div>

            <div className="story-dots">
              {form.gallery.map((photo, index) => (
                <button
                  key={photo.id}
                  className={
                    index ===
                    (flip.active
                      ? flip.to
                      : galleryIndex)
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    turnPage(
                      index,
                      index > galleryIndex
                        ? "next"
                        : "prev"
                    )
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section className="rsvp-section">
          <div className="rsvp-card">
            <h2>RSVP</h2>

            <p className="rsvp-intro">
              Таны ирэх нь бидний хувьд том хүндэтгэл!
            </p>

            <div className="field-heading">
              НЭРЭЭ БИЧНЭ ҮҮ
            </div>

            <input
              className="rsvp-name-input"
              value={rsvpName}
              onChange={(e) =>
                setRsvpName(e.target.value)
              }
              placeholder="Таны нэр"
            />

            <div className="field-heading">
              ХУРИМД ИРЭХ ҮҮ?
            </div>

            <div className="rsvp-options">
              <RsvpOption
                value="Ирнэ"
                subtitle="Хуримд оролцоно"
                selected={rsvpStatus}
                setSelected={setRsvpStatus}
              />

              <RsvpOption
                value="Одоогоор мэдэхгүй"
                subtitle="Одоохондоо тодорхойгүй"
                selected={rsvpStatus}
                setSelected={setRsvpStatus}
              />

              <RsvpOption
                value="Ирэхгүй"
                subtitle="Оролцох боломжгүй"
                selected={rsvpStatus}
                setSelected={setRsvpStatus}
              />
            </div>

            <button
              className="send-btn rsvp-send"
              onClick={sendRsvp}
            >
              ИЛГЭЭХ
            </button>

            {rsvpSent && (
              <div className="success-message">
                ✓ Таны хариу илгээгдлээ
              </div>
            )}
          </div>
        </section>

        <section className="wish-section">
          <div className="wish-heading">
            <span />
            ♥ ЕРӨӨЛ ҮЛДЭЭХ ♥
            <span />
          </div>

          {wishes.length > 0 && (
            <div className="wish-list">
              {wishes.map((wish) => (
                <article
                  className="wish-card"
                  key={wish.id}
                >
                  <div className="quote-mark">”</div>

                  <p>“{wish.text}”</p>

                  <div className="wish-author">
                    — {wish.name} —
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="wish-form">
            <div className="wish-form-title">
              ✎ ЕРӨӨЛӨӨ БИЧНЭ ҮҮ
            </div>

            <label className="wish-name-label">
              НЭР

              <input
                value={wishName}
                onChange={(e) =>
                  setWishName(e.target.value)
                }
                placeholder="Таны нэр..."
              />
            </label>

            <label>
              ТАНЫ ЕРӨӨЛ

              <textarea
                value={wishText}
                onChange={(e) =>
                  setWishText(e.target.value)
                }
                maxLength={500}
                placeholder="Залуу гэр бүлд ерөөлөө бичнэ үү..."
              />
            </label>

            <div className="character-count">
              {wishText.length}/500
            </div>

            <button
              className="send-btn wish-send"
              onClick={sendWish}
            >
              ИЛГЭЭХ
            </button>
          </div>
        </section>

        <section className="share-section">
          <div className="section-label">
            УРИЛГАА ХУВААЛЦАХ
          </div>

          <div className="share-buttons">
            <button onClick={copyShareLink}>
              🔗 ЛИНК ХУУЛАХ
            </button>

            <button onClick={nativeShare}>
              ↗ ХУВААЛЦАХ
            </button>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-heart">♥</div>

          <div className="footer-names">
            {names}
          </div>

          <p>© 2026 {names}</p>

          <button
            onClick={() => {
              setScreen("form");
              window.scrollTo(0, 0);
            }}
          >
            ← Засах
          </button>
        </footer>
      </main>
    </>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
}

function ImagePicker({
  title,
  subtitle,
  image,
  inputRef,
  onChange,
  onRemove,
}) {
  return (
    <div className="upload-card">
      <div className="upload-icon">📷</div>

      <h3>{title}</h3>

      <p>{subtitle}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        hidden
      />

      {!image ? (
        <button
          className="choose-photo"
          onClick={() =>
            inputRef.current?.click()
          }
        >
          ＋ Зураг сонгох
        </button>
      ) : (
        <>
          <div className="upload-preview">
            <img src={image} alt="" />
          </div>

          <div className="upload-actions">
            <button
              onClick={() =>
                inputRef.current?.click()
              }
            >
              ↻ Солих
            </button>

            <button
              className="remove-photo"
              onClick={onRemove}
            >
              Арилгах
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CountBox({ value, label }) {
  return (
    <div className="count-box">
      <strong>
        {String(value).padStart(2, "0")}
      </strong>

      <span>{label}</span>
    </div>
  );
}

function RsvpOption({
  value,
  subtitle,
  selected,
  setSelected,
}) {
  return (
    <label
      className={`rsvp-option ${
        selected === value ? "selected" : ""
      }`}
    >
      <input
        type="radio"
        checked={selected === value}
        onChange={() => setSelected(value)}
      />

      <div>
        <strong>{value}</strong>
        <span>{subtitle}</span>
      </div>
    </label>
  );
}

function formatDate(date) {
  if (!date) return "Огноо";

  const value = new Date(
    `${date}T00:00:00`
  );

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  const months = [
    "1-р сар",
    "2-р сар",
    "3-р сар",
    "4-р сар",
    "5-р сар",
    "6-р сар",
    "7-р сар",
    "8-р сар",
    "9-р сар",
    "10-р сар",
    "11-р сар",
    "12-р сар",
  ];

  return `${months[value.getMonth()]} ${value.getDate()}, ${value.getFullYear()}`;
}

const css = `
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

:root {
  --green: #06472f;
  --gold: #bd971f;
  --cream: #fbf7f2;
  --card: #fffaf5;
  --line: #e1d4c0;
}

/* ===============================
   HOME
================================ */

.home-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #fbf7f2;
  font-family: Arial, sans-serif;
}

.home-card {
  width: min(500px, 100%);
  padding: 35px 15px;
  text-align: center;
}

.home-ring {
  font-size: 48px;
}

.tiny-title,
.section-label {
  font-family: Arial, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
}

.tiny-title {
  color: #a47e13;
}

.home-card h1 {
  margin: 12px 0 8px;
  color: #06472f;
  font-family: Georgia, serif;
  font-size: clamp(38px, 7vw, 58px);
  font-style: italic;
  font-weight: 500;
}

.home-card p {
  max-width: 390px;
  margin: auto;
  color: #777;
  line-height: 1.6;
}

.main-button,
.continue-button {
  border: 0;
  border-radius: 999px;
  background: #06472f;
  color: white;
  font-weight: 700;
}

.main-button {
  margin-top: 22px;
  padding: 14px 30px;
}

/* ===============================
   TEMPLATES
================================ */

.template-page {
  min-height: 100vh;
  padding: 25px 15px 60px;
  background: #f7f2ed;
  font-family: Arial, sans-serif;
}

.template-page-inner {
  width: min(1000px, 100%);
  margin: auto;
}

.back-link {
  padding: 7px 0;
  border: 0;
  background: transparent;
  color: #555;
}

.template-heading {
  padding: 22px 0 25px;
  text-align: center;
}

.template-heading h1 {
  margin: 7px 0;
  color: #06472f;
  font-family: Georgia, serif;
  font-size: clamp(32px, 5vw, 46px);
  font-weight: 500;
}

.template-heading p {
  color: #777;
}

.template-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(170px, 1fr));
  gap: 14px;
}

.template-card {
  position: relative;
  padding: 11px;
  border: 2px solid transparent;
  border-radius: 20px;
  background: white;
  text-align: left;
}

.template-card.active {
  border-color: #ad8b25;
  box-shadow: 0 10px 28px rgba(0,0,0,.08);
}

.template-preview {
  height: 240px;
  padding: 13px;
  overflow: hidden;
  border-radius: 14px;
}

.template-classic .template-preview {
  background: #fbf7f2;
  color: #06472f;
}

.template-rose .template-preview {
  background: #fceef0;
  color: #985666;
}

.template-sage .template-preview {
  background: #edf2e9;
  color: #586f55;
}

.template-midnight .template-preview {
  background: #182238;
  color: #d5bb69;
}

.template-minimal .template-preview {
  background: #f4f4f2;
  color: #333;
}

.template-mini-heart {
  text-align: center;
}

.template-mini-photo {
  height: 105px;
  margin-top: 10px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(255,255,255,.55);
  font-size: 38px;
}

.template-mini-name {
  margin-top: 12px;
  text-align: center;
  font-family: Georgia, serif;
  font-size: 23px;
  font-style: italic;
}

.template-mini-line {
  width: 35px;
  height: 1px;
  margin: 7px auto;
  background: currentColor;
}

.template-mini-box {
  height: 21px;
  margin-top: 8px;
  border: 1px solid currentColor;
  border-radius: 6px;
  opacity: .35;
}

.template-mini-box.small {
  height: 14px;
}

.template-info {
  padding: 9px 4px 4px;
}

.template-info strong,
.template-info span {
  display: block;
}

.template-info span {
  margin-top: 3px;
  color: #888;
  font-size: 11px;
}

.template-selected {
  position: absolute;
  top: 17px;
  right: 17px;
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #06472f;
  color: white;
}

.continue-button {
  display: block;
  margin: 27px auto 0;
  padding: 14px 28px;
}

/* ===============================
   EDIT FORM
================================ */

.form-page {
  min-height: 100vh;
  padding: 24px 14px 55px;
  background: #f5ede6;
  font-family: Arial, sans-serif;
}

.editor-card {
  max-width: 680px;
  margin: auto;
  padding: 25px;
  border-radius: 22px;
  background: white;
  box-shadow: 0 12px 40px rgba(0,0,0,.06);
}

.editor-head {
  text-align: center;
}

.editor-head h1 {
  margin: 7px 0;
  color: #06472f;
}

.editor-head p {
  color: #888;
}

.selected-template-label {
  margin: 17px 0;
  padding: 10px;
  border-radius: 11px;
  background: #f6f2ed;
  text-align: center;
  color: #666;
  font-size: 13px;
}

.form-grid {
  display: grid;
  gap: 16px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
  color: #555;
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 12px;
  outline: none;
}

.field textarea {
  resize: vertical;
  line-height: 1.5;
}

.field small {
  text-align: right;
  color: #aaa;
}

.upload-card {
  padding: 18px;
  border: 1px solid #e4dbcf;
  border-radius: 17px;
  background: #fffdf9;
  text-align: center;
}

.upload-icon {
  font-size: 26px;
}

.upload-card h3 {
  margin: 6px 0;
  color: #06472f;
}

.upload-card p {
  margin: 4px 0 11px;
  color: #999;
  font-size: 12px;
}

.choose-photo {
  width: 100%;
  padding: 12px;
  border: 1px dashed #bba486;
  border-radius: 11px;
  background: #fff7ed;
}

.upload-preview {
  margin-top: 12px;
  padding: 7px;
  border-radius: 12px;
  background: #f4efe9;
}

.upload-preview img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  display: block;
  border-radius: 9px;
}

.upload-actions {
  margin-top: 9px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.upload-actions button {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: white;
}

.remove-photo {
  color: #9d4949;
}

.gallery-editor {
  margin-top: 12px;
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
}

.gallery-edit-item {
  position: relative;
}

.gallery-edit-item img {
  width: 100%;
  height: 100px;
  object-fit: contain;
  background: #f2eee9;
  border-radius: 9px;
}

.gallery-edit-item span {
  position: absolute;
  left: 5px;
  bottom: 5px;
  width: 21px;
  height: 21px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(0,0,0,.6);
  color: white;
  font-size: 10px;
}

.gallery-edit-item button {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: rgba(0,0,0,.65);
  color: white;
}

.preview-btn {
  width: 100%;
  padding: 14px;
  border: 0;
  border-radius: 999px;
  background: #06472f;
  color: white;
  font-weight: 700;
}

/* ===============================
   THEMES
================================ */

.invitation-classic {
  --theme: #06472f;
  --theme2: #0d583d;
  --accent2: #bd971f;
  --page2: #fbf7f2;
  --card2: #fffaf5;
  --border2: #e1d4c0;
}

.invitation-rose {
  --theme: #95596a;
  --theme2: #ab6979;
  --accent2: #be8f7d;
  --page2: #fff7f7;
  --card2: #fffafa;
  --border2: #ead1d7;
}

.invitation-sage {
  --theme: #566e53;
  --theme2: #71866e;
  --accent2: #a38d5b;
  --page2: #f4f6f1;
  --card2: #fbfcf8;
  --border2: #d9dfd2;
}

.invitation-midnight {
  --theme: #18233c;
  --theme2: #283854;
  --accent2: #c4a650;
  --page2: #f8f4eb;
  --card2: #fffdf5;
  --border2: #ded2b7;
}

.invitation-minimal {
  --theme: #363636;
  --theme2: #555;
  --accent2: #999;
  --page2: #f7f7f5;
  --card2: #fff;
  --border2: #ddd;
}

/* ===============================
   INVITATION
================================ */

.invitation {
  min-height: 100vh;
  background: var(--page2);
  color: var(--theme);
  font-family: Georgia, serif;
  overflow-x: hidden;
}

.topbar {
  min-height: 68px;
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 58px 1fr 58px;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,.05);
  background: rgba(255,252,248,.95);
  backdrop-filter: blur(10px);
}

.menu-btn {
  border: 0;
  background: transparent;
  color: var(--theme);
  font-size: 25px;
}

.topbar-name {
  text-align: center;
  font-size: clamp(21px,4vw,30px);
  font-style: italic;
}

.music-note {
  text-align: center;
  color: var(--theme);
  font-size: 24px;
}

/* ===============================
   HERO
================================ */

.hero-section {
  width: 100%;
  padding: 14px 0 18px;
}

.hero-stage {
  position: relative;
  width: min(760px, calc(100% - 20px));
  margin: auto;
  overflow: hidden;
  border: 1px solid var(--border2);
  border-radius: 22px;
  background: #eee9e3;
  box-shadow: 0 10px 30px rgba(0,0,0,.055);
}

.hero-image {
  width: 100%;
  height: auto;
  max-height: 720px;
  display: block;
  object-fit: contain;
  object-position: center;
}

.hero-placeholder {
  min-height: 480px;
  display: grid;
  place-items: center;
  color: #999;
}

.hero-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 43%;
  background:
    linear-gradient(
      to bottom,
      transparent,
      rgba(251,247,242,.72) 55%,
      var(--page2) 100%
    );
  pointer-events: none;
}

.hero-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  padding: 0 16px;
  text-align: center;
}

.hero-label {
  color: var(--accent2);
  font-family: Arial, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 5px;
}

.hero-overlay h1 {
  margin: 10px 0 8px;
  color: var(--theme);
  font-size: clamp(37px,7vw,58px);
  font-weight: 500;
  font-style: italic;
}

.heart-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--accent2);
}

.heart-line span {
  width: 42px;
  height: 1px;
  background: var(--accent2);
}

/* ===============================
   COMMON WIDTHS
================================ */

.compact-section {
  margin-left: auto;
  margin-right: auto;
  padding: 10px 0;
}

.greeting-width {
  width: min(520px, calc(100% - 28px));
}

.date-width {
  width: min(520px, calc(100% - 28px));
}

.venue-width {
  width: min(540px, calc(100% - 28px));
}

.section-label {
  color: var(--accent2);
  text-align: center;
}

.section-label.left {
  text-align: left;
}

/* ===============================
   GREETING
================================ */

.greeting-card {
  width: 100%;
  padding: 24px 22px;
  overflow: hidden;
  border: 1px solid var(--border2);
  border-radius: 19px;
  background: var(--card2);
  text-align: center;
}

.ornament {
  color: var(--accent2);
  font-size: 18px;
}

.ornament.bottom {
  margin-top: 10px;
}

.short-line {
  width: 50px;
  height: 1px;
  margin: 10px auto;
  background: var(--accent2);
  opacity: .6;
}

.greeting-card h3 {
  margin: 6px 0 8px;
  font-size: 24px;
  font-weight: 500;
  font-style: italic;
}

.greeting-card p {
  width: 100%;
  max-width: 100%;
  margin: 6px auto 0;
  color: #5d5954;
  font-size: 16px;
  line-height: 1.65;
  font-style: italic;
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: normal;
}

/* ===============================
   DATE
================================ */

.date-time-card {
  padding: 18px 15px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  border: 1px solid var(--border2);
  border-radius: 18px;
  background: var(--card2);
}

.date-block {
  min-width: 0;
  text-align: center;
}

.date-icon {
  margin-bottom: 6px;
  color: var(--accent2);
  font-size: 21px;
}

.date-block strong {
  display: block;
  margin-top: 7px;
  font-size: clamp(18px,3vw,25px);
  font-weight: 500;
  overflow-wrap: anywhere;
}

.vertical-line {
  width: 1px;
  height: 55px;
  background: var(--border2);
}

/* ===============================
   COUNTDOWN
================================ */

.countdown-section {
  width: min(520px, calc(100% - 28px));
  margin: auto;
  padding: 19px 0 25px;
  text-align: center;
}

.countdown-grid {
  margin-top: 13px;
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 7px;
}

.count-box {
  padding: 12px 2px;
  border-radius: 14px;
  background: white;
  box-shadow: 0 6px 18px rgba(0,0,0,.045);
}

.count-box strong {
  display: block;
  color: var(--theme);
  font-size: clamp(23px,5vw,32px);
}

.count-box span {
  display: block;
  margin-top: 2px;
  color: #777;
  font-family: Arial,sans-serif;
  font-size: 9px;
}

.today-card {
  margin-top: 13px;
  padding: 14px;
  border: 1px solid var(--accent2);
  border-radius: 14px;
}

.empty-text {
  color: #888;
}

/* ===============================
   VENUE
================================ */

.venue-card {
  overflow: hidden;
  border: 1px solid var(--border2);
  border-radius: 19px;
  background: var(--card2);
}

.venue-photo-area {
  min-height: 205px;
  padding: 9px;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,.025);
}

.venue-photo-area img {
  width: 100%;
  height: 205px;
  object-fit: contain;
  display: block;
  border-radius: 11px;
}

.venue-placeholder {
  color: #aaa;
}

.venue-body {
  padding: 18px 19px 20px;
}

.venue-body h2 {
  margin: 8px 0 5px;
  color: var(--theme);
  font-size: clamp(25px,4vw,33px);
  font-style: italic;
  font-weight: 500;
}

.venue-body p {
  margin: 0;
  color: #555;
  font-size: 15px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.map-btn {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin: 12px auto 0;
  padding: 10px 15px;
  border-radius: 999px;
  background: var(--theme);
  color: white;
  text-align: center;
  text-decoration: none;
  font-family: Arial,sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.7px;
}

/* ===============================
   STORY / PHOTO BOOK
================================ */

.story-section {
  padding: 34px 10px 36px;
  background: rgba(255,255,255,.55);
}

.story-header {
  margin-bottom: 17px;
  text-align: center;
}

.story-header h2 {
  margin: 6px 0 4px;
  color: var(--theme);
  font-size: clamp(28px,5vw,38px);
  font-weight: 500;
  font-style: italic;
}

.story-header p {
  margin: 0;
  color: #888;
  font-size: 12px;
}

.book-area {
  width: min(540px, 100%);
  margin: auto;
  display: grid;
  grid-template-columns: 38px 1fr 38px;
  gap: 8px;
  align-items: center;
  perspective: 1600px;
}

.album-shell {
  position: relative;
  padding: 13px;
  border: 1px solid #d8c8b3;
  border-radius: 21px;
  background:
    linear-gradient(145deg,#fffdf9,#eee4d7);
  box-shadow:
    0 18px 35px rgba(0,0,0,.08),
    inset 0 0 0 5px rgba(255,255,255,.55);
}

.album-shell::before {
  content: "";
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(185,153,107,.35);
  border-radius: 16px;
  pointer-events: none;
}

.album-corner {
  position: absolute;
  width: 22px;
  height: 22px;
  z-index: 5;
  opacity: .55;
}

.album-corner::before,
.album-corner::after {
  content: "";
  position: absolute;
  background: var(--accent2);
}

.album-corner::before {
  width: 22px;
  height: 1px;
}

.album-corner::after {
  width: 1px;
  height: 22px;
}

.top-left {
  top: 8px;
  left: 8px;
}

.top-right {
  top: 8px;
  right: 8px;
  transform: rotate(90deg);
}

.bottom-left {
  bottom: 8px;
  left: 8px;
  transform: rotate(-90deg);
}

.bottom-right {
  bottom: 8px;
  right: 8px;
  transform: rotate(180deg);
}

.book {
  position: relative;
  width: 100%;
  height: 390px;
  overflow: hidden;
  border-radius: 13px;
  background: #fff;
  perspective: 1600px;
}

.book-base {
  position: absolute;
  inset: 0;
  padding: 8px;
  display: grid;
  place-items: center;
  background: #fff;
}

.book-base img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 8px;
}

.turning-page {
  position: absolute;
  inset: 0;
  z-index: 6;
  transform-style: preserve-3d;
  pointer-events: none;
}

.turning-front,
.turning-back {
  position: absolute;
  inset: 0;
  padding: 8px;
  display: grid;
  place-items: center;
  background: #fff;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.turning-front img,
.turning-back img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 8px;
}

.turning-back {
  transform: rotateY(180deg);
}

.turning-next {
  transform-origin: left center;
  animation: pageNext .76s cubic-bezier(.42,0,.18,1);
}

.turning-prev {
  transform-origin: right center;
  animation: pagePrev .76s cubic-bezier(.42,0,.18,1);
}

@keyframes pageNext {
  0% {
    transform: rotateY(0deg);
    filter: brightness(1);
  }

  40% {
    filter: brightness(.85);
  }

  100% {
    transform: rotateY(-180deg);
    filter: brightness(1);
  }
}

@keyframes pagePrev {
  0% {
    transform: rotateY(0deg);
    filter: brightness(1);
  }

  40% {
    filter: brightness(.85);
  }

  100% {
    transform: rotateY(180deg);
    filter: brightness(1);
  }
}

.book-spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: 10;
  width: 1px;
  opacity: .2;
  background: linear-gradient(
    to bottom,
    transparent,
    #777,
    transparent
  );
  pointer-events: none;
}

.book-arrow {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border2);
  border-radius: 50%;
  background: white;
  color: var(--theme);
  font-size: 24px;
  box-shadow: 0 5px 15px rgba(0,0,0,.05);
}

.book-arrow:disabled {
  opacity: .45;
}

.page-number {
  margin-top: 12px;
  color: #888;
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 10px;
  letter-spacing: 2px;
}

.story-dots {
  margin-top: 11px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.story-dots button {
  width: 6px;
  height: 6px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #c9c2bb;
}

.story-dots button.active {
  width: 18px;
  border-radius: 999px;
  background: var(--theme);
}

/* ===============================
   RSVP
================================ */

.rsvp-section {
  padding: 29px 12px 22px;
}

.rsvp-card {
  width: min(460px, 100%);
  margin: auto;
  padding: 22px 18px;
  border: 1px solid var(--border2);
  border-radius: 18px;
  background: var(--card2);
}

.rsvp-card h2 {
  margin: 0;
  color: var(--theme);
  text-align: center;
  font-size: clamp(40px,7vw,50px);
  line-height: 1;
  font-style: italic;
  font-weight: 500;
}

.rsvp-intro {
  max-width: 340px;
  margin: 10px auto 14px;
  color: #555;
  text-align: center;
  font-size: 15px;
  line-height: 1.4;
  font-style: italic;
}

.field-heading {
  margin: 14px 0 7px;
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.5px;
}

.rsvp-name-input {
  display: block;
  width: min(280px,100%);
  margin: auto;
  padding: 10px 13px;
  border: 1.5px solid #d4ddd7;
  border-radius: 12px;
  outline: none;
}

.rsvp-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}

.rsvp-option {
  width: min(335px,100%);
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #d6ded9;
  border-radius: 12px;
  background: white;
  font-family: Arial,sans-serif;
}

.rsvp-option.selected {
  border-color: var(--theme);
  background: rgba(0,0,0,.015);
}

.rsvp-option strong,
.rsvp-option span {
  display: block;
}

.rsvp-option strong {
  color: var(--theme);
  font-size: 14px;
  font-weight: 600;
}

.rsvp-option span {
  margin-top: 1px;
  color: #89958d;
  font-size: 11px;
}

.send-btn {
  border: 0;
  border-radius: 999px;
  background: var(--theme);
  color: white;
  font-family: Arial,sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.rsvp-send {
  display: block;
  width: min(280px,100%);
  margin: 14px auto 0;
  padding: 11px;
}

.success-message {
  margin-top: 10px;
  color: #387153;
  text-align: center;
  font-size: 13px;
}

/* ===============================
   WISHES
================================ */

.wish-section {
  padding: 24px 12px 28px;
}

.wish-heading {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-family: Arial,sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
}

.wish-heading span {
  width: 28px;
  height: 1px;
  background: var(--theme);
}

.wish-list {
  width: min(460px,100%);
  margin: 0 auto 12px;
}

.wish-card {
  position: relative;
  margin-bottom: 9px;
  padding: 18px;
  border-radius: 17px;
  background: #fff7e3;
}

.quote-mark {
  position: absolute;
  right: 13px;
  top: -4px;
  color: #ddd4bd;
  font-size: 42px;
}

.wish-card p {
  max-width: 390px;
  margin: 7px auto 10px;
  color: #555;
  text-align: center;
  font-size: 17px;
  line-height: 1.5;
  font-style: italic;
  overflow-wrap: anywhere;
}

.wish-author {
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
}

.wish-form {
  width: min(460px,100%);
  margin: auto;
  padding: 18px;
  border: 1px solid var(--border2);
  border-radius: 18px;
  background: var(--card2);
}

.wish-form-title {
  margin-bottom: 11px;
  color: var(--theme);
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
}

.wish-form label {
  display: block;
  margin-top: 9px;
  color: #8d8b80;
  font-family: Arial,sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
}

.wish-name-label {
  width: min(280px,100%);
  margin-left: auto;
  margin-right: auto;
}

.wish-form input,
.wish-form textarea {
  width: 100%;
  padding: 8px 0;
  border: 0;
  border-bottom: 1px solid #cfc6b7;
  background: transparent;
  outline: none;
  color: #555;
  font-family: Georgia,serif;
  font-size: 15px;
}

.wish-form textarea {
  min-height: 76px;
  resize: vertical;
  line-height: 1.45;
  font-style: italic;
}

.character-count {
  margin-top: 2px;
  color: #999;
  text-align: right;
  font-family: Arial,sans-serif;
  font-size: 9px;
}

.wish-send {
  display: block;
  width: min(280px,100%);
  margin: 13px auto 0;
  padding: 11px;
}

/* ===============================
   SHARE
================================ */

.share-section {
  width: min(460px, calc(100% - 24px));
  margin: auto;
  padding: 19px 0 25px;
}

.share-buttons {
  margin-top: 11px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.share-buttons button {
  padding: 11px 7px;
  border: 1px solid var(--accent2);
  border-radius: 999px;
  background: var(--theme);
  color: white;
  font-family: Arial,sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.3px;
}

/* ===============================
   FOOTER
================================ */

.footer {
  padding: 27px 15px 22px;
  text-align: center;
  background: var(--theme);
  color: #efd16d;
}

.footer-heart {
  font-size: 20px;
}

.footer-names {
  margin-top: 5px;
  font-size: clamp(29px,6vw,41px);
  font-style: italic;
}

.footer p {
  margin: 7px 0;
  font-family: Arial,sans-serif;
  font-size: 9px;
  letter-spacing: 1.5px;
}

.footer button {
  margin-top: 4px;
  padding: 7px 16px;
  border: 1px solid #efd16d;
  border-radius: 999px;
  background: transparent;
  color: #efd16d;
}

/* ===============================
   MOBILE
================================ */

@media (max-width: 620px) {
  .template-grid {
    grid-template-columns: 1fr 1fr;
    gap: 9px;
  }

  .template-preview {
    height: 210px;
    padding: 9px;
  }

  .template-mini-photo {
    height: 92px;
  }

  .template-mini-name {
    font-size: 19px;
  }

  .editor-card {
    padding: 19px 14px;
  }

  .two-column {
    grid-template-columns: 1fr;
  }

  .topbar {
    min-height: 61px;
    grid-template-columns: 50px 1fr 50px;
  }

  .hero-section {
    padding: 8px 0 13px;
  }

  .hero-stage {
    width: calc(100% - 12px);
    border-radius: 17px;
  }

  .hero-image {
    width: 100%;
    height: auto;
    max-height: 680px;
    object-fit: contain;
  }

  .hero-placeholder {
    min-height: 420px;
  }

  .hero-overlay {
    bottom: 24px;
  }

  .hero-overlay h1 {
    font-size: clamp(35px,10vw,47px);
  }

  .greeting-width,
  .date-width,
  .venue-width,
  .countdown-section {
    width: calc(100% - 36px);
  }

  .greeting-card {
    padding: 21px 16px;
    border-radius: 16px;
  }

  .greeting-card p {
    font-size: 15px;
    line-height: 1.6;
  }

  .date-time-card {
    padding: 15px 8px;
    gap: 7px;
    border-radius: 16px;
  }

  .date-block strong {
    font-size: 17px;
  }

  .vertical-line {
    height: 50px;
  }

  .countdown-section {
    padding: 17px 0 22px;
  }

  .countdown-grid {
    gap: 5px;
  }

  .count-box {
    padding: 10px 1px;
  }

  .count-box strong {
    font-size: 25px;
  }

  .venue-photo-area {
    min-height: 185px;
  }

  .venue-photo-area img {
    height: 185px;
  }

  .venue-body {
    padding: 16px;
  }

  .story-section {
    padding: 29px 8px 31px;
  }

  .story-header h2 {
    font-size: 30px;
  }

  .book-area {
    width: min(460px,100%);
    grid-template-columns: 31px 1fr 31px;
    gap: 5px;
  }

  .book-arrow {
    width: 30px;
    height: 30px;
    font-size: 21px;
  }

  .album-shell {
    padding: 9px;
    border-radius: 17px;
  }

  .book {
    height: 330px;
    border-radius: 10px;
  }

  .book-base,
  .turning-front,
  .turning-back {
    padding: 6px;
  }

  .rsvp-section {
    padding: 25px 14px 19px;
  }

  .rsvp-card {
    width: min(390px, calc(100% - 14px));
    padding: 20px 14px;
  }

  .rsvp-card h2 {
    font-size: 43px;
  }

  .rsvp-name-input {
    width: min(245px,100%);
  }

  .rsvp-option {
    width: min(300px,100%);
  }

  .rsvp-send {
    width: min(245px,100%);
  }

  .wish-section {
    padding: 21px 14px 25px;
  }

  .wish-list,
  .wish-form {
    width: min(390px, calc(100% - 14px));
  }

  .wish-form {
    padding: 16px;
  }

  .wish-name-label {
    width: min(245px,100%);
  }

  .wish-send {
    width: min(245px,100%);
  }

  .share-section {
    width: min(390px, calc(100% - 40px));
  }

  .footer {
    padding: 24px 14px 20px;
  }
}

@media (max-width: 390px) {
  .template-grid {
    grid-template-columns: 1fr;
  }

  .hero-stage {
    width: calc(100% - 8px);
  }

  .greeting-width,
  .date-width,
  .venue-width,
  .countdown-section {
    width: calc(100% - 28px);
  }

  .date-time-card {
    grid-template-columns: 1fr;
  }

  .vertical-line {
    width: 65%;
    height: 1px;
    margin: auto;
  }

  .count-box strong {
    font-size: 22px;
  }

  .book {
    height: 300px;
  }

  .rsvp-card,
  .wish-list,
  .wish-form {
    width: calc(100% - 10px);
  }

  .share-buttons {
    grid-template-columns: 1fr;
  }
}
`;
