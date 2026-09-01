"use client";

import { useEffect, useRef, useState } from "react";

const TEMPLATES = [
  {
    id: "classic",
    name: "Сонгодог",
    description: "Ногоон, алтлаг · Цэвэр тансаг",
    preview: "🌿",
  },
  {
    id: "rose",
    name: "Rose",
    description: "Ягаан, крем · Зөөлөн романтик",
    preview: "🌸",
  },
  {
    id: "sage",
    name: "Sage",
    description: "Сэйж ногоон · Байгалийн",
    preview: "🕊️",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Хар хөх, алтлаг · Тансаг",
    preview: "✨",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Цагаан, саарал · Орчин үеийн",
    preview: "🤍",
  },
];

export default function Home() {
  const [screen, setScreen] = useState("home");
  const [template, setTemplate] = useState("classic");

  const heroInput = useRef(null);
  const venueInput = useRef(null);
  const galleryInput = useRef(null);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryDirection, setGalleryDirection] = useState("next");

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
    "Эрхэм зочид оо! Хүүхэд үеийнхээ шинэ гэр бүл болох баярт ёслолд хүрэлцэн ирж, бидний аз жаргалтай мөчийг хуваалцахыг хүндэтгэн урьж байна.";

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
    setForm((prev) => {
      const newGallery = prev.gallery.filter(
        (photo) => photo.id !== id
      );

      return {
        ...prev,
        gallery: newGallery,
      };
    });

    setGalleryIndex(0);
  }

  function previousGallery() {
    if (!form.gallery.length) return;

    setGalleryDirection("prev");

    setGalleryIndex((prev) =>
      prev === 0 ? form.gallery.length - 1 : prev - 1
    );
  }

  function nextGallery() {
    if (!form.gallery.length) return;

    setGalleryDirection("next");

    setGalleryIndex((prev) =>
      prev === form.gallery.length - 1 ? 0 : prev + 1
    );
  }

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
              Өөрийн загвараа сонгоод хуримын онлайн урилгаа
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
                Доорх 5 загвараас өөрийн хуримд тохирох
                загварыг сонгоно уу.
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
                    <div className="template-mini-top">
                      ♥
                    </div>

                    <div className="template-mini-photo">
                      {item.preview}
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
                      ✓ Сонгосон
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
              Энэ загвараар үргэлжлүүлэх →
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
                Мэдээллээ бөглөж, зурагнуудаа оруулна уу.
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
                placeholder="Дүүрэг, хороо, гудамж..."
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
                subtitle="Урилгын хамгийн эхэнд харагдана"
                image={form.heroPhoto}
                inputRef={heroInput}
                onChange={chooseHero}
                onRemove={removeHero}
              />

              <ImagePicker
                title="Хурим болох газрын зураг"
                subtitle="Байршлын хэсэгт харагдана"
                image={form.venuePhoto}
                inputRef={venueInput}
                onChange={chooseVenue}
                onRemove={removeVenue}
              />

              <div className="upload-card">
                <div className="upload-icon">🖼</div>

                <h3>Хуримын дурсамжийн зургууд</h3>

                <p>
                  8 хүртэл зураг оруулж болно. Урилга дээр
                  нэг нэгээрээ харагдана.
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
                  rows={5}
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

            <div className="hero-fade" />

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

        <section className="compact-section">
          <div className="greeting-card">
            <div className="ornament">✦</div>

            <div className="section-label">
              УРИЛГЫН МЭНДЧИЛГЭЭ
            </div>

            <div className="short-line" />

            <h3>{names}</h3>

            <p>{greeting}</p>

            <div className="ornament bottom">
              ❦
            </div>
          </div>
        </section>

        <section className="compact-section">
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
          <div className="section-label gold">
            ХУРИМ ХҮРТЭЛ
          </div>

          {!form.date ? (
            <p className="empty-text">
              Хуримын огноогоо сонгоно уу
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

        <section className="compact-section">
          <div className="venue-card">
            <div className="venue-layout">
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
          </div>
        </section>

        {form.gallery.length > 0 && (
          <section className="story-section">
            <div className="story-header">
              <div className="section-label gold">
                БИДНИЙ ТҮҮХ
              </div>

              <h2>Хуримын дурсамжууд</h2>

              <p>
                Зургийг нэг нэгээр нь үзээрэй
              </p>
            </div>

            <div className="photo-book">
              <button
                className="book-arrow left-arrow"
                onClick={previousGallery}
                aria-label="Өмнөх зураг"
              >
                ‹
              </button>

              <div className="book-page">
                <div
                  key={galleryIndex}
                  className={`book-photo-wrap flip-${galleryDirection}`}
                >
                  <img
                    src={
                      form.gallery[galleryIndex]?.src
                    }
                    alt={`Дурсамж ${
                      galleryIndex + 1
                    }`}
                  />

                  <div className="book-shadow" />
                </div>

                <div className="page-number">
                  {galleryIndex + 1} /{" "}
                  {form.gallery.length}
                </div>
              </div>

              <button
                className="book-arrow right-arrow"
                onClick={nextGallery}
                aria-label="Дараагийн зураг"
              >
                ›
              </button>
            </div>

            <div className="story-dots">
              {form.gallery.map((photo, index) => (
                <button
                  key={photo.id}
                  className={
                    galleryIndex === index
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setGalleryDirection(
                      index > galleryIndex
                        ? "next"
                        : "prev"
                    );
                    setGalleryIndex(index);
                  }}
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
                  <div className="quote-mark">
                    ”
                  </div>

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
                rows={3}
                maxLength={500}
                placeholder="Залуу гэр бүлд дулаан ерөөл, хүсэлтээ бичнэ үү..."
              />
            </label>

            <div className="character-count">
              {wishText.length}/500
            </div>

            <button
              className="send-btn"
              onClick={sendWish}
            >
              ▷ ИЛГЭЭХ
            </button>
          </div>
        </section>

        <section className="share-section">
          <div className="section-label gold">
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
            © 2026 {names}. ХАЙРААР БҮТЭЭВ.
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
              ↻ Зураг солих
            </button>

            <button
              className="remove-photo"
              onClick={onRemove}
            >
              Зураг арилгах
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
  --accent: #c49a21;
  --page: #fbf7f2;
  --card: #fffaf5;
  --line: #e3d4bd;
  --text: #06472f;
}

/* =========================
   HOME
========================= */

.home-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #fbf7f2;
  font-family: Arial, sans-serif;
}

.home-card {
  width: min(560px, 100%);
  text-align: center;
  padding: 45px 20px;
}

.home-ring {
  font-size: 52px;
}

.home-card h1 {
  margin: 15px 0 10px;
  color: #06472f;
  font-family: Georgia, serif;
  font-size: clamp(40px, 8vw, 62px);
  font-weight: 500;
  font-style: italic;
}

.home-card p {
  max-width: 430px;
  margin: auto;
  color: #777;
  line-height: 1.7;
}

.main-button,
.continue-button {
  border: 0;
  border-radius: 999px;
  background: #06472f;
  color: #fff;
  font-weight: 700;
}

.main-button {
  margin-top: 25px;
  padding: 16px 34px;
}

.tiny-title,
.section-label {
  font-family: Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
}

.tiny-title {
  color: #a47e13;
}

/* =========================
   TEMPLATE SELECT
========================= */

.template-page {
  min-height: 100vh;
  padding: 30px 20px 70px;
  background: #f7f2ed;
  font-family: Arial, sans-serif;
}

.template-page-inner {
  width: min(1100px, 100%);
  margin: auto;
}

.back-link {
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: #555;
}

.template-heading {
  padding: 28px 0 30px;
  text-align: center;
}

.template-heading h1 {
  margin: 8px 0;
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
    repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.template-card {
  position: relative;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 22px;
  background: white;
  text-align: left;
  transition: .25s ease;
}

.template-card.active {
  border-color: #af8b24;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

.template-preview {
  height: 270px;
  padding: 14px;
  overflow: hidden;
  border-radius: 15px;
}

.template-classic .template-preview {
  background: #fbf7f2;
  color: #06472f;
}

.template-rose .template-preview {
  background: #fcedef;
  color: #8a4b58;
}

.template-sage .template-preview {
  background: #eef3eb;
  color: #51674f;
}

.template-midnight .template-preview {
  background: #172238;
  color: #d8bc6a;
}

.template-minimal .template-preview {
  background: #f4f4f2;
  color: #333;
}

.template-mini-top {
  text-align: center;
  font-size: 12px;
}

.template-mini-photo {
  height: 125px;
  margin-top: 12px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(255,255,255,.55);
  font-size: 40px;
}

.template-mini-name {
  margin-top: 14px;
  text-align: center;
  font-family: Georgia, serif;
  font-size: 25px;
  font-style: italic;
}

.template-mini-line {
  width: 35px;
  height: 1px;
  margin: 8px auto;
  background: currentColor;
}

.template-mini-box {
  width: 100%;
  height: 23px;
  margin-top: 10px;
  border: 1px solid currentColor;
  border-radius: 6px;
  opacity: .35;
}

.template-mini-box.small {
  height: 16px;
}

.template-info {
  padding: 10px 4px 5px;
}

.template-info strong,
.template-info span {
  display: block;
}

.template-info strong {
  font-size: 16px;
}

.template-info span {
  margin-top: 4px;
  color: #888;
  font-size: 12px;
}

.template-selected {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 9px;
  border-radius: 999px;
  background: #06472f;
  color: white;
  font-size: 11px;
}

.continue-button {
  display: block;
  margin: 30px auto 0;
  padding: 16px 30px;
}

/* =========================
   FORM
========================= */

.form-page {
  min-height: 100vh;
  padding: 25px 15px 60px;
  background: #f5ede6;
  font-family: Arial, sans-serif;
}

.editor-card {
  max-width: 740px;
  margin: auto;
  padding: 28px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 15px 45px rgba(0,0,0,.07);
}

.editor-head {
  margin-bottom: 22px;
  text-align: center;
}

.editor-head h1 {
  margin: 8px 0;
  color: #06472f;
}

.editor-head p {
  color: #888;
}

.selected-template-label {
  margin-bottom: 20px;
  padding: 11px 15px;
  border-radius: 12px;
  background: #f5f1eb;
  color: #555;
  text-align: center;
  font-size: 13px;
}

.form-grid {
  display: grid;
  gap: 18px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: grid;
  gap: 7px;
  color: #555;
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  padding: 13px 15px;
  border: 1px solid #ddd;
  border-radius: 13px;
  outline: none;
}

.field textarea {
  resize: vertical;
  line-height: 1.6;
}

.field small {
  text-align: right;
  color: #aaa;
}

.upload-card {
  padding: 20px;
  border: 1px solid #e5ddd2;
  border-radius: 19px;
  background: #fffdf9;
  text-align: center;
}

.upload-icon {
  font-size: 27px;
}

.upload-card h3 {
  margin: 7px 0;
  color: #06472f;
}

.upload-card p {
  margin: 5px 0 12px;
  color: #999;
  font-size: 12px;
}

.choose-photo {
  width: 100%;
  padding: 13px;
  border: 1px dashed #bba486;
  border-radius: 12px;
  background: #fff7ed;
}

.upload-preview {
  margin-top: 13px;
  padding: 8px;
  border-radius: 14px;
  background: #f4efe9;
}

.upload-preview img {
  width: 100%;
  height: auto;
  max-height: 430px;
  object-fit: contain;
  display: block;
  border-radius: 11px;
}

.upload-actions {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.upload-actions button {
  padding: 11px;
  border: 1px solid #ccc;
  border-radius: 11px;
  background: white;
}

.remove-photo {
  color: #9c4545;
}

.gallery-editor {
  margin-top: 14px;
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(95px,1fr));
  gap: 9px;
}

.gallery-edit-item {
  position: relative;
}

.gallery-edit-item img {
  width: 100%;
  height: 110px;
  object-fit: contain;
  background: #f1ede8;
  border-radius: 10px;
}

.gallery-edit-item > span {
  position: absolute;
  left: 5px;
  bottom: 5px;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(0,0,0,.6);
  color: white;
  font-size: 11px;
}

.gallery-edit-item button {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 50%;
  background: rgba(0,0,0,.65);
  color: white;
}

.preview-btn {
  width: 100%;
  padding: 15px;
  border: 0;
  border-radius: 999px;
  background: #06472f;
  color: white;
  font-weight: 700;
}

/* =========================
   THEME VARIABLES
========================= */

.invitation-classic {
  --theme: #06472f;
  --theme2: #0c573c;
  --accent2: #c99e24;
  --page2: #fbf7f2;
  --card2: #fffaf5;
  --border2: #e2d3bc;
}

.invitation-rose {
  --theme: #874d59;
  --theme2: #a86372;
  --accent2: #c59881;
  --page2: #fff7f7;
  --card2: #fffafa;
  --border2: #ecd3d8;
}

.invitation-sage {
  --theme: #536b52;
  --theme2: #6b8268;
  --accent2: #a89461;
  --page2: #f4f6f1;
  --card2: #fbfcf8;
  --border2: #d9dfd2;
}

.invitation-midnight {
  --theme: #152139;
  --theme2: #263551;
  --accent2: #caaa57;
  --page2: #f8f4eb;
  --card2: #fffcf4;
  --border2: #ded2b7;
}

.invitation-minimal {
  --theme: #333;
  --theme2: #555;
  --accent2: #999;
  --page2: #f7f7f5;
  --card2: #fff;
  --border2: #ddd;
}

/* =========================
   INVITATION
========================= */

.invitation {
  min-height: 100vh;
  background: var(--page2);
  color: var(--theme);
  font-family: Georgia, serif;
}

.topbar {
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  align-items: center;
  background: rgba(255,252,248,.94);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,0,0,.05);
}

.menu-btn {
  border: 0;
  background: transparent;
  color: var(--theme);
  font-size: 26px;
}

.topbar-name {
  text-align: center;
  font-size: clamp(22px,4vw,32px);
  font-style: italic;
}

.music-note {
  text-align: center;
  color: var(--theme);
  font-size: 24px;
}

/* =========================
   HERO - REFERENCE STYLE
========================= */

.hero-section {
  width: 100%;
  padding: 0;
}

.hero-stage {
  position: relative;
  width: min(760px, 100%);
  margin: auto;
  overflow: hidden;
  background: #eee9e3;
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
  min-height: 500px;
  display: grid;
  place-items: center;
  color: #999;
}

.hero-fade {
  position: absolute;
  inset: auto 0 0;
  height: 42%;
  pointer-events: none;
  background:
    linear-gradient(
      to bottom,
      rgba(251,247,242,0),
      rgba(251,247,242,.75) 55%,
      var(--page2) 100%
    );
}

.hero-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 34px;
  padding: 0 15px;
  text-align: center;
}

.hero-label {
  color: var(--accent2);
  font-family: Arial,sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 5px;
}

.hero-overlay h1 {
  margin: 12px 0 10px;
  color: var(--theme);
  font-size: clamp(39px,7vw,60px);
  font-weight: 500;
  font-style: italic;
}

.heart-line {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
  color: var(--accent2);
}

.heart-line span {
  width: 48px;
  height: 1px;
  background: var(--accent2);
}

/* =========================
   COMMON COMPACT
========================= */

.compact-section {
  width: min(700px, calc(100% - 28px));
  margin: auto;
  padding: 13px 0;
}

.section-label {
  color: var(--accent2);
  text-align: center;
}

.section-label.left {
  text-align: left;
}

.section-label.gold {
  color: var(--accent2);
}

/* =========================
   GREETING
========================= */

.greeting-card {
  padding: 28px 24px;
  border: 1px solid var(--border2);
  border-radius: 22px;
  background: var(--card2);
  text-align: center;
}

.ornament {
  color: var(--accent2);
  font-size: 20px;
}

.ornament.bottom {
  margin-top: 12px;
}

.short-line {
  width: 55px;
  height: 1px;
  margin: 12px auto;
  background: var(--accent2);
  opacity: .6;
}

.greeting-card h3 {
  margin: 8px 0;
  font-size: 26px;
  font-weight: 500;
  font-style: italic;
}

.greeting-card p {
  max-width: 560px;
  margin: 8px auto 0;
  color: #5d5954;
  font-size: 17px;
  line-height: 1.65;
  font-style: italic;
}

/* =========================
   DATE
========================= */

.date-time-card {
  padding: 20px 18px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
  border: 1px solid var(--border2);
  border-radius: 20px;
  background: var(--card2);
}

.date-block {
  text-align: center;
}

.date-icon {
  margin-bottom: 7px;
  color: var(--accent2);
  font-size: 24px;
}

.date-block strong {
  display: block;
  margin-top: 8px;
  font-size: clamp(20px,3vw,27px);
  font-weight: 500;
}

.vertical-line {
  width: 1px;
  height: 64px;
  background: var(--border2);
}

/* =========================
   COUNTDOWN
========================= */

.countdown-section {
  width: min(700px, calc(100% - 28px));
  margin: auto;
  padding: 22px 0 30px;
  text-align: center;
}

.countdown-grid {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 8px;
}

.count-box {
  padding: 14px 3px;
  border-radius: 15px;
  background: white;
  box-shadow: 0 6px 20px rgba(0,0,0,.045);
}

.count-box strong {
  display: block;
  color: var(--theme);
  font-size: clamp(25px,5vw,36px);
}

.count-box span {
  display: block;
  margin-top: 3px;
  color: #777;
  font-family: Arial,sans-serif;
  font-size: 10px;
}

.today-card {
  margin-top: 15px;
  padding: 17px;
  border: 1px solid var(--accent2);
  border-radius: 15px;
}

.empty-text {
  color: #888;
}

/* =========================
   VENUE
========================= */

.venue-card {
  overflow: hidden;
  border: 1px solid var(--border2);
  border-radius: 20px;
  background: var(--card2);
}

.venue-layout {
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 0;
}

.venue-photo-area {
  min-height: 215px;
  display: grid;
  place-items: center;
  padding: 10px;
  background: rgba(0,0,0,.025);
}

.venue-photo-area img {
  width: 100%;
  height: 215px;
  object-fit: contain;
  display: block;
  border-radius: 12px;
}

.venue-placeholder {
  color: #aaa;
}

.venue-body {
  padding: 23px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.venue-body h2 {
  margin: 10px 0 6px;
  color: var(--theme);
  font-size: clamp(26px,4vw,36px);
  font-style: italic;
  font-weight: 500;
}

.venue-body p {
  margin: 0;
  color: #555;
  font-size: 16px;
  line-height: 1.45;
  font-style: italic;
}

.map-btn {
  display: block;
  margin-top: 14px;
  padding: 11px 13px;
  border-radius: 999px;
  background: var(--theme);
  color: white;
  text-align: center;
  text-decoration: none;
  font-family: Arial,sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

/* =========================
   PHOTO BOOK / STORY
========================= */

.story-section {
  padding: 42px 15px 45px;
  background: rgba(255,255,255,.72);
}

.story-header {
  margin-bottom: 20px;
  text-align: center;
}

.story-header h2 {
  margin: 7px 0 5px;
  color: var(--theme);
  font-size: clamp(30px,5vw,42px);
  font-weight: 500;
  font-style: italic;
}

.story-header p {
  margin: 0;
  color: #888;
  font-size: 13px;
}

.photo-book {
  width: min(620px,100%);
  margin: auto;
  display: grid;
  grid-template-columns: 46px 1fr 46px;
  gap: 10px;
  align-items: center;
  perspective: 1200px;
}

.book-page {
  position: relative;
  padding: 11px;
  overflow: hidden;
  border-radius: 20px;
  background: #f5efe7;
  box-shadow: 0 14px 35px rgba(0,0,0,.08);
}

.book-photo-wrap {
  position: relative;
  min-height: 390px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 14px;
  background: white;
  transform-style: preserve-3d;
}

.book-photo-wrap img {
  width: 100%;
  height: 390px;
  object-fit: contain;
  display: block;
}

.flip-next {
  animation: flipNext .52s ease;
  transform-origin: left center;
}

.flip-prev {
  animation: flipPrev .52s ease;
  transform-origin: right center;
}

@keyframes flipNext {
  0% {
    transform: rotateY(-13deg) scale(.97);
    opacity: .55;
  }
  100% {
    transform: rotateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes flipPrev {
  0% {
    transform: rotateY(13deg) scale(.97);
    opacity: .55;
  }
  100% {
    transform: rotateY(0) scale(1);
    opacity: 1;
  }
}

.book-shadow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow:
    inset 14px 0 20px rgba(0,0,0,.025),
    inset -14px 0 20px rgba(0,0,0,.025);
}

.page-number {
  padding: 8px 0 0;
  color: #888;
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
}

.book-arrow {
  width: 44px;
  height: 44px;
  border: 1px solid #ccc;
  border-radius: 50%;
  background: white;
  color: var(--theme);
  font-size: 27px;
}

.story-dots {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  gap: 7px;
}

.story-dots button {
  width: 7px;
  height: 7px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #c9c3bb;
}

.story-dots button.active {
  width: 20px;
  border-radius: 999px;
  background: var(--theme);
}

/* =========================
   RSVP
========================= */

.rsvp-section {
  padding: 38px 15px 26px;
}

.rsvp-card {
  max-width: 590px;
  margin: auto;
  padding: 25px 22px;
  border: 1px solid var(--border2);
  border-radius: 20px;
  background: var(--card2);
}

.rsvp-card h2 {
  margin: 0;
  color: var(--theme);
  text-align: center;
  font-size: clamp(42px,7vw,54px);
  line-height: 1;
  font-style: italic;
  font-weight: 500;
}

.rsvp-intro {
  margin: 12px 0 17px;
  color: #555;
  text-align: center;
  font-size: 16px;
  font-style: italic;
}

.field-heading {
  margin: 16px 0 8px;
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
}

.large-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #d4ddd7;
  border-radius: 13px;
  outline: none;
}

.rsvp-option {
  margin-top: 7px;
  padding: 10px 13px;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 1.5px solid #d6ded9;
  border-radius: 13px;
  background: white;
  font-family: Arial,sans-serif;
}

.rsvp-option.selected {
  border-color: var(--theme);
  background: rgba(0,0,0,.018);
}

.rsvp-option strong,
.rsvp-option span {
  display: block;
}

.rsvp-option strong {
  color: var(--theme);
  font-size: 15px;
  font-weight: 500;
}

.rsvp-option span {
  margin-top: 1px;
  color: #8c9990;
  font-size: 12px;
}

.send-btn {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border: 0;
  border-radius: 999px;
  background: var(--theme);
  color: white;
  font-family: Arial,sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
}

.success-message {
  margin-top: 11px;
  color: #387153;
  text-align: center;
}

/* =========================
   WISHES
========================= */

.wish-section {
  padding: 28px 15px 32px;
}

.wish-heading {
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  font-family: Arial,sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
}

.wish-heading span {
  width: 32px;
  height: 1px;
  background: var(--theme);
}

.wish-list {
  max-width: 570px;
  margin: 0 auto 15px;
}

.wish-card {
  position: relative;
  margin-bottom: 10px;
  padding: 20px 20px;
  border-radius: 18px;
  background: #fff7e3;
}

.quote-mark {
  position: absolute;
  top: -2px;
  right: 14px;
  color: #dddccd;
  font-size: 46px;
}

.wish-card p {
  margin: 8px 0 12px;
  text-align: center;
  font-size: clamp(18px,4vw,25px);
  line-height: 1.45;
  font-style: italic;
}

.wish-author {
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
}

.wish-form {
  max-width: 570px;
  margin: auto;
  padding: 20px;
  border: 1px solid var(--border2);
  border-radius: 19px;
  background: var(--card2);
}

.wish-form-title {
  margin-bottom: 13px;
  color: var(--theme);
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
}

.wish-form label {
  display: block;
  margin-top: 10px;
  color: #8d8b80;
  font-family: Arial,sans-serif;
  font-size: 10px;
  letter-spacing: 2px;
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
  font-size: 16px;
}

.wish-form textarea {
  min-height: 80px;
  resize: vertical;
  line-height: 1.5;
  font-style: italic;
}

.character-count {
  margin-top: 2px;
  color: #999;
  text-align: right;
  font-family: Arial,sans-serif;
  font-size: 9px;
}

/* =========================
   SHARE + FOOTER
========================= */

.share-section {
  max-width: 570px;
  margin: auto;
  padding: 22px 20px 28px;
}

.share-buttons {
  margin-top: 13px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.share-buttons button {
  padding: 12px;
  border: 1px solid var(--accent2);
  border-radius: 999px;
  background: var(--theme);
  color: white;
  font-family: Arial,sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.footer {
  padding: 30px 20px 25px;
  text-align: center;
  background: var(--theme);
  color: #f1d06b;
}

.footer-heart {
  font-size: 22px;
}

.footer-names {
  margin-top: 6px;
  font-size: clamp(31px,6vw,44px);
  font-style: italic;
}

.footer p {
  margin: 8px 0;
  font-family: Arial,sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
}

.footer button {
  margin-top: 5px;
  padding: 8px 17px;
  border: 1px solid #f1d06b;
  border-radius: 999px;
  background: transparent;
  color: #f1d06b;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 620px) {
  .template-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .template-preview {
    height: 220px;
    padding: 10px;
  }

  .template-mini-photo {
    height: 100px;
  }

  .template-mini-name {
    font-size: 20px;
  }

  .editor-card {
    padding: 20px 15px;
  }

  .two-column {
    grid-template-columns: 1fr;
  }

  .topbar {
    height: 62px;
    grid-template-columns: 52px 1fr 52px;
  }

  /* яг жишээ шиг: зураг дэлгэцийн өргөнийг авна */
  .hero-stage {
    width: 100%;
    border-radius: 0;
  }

  .hero-image {
    width: 100%;
    height: auto;
    max-height: 690px;
    object-fit: contain;
  }

  .hero-placeholder {
    min-height: 430px;
  }

  .hero-fade {
    height: 45%;
  }

  .hero-overlay {
    bottom: 26px;
  }

  .hero-overlay h1 {
    font-size: clamp(36px,10vw,48px);
  }

  .compact-section {
    width: calc(100% - 24px);
    padding: 10px 0;
  }

  .greeting-card {
    padding: 24px 18px;
    border-radius: 18px;
  }

  .greeting-card p {
    font-size: 16px;
  }

  .date-time-card {
    padding: 17px 10px;
    gap: 9px;
    border-radius: 17px;
  }

  .date-block strong {
    font-size: 19px;
  }

  .vertical-line {
    height: 56px;
  }

  .countdown-section {
    width: calc(100% - 24px);
    padding: 18px 0 25px;
  }

  .countdown-grid {
    gap: 6px;
  }

  .count-box {
    padding: 12px 1px;
  }

  .count-box strong {
    font-size: 27px;
  }

  .venue-layout {
    grid-template-columns: 1fr;
  }

  .venue-photo-area {
    min-height: 190px;
  }

  .venue-photo-area img {
    height: 190px;
  }

  .venue-body {
    padding: 18px 17px;
  }

  .venue-body h2 {
    font-size: 29px;
  }

  .story-section {
    padding: 32px 10px 35px;
  }

  .photo-book {
    grid-template-columns: 36px 1fr 36px;
    gap: 5px;
  }

  .book-arrow {
    width: 34px;
    height: 34px;
    font-size: 23px;
  }

  .book-page {
    padding: 7px;
    border-radius: 15px;
  }

  .book-photo-wrap {
    min-height: 330px;
    border-radius: 11px;
  }

  .book-photo-wrap img {
    height: 330px;
  }

  .rsvp-section {
    padding: 28px 12px 20px;
  }

  .rsvp-card {
    padding: 21px 16px;
    border-radius: 17px;
  }

  .rsvp-card h2 {
    font-size: 44px;
  }

  .rsvp-intro {
    margin: 10px 0 14px;
    font-size: 15px;
  }

  .field-heading {
    margin: 13px 0 7px;
  }

  .rsvp-option {
    padding: 9px 11px;
  }

  .wish-section {
    padding: 22px 12px 27px;
  }

  .wish-form {
    padding: 17px 15px;
  }

  .wish-form textarea {
    min-height: 70px;
  }

  .share-section {
    padding: 19px 16px 23px;
  }

  .share-buttons {
    grid-template-columns: 1fr 1fr;
    gap: 7px;
  }

  .share-buttons button {
    padding: 11px 5px;
    font-size: 10px;
  }

  .footer {
    padding: 26px 15px 22px;
  }
}

@media (max-width: 390px) {
  .template-grid {
    grid-template-columns: 1fr;
  }

  .count-box strong {
    font-size: 24px;
  }

  .count-box span {
    font-size: 9px;
  }

  .photo-book {
    grid-template-columns: 31px 1fr 31px;
  }

  .book-arrow {
    width: 30px;
    height: 30px;
  }

  .book-photo-wrap,
  .book-photo-wrap img {
    height: 300px;
    min-height: 300px;
  }
}
`;
