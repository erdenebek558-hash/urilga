"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [screen, setScreen] = useState("home");

  const heroInput = useRef(null);
  const venueInput = useRef(null);
  const galleryInput = useRef(null);
  const galleryScroll = useRef(null);

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
    "Хайр сэтгэлээ нэгтгэн, амьдралын шинэ замаа хамтдаа эхлүүлэх энэ дурсамжит өдөр эрхэм таныг бидний хуримын баярт хүрэлцэн ирэхийг хүндэтгэн урьж байна.";

  const displayDate = form.date || "2026-10-10";
  const displayTime = form.time || "17:00";

  function updateForm(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /* =====================================================
     IMAGE
  ===================================================== */

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
      gallery: prev.gallery.filter(
        (photo) => photo.id !== id
      ),
    }));
  }

  /* =====================================================
     COUNTDOWN
  ===================================================== */

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

      if (
        Number.isNaN(target) ||
        difference <= 0
      ) {
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
        days: Math.floor(
          difference / 86400000
        ),

        hours: Math.floor(
          (difference % 86400000) /
            3600000
        ),

        minutes: Math.floor(
          (difference % 3600000) /
            60000
        ),

        seconds: Math.floor(
          (difference % 60000) / 1000
        ),

        finished: false,
      });
    }

    calculate();

    const timer = setInterval(
      calculate,
      1000
    );

    return () => clearInterval(timer);
  }, [form.date, form.time]);

  /* =====================================================
     RSVP
  ===================================================== */

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

  /* =====================================================
     WISH
  ===================================================== */

  function sendWish() {
    if (!wishName.trim()) {
      alert("Нэрээ бичнэ үү.");
      return;
    }

    if (!wishText.trim()) {
      alert("Ерөөлөө бичнэ үү.");
      return;
    }

    const newWish = {
      id: Date.now(),
      name: wishName.trim(),
      text: wishText.trim(),
    };

    setWishes((prev) => [
      newWish,
      ...prev,
    ]);

    setWishName("");
    setWishText("");
  }

  /* =====================================================
     SHARE
  ===================================================== */

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
      await navigator.clipboard.writeText(
        link
      );

      alert("Урилгын линк хуулагдлаа.");
    } catch {
      window.prompt(
        "Энэ линкийг хуулна уу:",
        link
      );
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

  /* =====================================================
     HOME
  ===================================================== */

  if (screen === "home") {
    return (
      <>
        <style>{css}</style>

        <main className="home-page">
          <section className="home-card">
            <div className="home-ring">
              💍
            </div>

            <div className="tiny-title">
              WEDDING INVITATION
            </div>

            <h1 className="home-heading">
              Хуримын урилга
            </h1>

            <p className="home-description">
              Өөрийн хуримын онлайн
              урилгыг хэдхэн алхмаар
              бүтээнэ үү.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                setScreen("form")
              }
            >
              Урилга бүтээх
            </button>
          </section>
        </main>
      </>
    );
  }

  /* =====================================================
     FORM
  ===================================================== */

  if (screen === "form") {
    return (
      <>
        <style>{css}</style>

        <main className="form-page">
          <section className="editor-card">
            <div className="editor-head">
              <div className="tiny-title">
                CREATE YOUR INVITATION
              </div>

              <h1>
                Урилгын мэдээлэл
              </h1>

              <p>
                Доорх мэдээллийг
                бөглөөд урилгаа харна уу.
              </p>
            </div>

            <div className="form-grid">
              <Field
                label="Хүргэний нэр"
                name="groom"
                value={form.groom}
                onChange={updateForm}
                placeholder="Жишээ: Габит"
              />

              <Field
                label="Бүсгүйн нэр"
                name="bride"
                value={form.bride}
                onChange={updateForm}
                placeholder="Жишээ: Акбидай"
              />

              <div className="two-column">
                <label className="field">
                  <span>
                    Хуримын огноо
                  </span>

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
                placeholder="Жишээ: Ахтилек хуримын ордон"
              />

              <Field
                label="Хурим болох газрын хаяг"
                name="venueAddress"
                value={form.venueAddress}
                onChange={updateForm}
                placeholder="Жишээ: Баянзүрх дүүрэг..."
              />

              <Field
                label="Google Maps линк"
                name="mapUrl"
                value={form.mapUrl}
                onChange={updateForm}
                placeholder="https://maps.google.com/..."
              />

              <ImagePicker
                title="Хосын нүүр зураг"
                subtitle="Урилгын хамгийн эхэнд харагдах зураг"
                image={form.heroPhoto}
                inputRef={heroInput}
                onChange={chooseHero}
                onRemove={removeHero}
              />

              <ImagePicker
                title="Хурим болох газрын зураг"
                subtitle="Байршлын хэсэгт харагдах зураг"
                image={form.venuePhoto}
                inputRef={venueInput}
                onChange={chooseVenue}
                onRemove={removeVenue}
              />

              <div className="upload-card">
                <div className="upload-icon">
                  🖼
                </div>

                <h3>
                  Дурсамжийн зургууд
                </h3>

                <p>
                  8 хүртэл зураг сонгож
                  болно
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

                {form.gallery.length >
                  0 && (
                  <div className="gallery-editor">
                    {form.gallery.map(
                      (photo) => (
                        <div
                          className="gallery-edit-item"
                          key={photo.id}
                        >
                          <img
                            src={photo.src}
                            alt=""
                          />

                          <button
                            onClick={() =>
                              removeGalleryPhoto(
                                photo.id
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <label className="field">
                <span>
                  Урилгын мэндчилгээ
                </span>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateForm}
                  rows={6}
                  maxLength={800}
                  placeholder="Хайр сэтгэлээ нэгтгэн..."
                />

                <small>
                  {form.message.length}/800
                </small>
              </label>

              <button
                className="preview-btn"
                onClick={() => {
                  setScreen("preview");

                  window.scrollTo(
                    0,
                    0
                  );
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

  /* =====================================================
     PREVIEW
  ===================================================== */

  return (
    <>
      <style>{css}</style>

      <main className="invitation">
        {/* HEADER */}

        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() =>
              setScreen("form")
            }
          >
            ☰
          </button>

          <div className="topbar-name">
            {names}
          </div>

          <div className="music-note">
            ♪
          </div>
        </header>

        {/* HERO */}

        <section className="hero-section">
          <div className="hero-container">
            {form.heroPhoto ? (
              <img
                className="hero-image"
                src={form.heroPhoto}
                alt="Хосын зураг"
              />
            ) : (
              <div className="hero-placeholder">
                <span>📷</span>
                <p>
                  Хосын нүүр зураг
                </p>
              </div>
            )}

            <div className="hero-gradient" />

            <div className="hero-content">
              <div className="hero-label">
                ХУРИМЫН УРИЛГА
              </div>

              <h1>{names}</h1>

              <div className="hero-line">
                <span />
                ♥
                <span />
              </div>
            </div>
          </div>
        </section>

        {/* GREETING */}

        <section className="normal-section">
          <div className="greeting-card">
            <div className="ornament">
              ✦
            </div>

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

        {/* DATE TIME */}

        <section className="normal-section">
          <div className="date-time-card">
            <div className="date-block">
              <div className="date-icon">
                ◫
              </div>

              <div className="section-label">
                ОГНОО / DATE
              </div>

              <strong>
                {formatDate(
                  displayDate
                )}
              </strong>
            </div>

            <div className="vertical-line" />

            <div className="date-block">
              <div className="date-icon">
                ◷
              </div>

              <div className="section-label">
                ЦАГ / TIME
              </div>

              <strong>
                {displayTime} ЦАГТ
              </strong>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}

        <section className="countdown-section">
          <div className="section-label gold">
            ХУРИМ ХҮРТЭЛ
          </div>

          {!form.date ? (
            <p className="empty-text">
              Хуримын огноогоо
              сонгоно уу
            </p>
          ) : countdown.finished ? (
            <div className="today-card">
              ♥ ӨНӨӨДӨР БИДНИЙ
              ХУРИМЫН ӨДӨР ♥
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
                value={
                  countdown.minutes
                }
                label="Минут"
              />

              <CountBox
                value={
                  countdown.seconds
                }
                label="Секунд"
              />
            </div>
          )}
        </section>

        {/* VENUE */}

        <section className="normal-section">
          <div className="venue-card">
            {form.venuePhoto ? (
              <div className="venue-photo-frame">
                <img
                  src={form.venuePhoto}
                  alt="Хурим болох газар"
                />
              </div>
            ) : (
              <div className="venue-placeholder">
                📍 Хурим болох
                газрын зураг
              </div>
            )}

            <div className="venue-body">
              <div className="section-label venue-label">
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
                  className="map-btn"
                  href={form.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📍 ГАЗРЫН ЗУРГААС
                  ХАРАХ
                </a>
              )}
            </div>
          </div>
        </section>

        {/* GALLERY */}

        {form.gallery.length > 0 && (
          <section className="gallery-section">
            <div className="gallery-heading">
              <div>
                <div className="section-label gold">
                  БИДНИЙ ТҮҮХ
                </div>

                <h2>
                  Хуримын дурсамжууд
                </h2>
              </div>

              <div className="gallery-arrows">
                <button
                  onClick={() =>
                    galleryScroll.current?.scrollBy(
                      {
                        left: -360,
                        behavior:
                          "smooth",
                      }
                    )
                  }
                >
                  ‹
                </button>

                <button
                  onClick={() =>
                    galleryScroll.current?.scrollBy(
                      {
                        left: 360,
                        behavior:
                          "smooth",
                      }
                    )
                  }
                >
                  ›
                </button>
              </div>
            </div>

            <div
              ref={galleryScroll}
              className="gallery-scroll"
            >
              {form.gallery.map(
                (photo) => (
                  <div
                    className="gallery-photo"
                    key={photo.id}
                  >
                    <img
                      src={photo.src}
                      alt=""
                    />
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* RSVP */}

        <section className="rsvp-section">
          <div className="rsvp-card">
            <h2>RSVP</h2>

            <p className="rsvp-intro">
              Таны ирэх нь бидний
              хувьд том хүндэтгэл!
            </p>

            <div className="field-heading">
              НЭРЭЭ БИЧНЭ ҮҮ
            </div>

            <input
              className="large-input"
              value={rsvpName}
              onChange={(e) =>
                setRsvpName(
                  e.target.value
                )
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
              setSelected={
                setRsvpStatus
              }
            />

            <RsvpOption
              value="Одоогоор мэдэхгүй"
              subtitle="Одоохондоо тодорхойгүй"
              selected={rsvpStatus}
              setSelected={
                setRsvpStatus
              }
            />

            <RsvpOption
              value="Ирэхгүй"
              subtitle="Оролцох боломжгүй"
              selected={rsvpStatus}
              setSelected={
                setRsvpStatus
              }
            />

            <button
              className="send-btn"
              onClick={sendRsvp}
            >
              ИЛГЭЭХ
            </button>

            {rsvpSent && (
              <div className="success-message">
                ✓ Таны хариу
                илгээгдлээ
              </div>
            )}
          </div>
        </section>

        {/* WISHES */}

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

                  <p>
                    “{wish.text}”
                  </p>

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
                  setWishName(
                    e.target.value
                  )
                }
                placeholder="Таны нэр..."
              />
            </label>

            <label>
              ТАНЫ ЕРӨӨЛ

              <textarea
                value={wishText}
                onChange={(e) =>
                  setWishText(
                    e.target.value
                  )
                }
                rows={6}
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

        {/* SHARE */}

        <section className="share-section">
          <div className="section-label gold">
            УРИЛГАА ХУВААЛЦАХ
          </div>

          <div className="share-buttons">
            <button
              onClick={copyShareLink}
            >
              🔗 ЛИНК ХУУЛАХ
            </button>

            <button
              onClick={nativeShare}
            >
              ↗ ХУВААЛЦАХ
            </button>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="footer">
          <div className="footer-heart">
            ♥
          </div>

          <div className="footer-names">
            {names}
          </div>

          <p>
            © 2026 {names}. ХАЙРААР
            БҮТЭЭВ.
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

/* =====================================================
   SMALL COMPONENTS
===================================================== */

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
      <div className="upload-icon">
        📷
      </div>

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
            <img
              src={image}
              alt=""
            />
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

function CountBox({
  value,
  label,
}) {
  return (
    <div className="count-box">
      <strong>
        {String(value).padStart(
          2,
          "0"
        )}
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
        selected === value
          ? "selected"
          : ""
      }`}
    >
      <input
        type="radio"
        checked={selected === value}
        onChange={() =>
          setSelected(value)
        }
      />

      <div>
        <strong>{value}</strong>

        <span>{subtitle}</span>
      </div>
    </label>
  );
}

function formatDate(date) {
  if (!date) {
    return "Огноо";
  }

  const value = new Date(
    `${date}T00:00:00`
  );

  if (
    Number.isNaN(value.getTime())
  ) {
    return date;
  }

  const monthNames = [
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

  return `${
    monthNames[value.getMonth()]
  } ${value.getDate()}, ${value.getFullYear()}`;
}

/* =====================================================
   CSS
===================================================== */

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
  --green: #073f2d;
  --green2: #164e3b;
  --gold: #b78d18;
  --cream: #fbf7f2;
  --cream2: #f5eee6;
  --line: #ddd0b8;
  --muted: #7b817c;
}

.home-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, #ffffff 0%, #fbf7f2 40%, #efe6dc 100%);
  font-family: Arial, sans-serif;
}

.home-card {
  width: min(620px, 100%);
  padding: 55px 30px;
  text-align: center;
}

.home-ring {
  font-size: 56px;
  margin-bottom: 20px;
}

.tiny-title,
.section-label {
  font-family: Arial, sans-serif;
  letter-spacing: 4px;
  font-size: 12px;
  font-weight: 700;
}

.tiny-title {
  color: var(--gold);
}

.home-heading {
  margin: 16px 0 10px;
  font-family: Georgia, serif;
  font-size: clamp(38px, 7vw, 62px);
  color: var(--green);
  font-weight: 500;
}

.home-description {
  color: #777;
  line-height: 1.7;
}

.primary-btn,
.preview-btn {
  border: 0;
  border-radius: 999px;
  padding: 17px 32px;
  color: white;
  background: var(--green);
  font-weight: 700;
}

.form-page {
  min-height: 100vh;
  padding: 28px 15px 60px;
  background: #f6eee8;
  font-family: Arial, sans-serif;
}

.editor-card {
  max-width: 760px;
  margin: auto;
  padding: 30px;
  background: white;
  border-radius: 26px;
  box-shadow: 0 18px 60px rgba(0,0,0,.08);
}

.editor-head {
  text-align: center;
  margin-bottom: 30px;
}

.editor-head h1 {
  color: var(--green);
}

.editor-head p {
  color: #888;
}

.form-grid {
  display: grid;
  gap: 20px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.field {
  display: grid;
  gap: 8px;
  color: #555;
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  padding: 15px 16px;
  border: 1px solid #ddd;
  border-radius: 14px;
  outline: none;
  background: white;
}

.field textarea {
  line-height: 1.7;
  resize: vertical;
}

.field small {
  text-align: right;
  color: #aaa;
}

.upload-card {
  padding: 22px;
  border: 1px solid #e7ddd3;
  border-radius: 22px;
  background: #fffdf9;
  text-align: center;
}

.upload-icon {
  font-size: 30px;
}

.upload-card h3 {
  margin: 8px 0;
  color: var(--green);
}

.upload-card p {
  color: #999;
  font-size: 13px;
}

.choose-photo {
  width: 100%;
  padding: 15px;
  border: 1px dashed #bba486;
  border-radius: 14px;
  background: #fff7ed;
}

.upload-preview {
  margin-top: 16px;
  padding: 8px;
  border-radius: 18px;
  background: #f4efe9;
}

.upload-preview img {
  width: 100%;
  max-height: 520px;
  object-fit: contain;
  display: block;
  border-radius: 14px;
}

.upload-actions {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.upload-actions button {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ccc;
  background: white;
}

.upload-actions .remove-photo {
  border-color: #e4c3c3;
  color: #9c4545;
  background: #fff5f5;
}

.gallery-editor {
  margin-top: 16px;
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(105px, 1fr));
  gap: 10px;
}

.gallery-edit-item {
  position: relative;
}

.gallery-edit-item img {
  width: 100%;
  height: 125px;
  object-fit: contain;
  background: #f3eee8;
  border-radius: 12px;
}

.gallery-edit-item button {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  color: white;
  background: rgba(0,0,0,.65);
}

.preview-btn {
  width: 100%;
  font-size: 17px;
  background:
    linear-gradient(90deg, #b97887, #d49aa2);
}

.invitation {
  min-height: 100vh;
  color: var(--green);
  background: var(--cream);
  font-family: Georgia, serif;
}

.topbar {
  min-height: 78px;
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 65px 1fr 65px;
  align-items: center;
  background: rgba(251,247,242,.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eee6dd;
}

.menu-btn {
  border: 0;
  background: transparent;
  color: var(--green);
  font-size: 26px;
}

.topbar-name {
  text-align: center;
  font-style: italic;
  font-size: clamp(22px, 4vw, 34px);
}

.music-note {
  text-align: center;
  font-size: 24px;
}

.hero-section {
  width: 100%;
}

.hero-container {
  position: relative;
  width: min(100%, 1100px);
  margin: auto;
  overflow: hidden;
  background: #eee7df;
}

.hero-image {
  width: 100%;
  max-height: 900px;
  object-fit: contain;
  display: block;
  margin: auto;
}

.hero-placeholder {
  min-height: 580px;
  display: grid;
  place-items: center;
  align-content: center;
  color: #999;
}

.hero-placeholder span {
  font-size: 45px;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      to bottom,
      transparent 48%,
      rgba(251,247,242,.2) 62%,
      rgba(251,247,242,.95) 92%,
      var(--cream) 100%
    );
}

.hero-content {
  position: absolute;
  width: 100%;
  bottom: 40px;
  left: 0;
  padding: 20px;
  text-align: center;
}

.hero-label {
  color: #967612;
  font-family: Arial, sans-serif;
  letter-spacing: 5px;
  font-size: 12px;
  font-weight: 700;
}

.hero-content h1 {
  margin: 15px 0;
  font-size: clamp(40px, 8vw, 72px);
  font-style: italic;
  font-weight: 500;
}

.hero-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #ddb633;
}

.hero-line span {
  width: 55px;
  height: 1px;
  background: #d7b646;
}

.normal-section {
  width: min(760px, calc(100% - 30px));
  margin: auto;
  padding: 40px 0;
}

.greeting-card {
  padding: 48px 30px;
  text-align: center;
  border: 1px solid var(--line);
  border-radius: 30px;
  background:
    linear-gradient(180deg,#fffdf9,#faf3e8);
  box-shadow: 0 16px 40px rgba(0,0,0,.05);
}

.ornament {
  color: #b59a68;
  font-size: 26px;
}

.ornament.bottom {
  margin-top: 20px;
}

.section-label {
  color: #785f3e;
  text-align: center;
}

.section-label.gold {
  color: #8d7005;
}

.short-line {
  width: 70px;
  height: 1px;
  margin: 18px auto;
  background: #c7b48e;
}

.greeting-card p {
  max-width: 590px;
  margin: auto;
  color: #504c46;
  font-size: clamp(18px, 3vw, 23px);
  line-height: 1.9;
  font-style: italic;
}

.date-time-card {
  padding: 35px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 25px;
  align-items: center;
  border: 1px solid var(--line);
  background: #fffaf4;
}

.date-block {
  text-align: center;
}

.date-icon {
  margin-bottom: 12px;
  font-size: 34px;
  color: var(--gold);
}

.date-block strong {
  display: block;
  margin-top: 14px;
  font-size: clamp(22px, 4vw, 31px);
  font-weight: 500;
}

.vertical-line {
  width: 1px;
  height: 100px;
  background: #ddd0b8;
}

.countdown-section {
  width: min(760px, calc(100% - 30px));
  margin: auto;
  padding: 40px 0 75px;
  text-align: center;
}

.countdown-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 12px;
}

.count-box {
  padding: 22px 5px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,.06);
}

.count-box strong {
  display: block;
  font-size: clamp(27px, 5vw, 45px);
}

.count-box span {
  display: block;
  margin-top: 6px;
  color: #777;
  font-family: Arial, sans-serif;
  font-size: 11px;
}

.empty-text {
  color: #888;
}

.today-card {
  margin-top: 30px;
  padding: 25px;
  border: 1px solid #d7b851;
  border-radius: 20px;
  color: #8a6c00;
}

.venue-card {
  overflow: hidden;
  border: 1px solid var(--line);
  background: #fffaf5;
}

.venue-photo-frame {
  padding: 18px 18px 0;
}

.venue-photo-frame img {
  width: 100%;
  max-height: 650px;
  display: block;
  object-fit: contain;
  border-radius: 22px;
  background: #f2ece5;
}

.venue-placeholder {
  min-height: 300px;
  display: grid;
  place-items: center;
  background: #f1ebe4;
  color: #aaa;
}

.venue-body {
  padding: 30px;
}

.venue-label {
  text-align: left;
}

.venue-body h2 {
  margin: 22px 0 10px;
  font-size: clamp(29px, 5vw, 43px);
  font-style: italic;
  font-weight: 500;
}

.venue-body p {
  margin: 0;
  color: #555;
  font-style: italic;
  font-size: 19px;
}

.map-btn {
  display: block;
  margin-top: 26px;
  padding: 17px 20px;
  border: 1px solid #d2a921;
  border-radius: 999px;
  color: #f3d36d;
  background: var(--green);
  text-align: center;
  text-decoration: none;
  font-family: Arial, sans-serif;
  letter-spacing: 3px;
  font-weight: 700;
}

.gallery-section {
  padding: 75px 0 90px;
  background: white;
}

.gallery-heading {
  padding: 0 35px 28px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
}

.gallery-heading .section-label {
  text-align: left;
}

.gallery-heading h2 {
  margin: 10px 0 0;
  font-size: clamp(29px,5vw,43px);
  font-style: italic;
  font-weight: 500;
}

.gallery-arrows {
  display: flex;
  gap: 10px;
}

.gallery-arrows button {
  width: 50px;
  height: 50px;
  border: 1px solid #bbb;
  border-radius: 50%;
  background: white;
  color: var(--green);
  font-size: 28px;
}

.gallery-scroll {
  display: flex;
  gap: 22px;
  overflow-x: auto;
  padding: 0 35px 20px;
  scroll-snap-type: x mandatory;
}

.gallery-photo {
  flex: 0 0 min(76vw,470px);
  min-height: 360px;
  padding: 10px;
  display: grid;
  place-items: center;
  scroll-snap-align: start;
  border-radius: 20px;
  background: #f5f1ec;
}

.gallery-photo img {
  width: 100%;
  max-height: 650px;
  object-fit: contain;
  display: block;
  border-radius: 15px;
}

.rsvp-section {
  padding: 80px 20px;
}

.rsvp-card {
  max-width: 680px;
  margin: auto;
  padding: 48px 30px;
  border: 1px solid var(--line);
  background: #fffaf6;
}

.rsvp-card h2 {
  margin: 0;
  text-align: center;
  font-size: clamp(50px,8vw,70px);
  font-style: italic;
  font-weight: 500;
}

.rsvp-intro {
  text-align: center;
  color: #555;
  font-style: italic;
  font-size: 20px;
}

.field-heading {
  margin: 30px 0 12px;
  text-align: center;
  font-family: Arial, sans-serif;
  letter-spacing: 4px;
  font-weight: 700;
  font-size: 13px;
}

.large-input {
  width: 100%;
  padding: 18px;
  border: 2px solid #d3ddd6;
  border-radius: 20px;
  outline: none;
  font-size: 17px;
}

.rsvp-option {
  margin-top: 13px;
  padding: 19px;
  display: flex;
  align-items: center;
  gap: 17px;
  border: 2px solid #d5ded8;
  border-radius: 20px;
  background: white;
  font-family: Arial, sans-serif;
}

.rsvp-option.selected {
  border-color: #92aa9b;
  background: #f5f8f5;
}

.rsvp-option strong {
  display: block;
  font-weight: 500;
  font-size: 18px;
}

.rsvp-option span {
  display: block;
  margin-top: 4px;
  color: #89a095;
}

.send-btn {
  width: 100%;
  margin-top: 28px;
  padding: 17px;
  border: 0;
  border-radius: 999px;
  color: white;
  background: #9cab9b;
  font-family: Arial, sans-serif;
  letter-spacing: 3px;
  font-weight: 700;
}

.success-message {
  margin-top: 18px;
  text-align: center;
  color: #387153;
}

.wish-section {
  padding: 75px 20px;
}

.wish-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 38px;
  font-family: Arial, sans-serif;
  letter-spacing: 5px;
  font-weight: 700;
}

.wish-heading span {
  width: 45px;
  height: 1px;
  background: #9cac9e;
}

.wish-list {
  max-width: 600px;
  margin: 0 auto 35px;
}

.wish-card {
  position: relative;
  margin-bottom: 18px;
  padding: 42px 28px;
  border-radius: 26px;
  background: #fff7e3;
}

.quote-mark {
  position: absolute;
  top: 8px;
  right: 20px;
  color: #ddddd0;
  font-size: 70px;
}

.wish-card p {
  margin: 0;
  text-align: center;
  font-size: clamp(22px,4vw,33px);
  line-height: 1.6;
  font-style: italic;
}

.wish-author {
  margin-top: 22px;
  text-align: center;
  font-family: Arial, sans-serif;
  letter-spacing: 4px;
  font-size: 12px;
}

.wish-form {
  max-width: 600px;
  margin: auto;
  padding: 32px 28px;
  border: 1px solid #ddd3c0;
  border-radius: 28px;
  background: #fff9e9;
}

.wish-form-title {
  text-align: center;
  margin-bottom: 28px;
  font-family: Arial, sans-serif;
  letter-spacing: 4px;
  font-weight: 700;
}

.wish-form label {
  display: block;
  margin-top: 20px;
  color: #8d8b80;
  font-family: Arial, sans-serif;
  letter-spacing: 3px;
  font-size: 12px;
}

.wish-form input,
.wish-form textarea {
  width: 100%;
  padding: 15px 0;
  border: 0;
  border-bottom: 1px solid #cfc6b7;
  background: transparent;
  outline: none;
  color: #555;
  font-family: Georgia, serif;
  font-size: 18px;
}

.wish-form textarea {
  min-height: 145px;
  line-height: 1.7;
  resize: vertical;
  font-style: italic;
}

.character-count {
  margin-top: 6px;
  text-align: right;
  color: #999;
  font-family: Arial, sans-serif;
  font-size: 12px;
}

.share-section {
  max-width: 650px;
  margin: auto;
  padding: 45px 25px 80px;
}

.share-buttons {
  margin-top: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.share-buttons button {
  padding: 16px 12px;
  border: 1px solid #d2aa24;
  border-radius: 999px;
  background: var(--green);
  color: #f5d572;
  font-family: Arial, sans-serif;
  letter-spacing: 2px;
  font-weight: 700;
}

.footer {
  padding: 75px 25px 55px;
  text-align: center;
  color: #efd170;
  background:
    linear-gradient(135deg,#073f2d,#18320f);
}

.footer-heart {
  font-size: 34px;
}

.footer-names {
  margin-top: 18px;
  font-size: clamp(36px,7vw,58px);
  font-style: italic;
}

.footer p {
  margin-top: 18px;
  font-family: Arial, sans-serif;
  letter-spacing: 3px;
  font-size: 10px;
}

.footer button {
  margin-top: 22px;
  padding: 11px 24px;
  border: 1px solid #efd170;
  border-radius: 999px;
  color: #efd170;
  background: transparent;
}

/* MOBILE */

@media (max-width: 620px) {
  .editor-card {
    padding: 22px 16px;
    border-radius: 20px;
  }

  .two-column {
    grid-template-columns: 1fr;
  }

  .topbar {
    grid-template-columns: 55px 1fr 55px;
  }

  .hero-placeholder {
    min-height: 460px;
  }

  .hero-content {
    bottom: 25px;
  }

  .date-time-card {
    grid-template-columns: 1fr;
  }

  .vertical-line {
    width: 70%;
    height: 1px;
    margin: auto;
  }

  .countdown-grid {
    gap: 7px;
  }

  .count-box {
    padding: 17px 3px;
  }

  .venue-body {
    padding: 24px 20px;
  }

  .gallery-heading {
    padding-left: 20px;
    padding-right: 20px;
  }

  .gallery-scroll {
    padding-left: 20px;
    padding-right: 20px;
  }

  .rsvp-card {
    padding: 38px 20px;
  }

  .wish-form {
    padding: 28px 20px;
  }

  .share-buttons {
    grid-template-columns: 1fr;
  }
}
`;
