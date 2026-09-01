"use client";

import { useEffect, useRef, useState } from "react";

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
    }, 720);
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

  function buildShareLink() {
    const slug = encodeURIComponent(
      `${form.groom || "groom"}-${
        form.bride || "bride"
      }-${form.date || "wedding"}`
    );

    return `${window.location.origin}/?invite=${slug}`;
  }

  async function copyShareLink() {
    const link = buildShareLink();

    try {
      await navigator.clipboard.writeText(link);
      alert("Урилгын линк хуулагдлаа.");
    } catch {
      window.prompt("Энэ линкийг хуулна уу:", link);
    }
  }

  async function nativeShare() {
    const link = buildShareLink();

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
                Доорх 5 загвараас сонгоно уу.
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
                  Дээд тал нь 8 зураг. Урилга дээр нэг
                  нэгээрээ хуудас шиг эргэнэ.
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

            <p>{greeting}</p>

            <div className="ornament bottom">
              ❦
            </div>
          </div>
        </section>

        <section className="compact-section date-width">
          <div className="date-time-card">
            <div className="date-block">
              <div className="date-icon">▣</div>

              <div className="section-label">
                ОГНОО
              </div>

              <strong>{formatDate(form.date)}</strong>
            </div>

            <div className="vertical-line" />

            <div className="date-block">
              <div className="date-icon">◷</div>

              <div className="section-label">
                ЦАГ
              </div>

              <strong>
                {form.time || "17:00"}
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
                ★ БАЙРШИЛ
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

              <p>← Зургийг эргүүлж үзээрэй →</p>
            </div>

            <div className="book-area">
              <button
                className="book-arrow"
                onClick={previousGallery}
                disabled={flip.active}
              >
                ‹
              </button>

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
              Таны ирэх нь бидний хувьд хүндэтгэл!
            </p>

            <div className="field-heading">
              НЭР
            </div>

            <input
              className="large-input"
              value={rsvpName}
              onChange={(e) =>
                setRsvpName(e.target.value)
              }
              placeholder="Таны нэр"
            />

            <div className="field-heading">
              ХУРИМД ИРЭХ ҮҮ?
            </div>

            <RsvpOption
              value="Ирнэ"
              subtitle="Хуримд оролцоно"
              selected={rsvpStatus}
              setSelected={setRsvpStatus}
            />

            <RsvpOption
              value="Одоогоор мэдэхгүй"
              subtitle="Тодорхойгүй"
              selected={rsvpStatus}
              setSelected={setRsvpStatus}
            />

            <RsvpOption
              value="Ирэхгүй"
              subtitle="Оролцох боломжгүй"
              selected={rsvpStatus}
              setSelected={setRsvpStatus}
            />

            <button
              className="send-btn"
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
                  <p>“{wish.text}”</p>

                  <div className="wish-author">
                    — {wish.name} —
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="wish-form">
            <label>
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
                placeholder="Ерөөлөө бичнэ үү..."
              />
            </label>

            <div className="character-count">
              {wishText.length}/500
            </div>

            <button
              className="send-btn"
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
          <div className="footer-heart">
            ♥
          </div>

          <div className="footer-names">
            {names}
          </div>

          <p>
            © 2026 {names}
          </p>

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
  --theme: #06472f;
  --accent: #c49a21;
  --page: #fbf7f2;
  --card: #fffaf5;
  --border: #e1d4c0;
}

/* HOME */

.home-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #fbf7f2;
  font-family: Arial, sans-serif;
}

.home-card {
  width: min(520px, 100%);
  text-align: center;
  padding: 35px 15px;
}

.home-ring {
  font-size: 48px;
}

.home-card h1 {
  margin: 12px 0 8px;
  color: #06472f;
  font-family: Georgia, serif;
  font-size: clamp(38px, 7vw, 58px);
  font-weight: 500;
  font-style: italic;
}

.home-card p {
  max-width: 400px;
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

/* TEMPLATE */

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
