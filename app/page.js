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

  function updateForm(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ==============================
  // IMAGE
  // ==============================

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
      gallery: prev.gallery.filter((photo) => photo.id !== id),
    }));
  }

  // ==============================
  // COUNTDOWN
  // ==============================

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
        hours: Math.floor((difference % 86400000) / 3600000),
        minutes: Math.floor((difference % 3600000) / 60000),
        seconds: Math.floor((difference % 60000) / 1000),
        finished: false,
      });
    }

    calculate();

    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [form.date, form.time]);

  // ==============================
  // RSVP
  // ==============================

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

  // ==============================
  // WISH
  // ==============================

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

  // ==============================
  // SHARE
  // ==============================

  function buildShareLink() {
    const slug = encodeURIComponent(
      `${form.groom || "groom"}-${form.bride || "bride"}-${
        form.date || "wedding"
      }`
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

  // ==============================
  // HOME
  // ==============================

  if (screen === "home") {
    return (
      <>
        <style>{css}</style>

        <main className="home-page">
          <section className="home-card">
            <div className="home-ring">💍</div>

            <div className="tiny-title">WEDDING INVITATION</div>

            <h1>Хуримын урилга</h1>

            <p>
              Өөрийн хуримын онлайн урилгыг хэдхэн алхмаар бүтээнэ үү.
            </p>

            <button onClick={() => setScreen("form")}>
              Урилга бүтээх
            </button>
          </section>
        </main>
      </>
    );
  }

  // ==============================
  // FORM
  // ==============================

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

              <h1>Урилгын мэдээлэл</h1>

              <p>
                Мэдээллээ бөглөж, зурагнуудаа сонгоод урилгаа харна уу.
              </p>
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
                placeholder="https://maps.google.com/..."
              />

              <ImagePicker
                title="Хосын нүүр зураг"
                subtitle="Урилгын эхэнд харагдана"
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

                <h3>Дурсамжийн зургууд</h3>

                <p>8 хүртэл зураг оруулж болно</p>

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
                  onClick={() => galleryInput.current?.click()}
                >
                  ＋ Зургууд сонгох
                </button>

                {form.gallery.length > 0 && (
                  <div className="gallery-editor">
                    {form.gallery.map((photo) => (
                      <div
                        className="gallery-edit-item"
                        key={photo.id}
                      >
                        <img src={photo.src} alt="" />

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
                  rows={6}
                  maxLength={800}
                  placeholder="Хайр сэтгэлээ нэгтгэн..."
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

  // ==============================
  // PREVIEW
  // ==============================

  return (
    <>
      <style>{css}</style>

      <main className="invitation">
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

        {/* HERO */}

        <section className="hero-section">
          <div className="hero-frame">
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
          </div>

          <div className="hero-text">
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
        </section>

        {/* GREETING */}

        <section className="content-section">
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

        {/* DATE + TIME */}

        <section className="content-section">
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

        {/* COUNTDOWN */}

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

        {/* VENUE */}

        <section className="content-section">
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
                {form.venueName || "Хурим болох газар"}
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

        {/* GALLERY */}

        {form.gallery.length > 0 && (
          <section className="gallery-section">
            <div className="gallery-heading">
              <div>
                <div className="section-label gold left">
                  БИДНИЙ ТҮҮХ
                </div>

                <h2>Хуримын дурсамжууд</h2>
              </div>

              <div className="gallery-arrows">
                <button
                  onClick={() =>
                    galleryScroll.current?.scrollBy({
                      left: -360,
                      behavior: "smooth",
                    })
                  }
                >
                  ‹
                </button>

                <button
                  onClick={() =>
                    galleryScroll.current?.scrollBy({
                      left: 360,
                      behavior: "smooth",
                    })
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
              {form.gallery.map((photo) => (
                <div
                  className="gallery-photo"
                  key={photo.id}
                >
                  <img src={photo.src} alt="" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RSVP */}

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

        {/* WISH */}

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
            <button onClick={copyShareLink}>
              🔗 ЛИНК ХУУЛАХ
            </button>

            <button onClick={nativeShare}>
              ↗ ХУВААЛЦАХ
            </button>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="footer">
          <div className="footer-heart">♥</div>

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

// ==============================
// COMPONENTS
// ==============================

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

  const value = new Date(`${date}T00:00:00`);

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

// ==============================
// CSS
// ==============================

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
  --green2: #184a38;
  --gold: #ae8614;
  --cream: #fbf7f2;
  --lightCream: #fffaf5;
  --line: #ded2bb;
}

.home-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: linear-gradient(160deg,#fffdf9,#f1e6dc);
  font-family: Arial,sans-serif;
}

.home-card {
  width: min(600px,100%);
  text-align: center;
  padding: 50px 25px;
}

.home-ring {
  font-size: 55px;
}

.home-card h1 {
  margin: 18px 0 10px;
  color: var(--green);
  font-family: Georgia,serif;
  font-size: clamp(38px,7vw,60px);
  font-weight: 500;
}

.home-card p {
  color: #777;
  line-height: 1.7;
}

.home-card button {
  margin-top: 20px;
  padding: 16px 32px;
  border: 0;
  border-radius: 999px;
  background: var(--green);
  color: white;
  font-weight: 700;
}

.tiny-title,
.section-label {
  font-family: Arial,sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
}

.tiny-title {
  color: var(--gold);
}

.form-page {
  min-height: 100vh;
  padding: 28px 15px 60px;
  background: #f5ede6;
  font-family: Arial,sans-serif;
}

.editor-card {
  max-width: 760px;
  margin: auto;
  padding: 30px;
  background: white;
  border-radius: 25px;
  box-shadow: 0 15px 50px rgba(0,0,0,.08);
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
  resize: vertical;
  line-height: 1.7;
}

.field small {
  text-align: right;
  color: #aaa;
}

.upload-card {
  padding: 22px;
  border: 1px solid #e5ddd2;
  border-radius: 22px;
  background: #fffdf9;
  text-align: center;
}

.upload-icon {
  font-size: 30px;
}

.upload-card h3 {
  color: var(--green);
  margin: 8px 0;
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
  margin-top: 15px;
  padding: 10px;
  border-radius: 18px;
  background: #f4efe9;
}

.upload-preview img {
  width: 100%;
  height: auto;
  max-height: 500px;
  display: block;
  object-fit: contain;
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

.remove-photo {
  color: #9c4545;
  background: #fff5f5 !important;
  border-color: #e4c3c3 !important;
}

.gallery-editor {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(105px,1fr));
  gap: 10px;
}

.gallery-edit-item {
  position: relative;
}

.gallery-edit-item img {
  width: 100%;
  height: 130px;
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
  background: rgba(0,0,0,.65);
  color: white;
}

.preview-btn {
  width: 100%;
  padding: 17px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(90deg,#b97887,#d49aa2);
  color: white;
  font-weight: 700;
  font-size: 17px;
}

.invitation {
  min-height: 100vh;
  background: var(--cream);
  color: var(--green);
  font-family: Georgia,serif;
}

.topbar {
  min-height: 76px;
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 65px 1fr 65px;
  align-items: center;
  background: rgba(251,247,242,.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eee4dc;
}

.menu-btn {
  border: 0;
  background: transparent;
  color: var(--green);
  font-size: 26px;
}

.topbar-name {
  text-align: center;
  font-size: clamp(22px,4vw,34px);
  font-style: italic;
}

.music-note {
  text-align: center;
  font-size: 24px;
}

/* HERO */

.hero-section {
  width: min(920px,100%);
  margin: auto;
  padding: 22px 18px 55px;
}

.hero-frame {
  width: 100%;
  min-height: 300px;
  display: grid;
  place-items: center;
  padding: 10px;
  overflow: hidden;
  border-radius: 26px;
  background: #eee8e1;
}

.hero-image {
  width: 100%;
  height: auto;
  max-height: 720px;
  object-fit: contain;
  display: block;
  border-radius: 20px;
}

.hero-placeholder {
  min-height: 450px;
  display: grid;
  place-items: center;
  color: #999;
}

.hero-text {
  padding: 32px 20px 5px;
  text-align: center;
}

.hero-label {
  color: #987612;
  font-family: Arial,sans-serif;
  letter-spacing: 5px;
  font-size: 11px;
  font-weight: 700;
}

.hero-text h1 {
  margin: 16px 0 14px;
  font-size: clamp(38px,7vw,65px);
  font-weight: 500;
  font-style: italic;
}

.heart-line {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  color: #d5ae2d;
}

.heart-line span {
  width: 55px;
  height: 1px;
  background: #d3b552;
}

.content-section {
  width: min(760px,calc(100% - 30px));
  margin: auto;
  padding: 28px 0;
}

/* GREETING */

.greeting-card {
  padding: 46px 30px;
  text-align: center;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: linear-gradient(180deg,#fffdf9,#faf3e8);
  box-shadow: 0 12px 35px rgba(0,0,0,.04);
}

.ornament {
  color: #b59a68;
  font-size: 25px;
}

.ornament.bottom {
  margin-top: 20px;
}

.section-label {
  color: #765e3e;
  text-align: center;
}

.section-label.gold {
  color: #8c6e05;
}

.section-label.left {
  text-align: left;
}

.short-line {
  width: 70px;
  height: 1px;
  margin: 18px auto;
  background: #c7b48e;
}

.greeting-card p {
  max-width: 580px;
  margin: auto;
  color: #504c46;
  line-height: 1.9;
  font-size: clamp(18px,3vw,23px);
  font-style: italic;
}

/* DATE */

.date-time-card {
  padding: 35px 25px;
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
  color: var(--gold);
  font-size: 31px;
}

.date-block strong {
  display: block;
  margin-top: 14px;
  font-size: clamp(21px,4vw,30px);
  font-weight: 500;
}

.vertical-line {
  width: 1px;
  height: 95px;
  background: #ddd0b8;
}

/* COUNTDOWN */

.countdown-section {
  width: min(760px,calc(100% - 30px));
  margin: auto;
  padding: 35px 0 65px;
  text-align: center;
}

.countdown-grid {
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 12px;
}

.count-box {
  padding: 22px 5px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 9px 28px rgba(0,0,0,.06);
}

.count-box strong {
  display: block;
  font-size: clamp(27px,5vw,43px);
}

.count-box span {
  display: block;
  margin-top: 5px;
  color: #777;
  font-family: Arial,sans-serif;
  font-size: 11px;
}

.today-card {
  margin-top: 25px;
  padding: 24px;
  border: 1px solid #d6b64b;
  border-radius: 18px;
  color: #866a08;
}

.empty-text {
  color: #888;
}

/* VENUE */

.venue-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: #fffaf5;
}

.venue-photo-area {
  height: 390px;
  padding: 16px;
  display: grid;
  place-items: center;
  background: #f2ece6;
}

.venue-photo-area img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 18px;
}

.venue-placeholder {
  color: #aaa;
}

.venue-body {
  padding: 30px;
}

.venue-body h2 {
  margin: 20px 0 10px;
  font-size: clamp(29px,5vw,42px);
  font-style: italic;
  font-weight: 500;
}

.venue-body p {
  margin: 0;
  color: #555;
  font-size: 19px;
  font-style: italic;
}

.map-btn {
  display: block;
  width: 100%;
  margin-top: 25px;
  padding: 17px;
  border: 1px solid #d2aa24;
  border-radius: 999px;
  background: var(--green);
  color: #f4d36f;
  text-align: center;
  text-decoration: none;
  font-family: Arial,sans-serif;
  font-weight: 700;
  letter-spacing: 3px;
}

/* GALLERY */

.gallery-section {
  margin-top: 30px;
  padding: 65px 0 80px;
  background: white;
}

.gallery-heading {
  padding: 0 35px 25px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
}

.gallery-heading h2 {
  margin: 10px 0 0;
  font-size: clamp(29px,5vw,42px);
  font-style: italic;
  font-weight: 500;
}

.gallery-arrows {
  display: flex;
  gap: 10px;
}

.gallery-arrows button {
  width: 48px;
  height: 48px;
  border: 1px solid #bbb;
  border-radius: 50%;
  background: white;
  color: var(--green);
  font-size: 28px;
}

.gallery-scroll {
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 0 35px 18px;
  scroll-snap-type: x mandatory;
}

.gallery-photo {
  flex: 0 0 360px;
  width: 360px;
  height: 470px;
  padding: 10px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: #f4efe9;
  scroll-snap-align: start;
}

.gallery-photo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 15px;
}

/* RSVP */

.rsvp-section {
  padding: 75px 20px;
}

.rsvp-card {
  max-width: 680px;
  margin: auto;
  padding: 45px 28px;
  border: 1px solid var(--line);
  background: #fffaf6;
}

.rsvp-card h2 {
  margin: 0;
  text-align: center;
  font-size: clamp(48px,8vw,68px);
  font-style: italic;
  font-weight: 500;
}

.rsvp-intro {
  text-align: center;
  color: #555;
  font-size: 19px;
  font-style: italic;
}

.field-heading {
  margin: 28px 0 12px;
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 4px;
}

.large-input {
  width: 100%;
  padding: 17px;
  border: 2px solid #d4ddd7;
  border-radius: 18px;
  outline: none;
}

.rsvp-option {
  margin-top: 12px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 2px solid #d6ded9;
  border-radius: 18px;
  background: white;
  font-family: Arial,sans-serif;
}

.rsvp-option.selected {
  border-color: #92aa9b;
  background: #f5f8f5;
}

.rsvp-option strong,
.rsvp-option span {
  display: block;
}

.rsvp-option strong {
  font-size: 17px;
  font-weight: 500;
}

.rsvp-option span {
  margin-top: 4px;
  color: #8da095;
}

.send-btn {
  width: 100%;
  margin-top: 25px;
  padding: 17px;
  border: 0;
  border-radius: 999px;
  background: #9cab9b;
  color: white;
  font-family: Arial,sans-serif;
  font-weight: 700;
  letter-spacing: 3px;
}

.success-message {
  margin-top: 15px;
  text-align: center;
  color: #387153;
}

/* WISH */

.wish-section {
  padding: 70px 20px;
}

.wish-heading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-bottom: 35px;
  font-family: Arial,sans-serif;
  font-weight: 700;
  letter-spacing: 5px;
}

.wish-heading span {
  width: 45px;
  height: 1px;
  background: #a6afa7;
}

.wish-list {
  max-width: 600px;
  margin: 0 auto 30px;
}

.wish-card {
  position: relative;
  margin-bottom: 18px;
  padding: 40px 28px;
  border-radius: 25px;
  background: #fff7e3;
}

.quote-mark {
  position: absolute;
  top: 7px;
  right: 20px;
  color: #dddccd;
  font-size: 68px;
}

.wish-card p {
  text-align: center;
  font-size: clamp(22px,4vw,31px);
  line-height: 1.6;
  font-style: italic;
}

.wish-author {
  text-align: center;
  font-family: Arial,sans-serif;
  font-size: 12px;
  letter-spacing: 4px;
}

.wish-form {
  max-width: 600px;
  margin: auto;
  padding: 30px 26px;
  border: 1px solid #ddd2be;
  border-radius: 26px;
  background: #fff9e9;
}

.wish-form-title {
  margin-bottom: 25px;
  text-align: center;
  font-family: Arial,sans-serif;
  font-weight: 700;
  letter-spacing: 4px;
}

.wish-form label {
  display: block;
  margin-top: 18px;
  color: #8d8b80;
  font-family: Arial,sans-serif;
  font-size: 11px;
  letter-spacing: 3px;
}

.wish-form input,
.wish-form textarea {
  width: 100%;
  padding: 14px 0;
  border: 0;
  border-bottom: 1px solid #cfc6b7;
  background: transparent;
  outline: none;
  color: #555;
  font-family: Georgia,serif;
  font-size: 18px;
}

.wish-form textarea {
  min-height: 140px;
  resize: vertical;
  line-height: 1.7;
  font-style: italic;
}

.character-count {
  margin-top: 5px;
  text-align: right;
  color: #999;
  font-family: Arial,sans-serif;
  font-size: 11px;
}

/* SHARE */

.share-section {
  max-width: 650px;
  margin: auto;
  padding: 45px 25px 70px;
}

.share-buttons {
  margin-top: 23px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.share-buttons button {
  padding: 16px;
  border: 1px solid #d2aa24;
  border-radius: 999px;
  background: var(--green);
  color: #f4d36f;
  font-family: Arial,sans-serif;
  font-weight: 700;
  letter-spacing: 2px;
}

/* FOOTER */

.footer {
  padding: 70px 25px 50px;
  text-align: center;
  background: linear-gradient(135deg,#073f2d,#18320f);
  color: #efd170;
}

.footer-heart {
  font-size: 32px;
}

.footer-names {
  margin-top: 15px;
  font-size: clamp(35px,7vw,55px);
  font-style: italic;
}

.footer p {
  font-family: Arial,sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
}

.footer button {
  margin-top: 18px;
  padding: 10px 22px;
  border: 1px solid #efd170;
  border-radius: 999px;
  background: transparent;
  color: #efd170;
}

/* MOBILE */

@media (max-width: 620px) {
  .editor-card {
    padding: 22px 16px;
  }

  .two-column {
    grid-template-columns: 1fr;
  }

  .topbar {
    grid-template-columns: 55px 1fr 55px;
  }

  .hero-section {
    padding-left: 12px;
    padding-right: 12px;
  }

  .hero-frame {
    border-radius: 18px;
  }

  .hero-image {
    max-height: 620px;
    border-radius: 14px;
  }

  .hero-text {
    padding-top: 25px;
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
    padding: 17px 2px;
  }

  .venue-photo-area {
    height: 330px;
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

  .gallery-photo {
    flex-basis: 78vw;
    width: 78vw;
    height: 440px;
  }

  .rsvp-card {
    padding: 36px 20px;
  }

  .wish-form {
    padding: 27px 20px;
  }

  .share-buttons {
    grid-template-columns: 1fr;
  }
}
`;
