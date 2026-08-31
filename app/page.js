"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [step, setStep] = useState("home");

  const heroInputRef = useRef(null);
  const venueInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const galleryRef = useRef(null);

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

  const [rsvpName, setRsvpName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("Ирнэ");
  const [rsvps, setRsvps] = useState([]);

  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState([]);

  const [shareId] = useState(() =>
    Math.random().toString(36).slice(2, 10)
  );

  const change = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const names = `${form.groom || "Хүргэн"} & ${
    form.bride || "Бүсгүй"
  }`;

  const date = form.date || "2026-10-10";
  const time = form.time || "17:00";

  const venueName =
    form.venueName || "Хуримын ордон";

  const venueAddress =
    form.venueAddress || "Улаанбаатар";

  const message =
    form.message ||
    "Хайр сэтгэлээ нэгтгэн, амьдралын шинэ замаа хамтдаа эхлүүлэх энэ дурсамжит өдөр эрхэм таныг бидний хуримын баярт хүрэлцэн ирэхийг хүндэтгэн урьж байна.";

  /* ===================== IMAGE ===================== */

  const readImage = (file, callback) => {
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
  };

  const handleHeroPhoto = (e) => {
    const file = e.target.files?.[0];

    readImage(file, (result) => {
      setForm((prev) => ({
        ...prev,
        heroPhoto: result,
      }));
    });
  };

  const handleVenuePhoto = (e) => {
    const file = e.target.files?.[0];

    readImage(file, (result) => {
      setForm((prev) => ({
        ...prev,
        venuePhoto: result,
      }));
    });
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files || [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 5);

    if (!files.length) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve({
                id:
                  Date.now().toString() +
                  Math.random().toString(36),
                src: reader.result,
                name: file.name,
              });
            };

            reader.readAsDataURL(file);
          })
      )
    ).then((items) => {
      setForm((prev) => ({
        ...prev,
        gallery: items,
      }));
    });
  };

  const removeHeroPhoto = () => {
    setForm((prev) => ({
      ...prev,
      heroPhoto: "",
    }));

    if (heroInputRef.current) {
      heroInputRef.current.value = "";
    }
  };

  const removeVenuePhoto = () => {
    setForm((prev) => ({
      ...prev,
      venuePhoto: "",
    }));

    if (venueInputRef.current) {
      venueInputRef.current.value = "";
    }
  };

  const removeGalleryPhoto = (id) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter(
        (item) => item.id !== id
      ),
    }));
  };

  /* ===================== COUNTDOWN ===================== */

  const targetDate = useMemo(() => {
    if (!form.date) return null;

    const targetTime = form.time || "00:00";
    const value = new Date(
      `${form.date}T${targetTime}:00`
    );

    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return value;
  }, [form.date, form.time]);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const tick = () => {
      const diff =
        targetDate.getTime() - Date.now();

      if (diff <= 0) {
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
        days: Math.floor(diff / 86400000),
        hours: Math.floor(
          (diff / 3600000) % 24
        ),
        minutes: Math.floor(
          (diff / 60000) % 60
        ),
        seconds: Math.floor(
          (diff / 1000) % 60
        ),
        finished: false,
      });
    };

    tick();

    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  /* ===================== RSVP ===================== */

  const handleRsvp = () => {
    if (!rsvpName.trim()) {
      alert("Нэрээ бичнэ үү.");
      return;
    }

    setRsvps((prev) => [
      {
        id: Date.now(),
        name: rsvpName.trim(),
        status: rsvpStatus,
      },
      ...prev,
    ]);

    setRsvpName("");
    setRsvpStatus("Ирнэ");

    alert("Хариу илгээгдлээ.");
  };

  /* ===================== WISH ===================== */

  const handleWish = () => {
    if (
      !wishName.trim() ||
      !wishText.trim()
    ) {
      alert(
        "Нэр болон ерөөлөө бичнэ үү."
      );
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
  };

  /* ===================== SHARE ===================== */

  const copyShareLink = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?invite=${shareId}`
        : "";

    try {
      await navigator.clipboard.writeText(url);
      alert("Урилгын линк хуулагдлаа.");
    } catch {
      alert(url);
    }
  };

  const scrollGallery = (direction) => {
    galleryRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  /* ===================== HOME ===================== */

  if (step === "home") {
    return (
      <main style={pageStyle}>
        <section style={homeStyle}>
          <div style={{ fontSize: 58 }}>
            💍
          </div>

          <h1 style={{ fontSize: 48 }}>
            Урилга
          </h1>

          <p style={{ color: "#777" }}>
            Хуримын онлайн урилгаа өөрөө бүтээ
          </p>

          <button
            type="button"
            onClick={() => setStep("form")}
            style={primaryButton}
          >
            Урилга бүтээх
          </button>
        </section>
      </main>
    );
  }

  /* ===================== FORM ===================== */

  if (step === "form") {
    return (
      <main style={pageStyle}>
        <section style={formCard}>
          <h1
            style={{
              textAlign: "center",
            }}
          >
            Урилгын мэдээлэл
          </h1>

          <div style={formGrid}>
            <input
              name="groom"
              value={form.groom}
              onChange={change}
              placeholder="Хүргэний нэр"
              style={inputStyle}
            />

            <input
              name="bride"
              value={form.bride}
              onChange={change}
              placeholder="Бүсгүйн нэр"
              style={inputStyle}
            />

            <label>
              Хуримын огноо
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={change}
                style={inputStyle}
              />
            </label>

            <label>
              Цаг
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={change}
                style={inputStyle}
              />
            </label>

            <input
              name="venueName"
              value={form.venueName}
              onChange={change}
              placeholder="Хурим болох газрын нэр"
              style={inputStyle}
            />

            <input
              name="venueAddress"
              value={form.venueAddress}
              onChange={change}
              placeholder="Хурим болох газрын хаяг"
              style={inputStyle}
            />

            <input
              name="mapUrl"
              value={form.mapUrl}
              onChange={change}
              placeholder="Google Maps линк"
              style={inputStyle}
            />

            <PhotoPicker
              title="Нүүр зураг"
              photo={form.heroPhoto}
              inputRef={heroInputRef}
              onChange={handleHeroPhoto}
              onRemove={removeHeroPhoto}
            />

            <PhotoPicker
              title="Байршлын зураг"
              photo={form.venuePhoto}
              inputRef={venueInputRef}
              onChange={handleVenuePhoto}
              onRemove={removeVenuePhoto}
            />

            <div style={uploadCard}>
              <div style={uploadTitle}>
                🖼 Дурсамжийн зургууд
              </div>

              <div style={uploadHint}>
                5 хүртэл зураг сонгож болно
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGallery}
                style={{
                  display: "none",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  galleryInputRef.current?.click()
                }
                style={softButton}
              >
                ＋ Зургууд сонгох
              </button>

              {form.gallery.length > 0 && (
                <div style={galleryEditGrid}>
                  {form.gallery.map(
                    (item) => (
                      <div
                        key={item.id}
                        style={galleryEditItem}
                      >
                        <img
                          src={item.src}
                          alt=""
                          style={galleryEditImage}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeGalleryPhoto(
                              item.id
                            )
                          }
                          style={miniDelete}
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <label>
              Урилгын мэндчилгээ
              <textarea
                name="message"
                value={form.message}
                onChange={change}
                rows={5}
                maxLength={800}
                placeholder="Хайр сэтгэлээ нэгтгэн..."
                style={{
                  ...inputStyle,
                  lineHeight: 1.7,
                }}
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setStep("preview");
                window.scrollTo(0, 0);
              }}
              style={previewButton}
            >
              Урилгаа харах
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* ===================== PREVIEW ===================== */

  return (
    <main style={previewPage}>
      <header style={headerStyle}>
        <div style={menuIcon}>
          ☰
        </div>

        <div style={headerNames}>
          {names}
        </div>

        <div style={musicIcon}>
          ♪
        </div>
      </header>

      {/* HERO */}

      <section style={heroSection}>
        {form.heroPhoto ? (
          <div style={heroImageFrame}>
            <img
              src={form.heroPhoto}
              alt="Хосын зураг"
              style={heroImage}
            />
          </div>
        ) : (
          <div style={heroPlaceholder}>
            Хосын нүүр зураг
          </div>
        )}

        <div style={heroText}>
          <div style={heroLabel}>
            ХУРИМЫН УРИЛГА
          </div>

          <div style={heroName}>
            {names}
          </div>

          <div style={heartLine}>
            ─── ♥ ───
          </div>
        </div>
      </section>

      {/* GREETING CARD */}

      <section style={sectionWrap}>
        <div style={greetingCard}>
          <div style={greetingStar}>
            ✦
          </div>

          <div style={greetingTitle}>
            УРИЛГЫН МЭНДЧИЛГЭЭ
          </div>

          <div style={greetingLine} />

          <p style={greetingText}>
            {message}
          </p>

          <div style={greetingBottom}>
            ❦
          </div>
        </div>
      </section>

      {/* DATE + TIME COMPACT */}

      <section style={sectionWrap}>
        <div style={dateTimeCard}>
          <div style={dateTimeLabel}>
            ОГНОО & ЦАГ
          </div>

          <div style={dateTimeValue}>
            {date}
          </div>

          <div style={dateTimeDivider}>
            •
          </div>

          <div style={dateTimeValue}>
            {time}
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}

      <section style={countdownSection}>
        <div style={goldLabel}>
          ХУРИМ ХҮРТЭЛ
        </div>

        {!targetDate ? (
          <p style={{ marginTop: 30 }}>
            Хуримын огноогоо сонгоно уу.
          </p>
        ) : countdown.finished ? (
          <div style={weddingToday}>
            ӨНӨӨДӨР БИДНИЙ ХУРИМЫН ӨДӨР ♥
          </div>
        ) : (
          <div style={countdownGrid}>
            <CountdownBox
              value={countdown.days}
              label="Өдөр"
            />

            <CountdownBox
              value={countdown.hours}
              label="Цаг"
            />

            <CountdownBox
              value={countdown.minutes}
              label="Минут"
            />

            <CountdownBox
              value={countdown.seconds}
              label="Секунд"
            />
          </div>
        )}
      </section>

      {/* VENUE */}

      <section style={venueCard}>
        {form.venuePhoto && (
          <div style={safeImageFrame}>
            <img
              src={form.venuePhoto}
              alt="Байршлын зураг"
              style={safeImage}
            />
          </div>
        )}

        <div style={venueContent}>
          <div style={venueLabel}>
            ★ БАЙРШИЛ / VENUE
          </div>

          <div style={venueTitle}>
            {venueName}
          </div>

          <div style={venueAddress}>
            {venueAddress}
          </div>

          {form.mapUrl && (
            <a
              href={form.mapUrl}
              target="_blank"
              rel="noreferrer"
              style={mapButton}
            >
              📍 ГАЗРЫН ЗУРГААС ХАРАХ
            </a>
          )}
        </div>
      </section>

      {/* GALLERY */}

      {form.gallery.length > 0 && (
        <section style={gallerySection}>
          <div style={galleryHeader}>
            <div>
              <div style={goldLabel}>
                БИДНИЙ ТҮҮХ
              </div>

              <div style={galleryTitle}>
                Хуримын дурсамжууд
              </div>
            </div>

            <div style={galleryButtons}>
              <button
                type="button"
                onClick={() =>
                  scrollGallery(-1)
                }
                style={circleButton}
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollGallery(1)
                }
                style={circleButton}
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={galleryRef}
            style={galleryScroller}
          >
            {form.gallery.map((item) => (
              <div
                key={item.id}
                style={galleryPhotoFrame}
              >
                <img
                  src={item.src}
                  alt=""
                  style={galleryPhoto}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}

      <section style={rsvpSection}>
        <div style={rsvpCard}>
          <div style={rsvpTitle}>
            RSVP
          </div>

          <p style={rsvpIntro}>
            Таны ирэх нь бидний хувьд том хүндэтгэл!
          </p>

          <div style={fieldLabel}>
            НЭРЭЭ БИЧНЭ ҮҮ
          </div>

          <input
            value={rsvpName}
            onChange={(e) =>
              setRsvpName(e.target.value)
            }
            placeholder="Таны нэр"
            style={bigInput}
          />

          <div style={fieldLabel}>
            ХУРИМД ИРЭХ ҮҮ?
          </div>

          {[
            ["Ирнэ", "Хуримд оролцоно"],
            [
              "Одоогоор мэдэхгүй",
              "Одоохондоо тодорхойгүй",
            ],
            [
              "Ирэхгүй",
              "Оролцох боломжгүй",
            ],
          ].map(([value, sub]) => (
            <label
              key={value}
              style={radioCard}
            >
              <input
                type="radio"
                name="rsvp"
                value={value}
                checked={
                  rsvpStatus === value
                }
                onChange={(e) =>
                  setRsvpStatus(
                    e.target.value
                  )
                }
              />

              <div>
                <div style={radioTitle}>
                  {value}
                </div>

                <div style={radioSub}>
                  {sub}
                </div>
              </div>
            </label>
          ))}

          <button
            type="button"
            onClick={handleRsvp}
            style={sendButton}
          >
            ИЛГЭЭХ
          </button>
        </div>
      </section>

      {/* WISH */}

      <section style={wishSection}>
        <div style={wishHeading}>
          ♥ ЕРӨӨЛ ҮЛДЭЭХ ♥
        </div>

        {wishes.length > 0 && (
          <div style={wishList}>
            {wishes.map((wish) => (
              <div
                key={wish.id}
                style={wishDisplayCard}
              >
                <div style={quoteMark}>
                  ”
                </div>

                <div style={wishDisplayText}>
                  “{wish.text}”
                </div>

                <div style={wishAuthor}>
                  — {wish.name} —
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={wishFormCard}>
          <div style={fieldLabel}>
            ЕРӨӨЛӨӨ БИЧНЭ ҮҮ
          </div>

          <input
            value={wishName}
            onChange={(e) =>
              setWishName(e.target.value)
            }
            placeholder="Таны нэр..."
            style={underlineInput}
          />

          <textarea
            value={wishText}
            onChange={(e) =>
              setWishText(e.target.value)
            }
            placeholder="Залуу гэр бүлд дулаан ерөөл, хүсэлтээ бичнэ үү..."
            maxLength={500}
            rows={5}
            style={wishTextarea}
          />

          <div style={characterCount}>
            {wishText.length}/500
          </div>

          <button
            type="button"
            onClick={handleWish}
            style={sendButton}
          >
            ▷ ИЛГЭЭХ
          </button>
        </div>
      </section>

      {/* SHARE */}

      <section style={shareSection}>
        <div style={goldLabel}>
          УРИЛГЫН ЛИНК
        </div>

        <div style={shareIdStyle}>
          invite={shareId}
        </div>

        <button
          type="button"
          onClick={copyShareLink}
          style={mapButton}
        >
          🔗 ЛИНК ХУУЛАХ
        </button>
      </section>

      {/* FOOTER */}

      <footer style={footerStyle}>
        <div style={footerHeart}>
          ♥
        </div>

        <div style={footerNames}>
          {names}
        </div>

        <div style={copyright}>
          © 2026 {names}. ХАЙРААР БҮТЭЭВ.
        </div>

        <button
          type="button"
          onClick={() => {
            setStep("form");
            window.scrollTo(0, 0);
          }}
          style={editButton}
        >
          ← Засах
        </button>
      </footer>
    </main>
  );
}

/* ===================== COMPONENTS ===================== */

function PhotoPicker({
  title,
  photo,
  inputRef,
  onChange,
  onRemove,
}) {
  return (
    <div style={uploadCard}>
      <div style={uploadTitle}>
        📷 {title}
      </div>

      <div style={uploadHint}>
        Босоо эсвэл хэвтээ зураг сонгож болно
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{
          display: "none",
        }}
      />

      {!photo ? (
        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          style={softButton}
        >
          ＋ Зураг сонгох
        </button>
      ) : (
        <>
          <div style={photoPreviewBox}>
            <img
              src={photo}
              alt=""
              style={photoPreview}
            />
          </div>

          <div style={photoButtons}>
            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              style={changeButton}
            >
              ↻ Зураг солих
            </button>

            <button
              type="button"
              onClick={onRemove}
              style={deleteButton}
            >
              Зураг арилгах
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CountdownBox({
  value,
  label,
}) {
  return (
    <div style={countdownBox}>
      <div style={countdownValue}>
        {String(value).padStart(2, "0")}
      </div>

      <div style={countdownLabel}>
        {label}
      </div>
    </div>
  );
}

/* ===================== COLORS ===================== */

const cream = "#fbf7f2";
const green = "#073f2d";
const gold = "#b58c19";
const softGreen = "#9cab9b";

/* ===================== FORM STYLES ===================== */

const pageStyle = {
  minHeight: "100vh",
  background: "#f6eee8",
  fontFamily: "Arial, sans-serif",
  padding: 20,
};

const homeStyle = {
  paddingTop: 130,
  textAlign: "center",
};

const formCard = {
  maxWidth: 720,
  margin: "30px auto",
  background: "#fff",
  padding: 28,
  borderRadius: 24,
  boxShadow:
    "0 15px 45px rgba(0,0,0,.08)",
};

const formGrid = {
  display: "grid",
  gap: 18,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 15,
  borderRadius: 14,
  border: "1px solid #ddd",
  fontSize: 16,
  marginTop: 6,
};

const primaryButton = {
  border: "none",
  background: green,
  color: "#fff",
  borderRadius: 999,
  padding: "15px 30px",
  fontSize: 17,
  cursor: "pointer",
};

const previewButton = {
  ...primaryButton,
  width: "100%",
  background:
    "linear-gradient(90deg,#bd7b87,#d6949e)",
};

const uploadCard = {
  padding: 20,
  borderRadius: 20,
  border: "1px solid #e5ddd5",
  background: "#fffdf9",
};

const uploadTitle = {
  fontSize: 17,
  fontWeight: 700,
  color: green,
};

const uploadHint = {
  margin: "5px 0 15px",
  fontSize: 13,
  color: "#999",
};

const softButton = {
  width: "100%",
  padding: 15,
  borderRadius: 14,
  border: "1px dashed #b69b7e",
  background: "#fff8ef",
  cursor: "pointer",
  fontSize: 16,
};

const photoPreviewBox = {
  marginTop: 12,
  background: "#f4f1ed",
  borderRadius: 18,
  padding: 8,
};

const photoPreview = {
  width: "100%",
  height: "auto",
  maxHeight: 520,
  objectFit: "contain",
  display: "block",
  borderRadius: 14,
};

const photoButtons = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 12,
};

const changeButton = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ccc",
  background: "white",
  cursor: "pointer",
};

const deleteButton = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #e6c3c3",
  background: "#fff5f5",
  color: "#9d4646",
  cursor: "pointer",
};

const galleryEditGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(100px,1fr))",
  gap: 10,
  marginTop: 15,
};

const galleryEditItem = {
  position: "relative",
};

const galleryEditImage = {
  width: "100%",
  height: 120,
  objectFit: "contain",
  background: "#f5f3ef",
  borderRadius: 12,
};

const miniDelete = {
  position: "absolute",
  top: 5,
  right: 5,
  width: 28,
  height: 28,
  border: "none",
  borderRadius: "50%",
  background: "rgba(0,0,0,.65)",
  color: "#fff",
  cursor: "pointer",
};

/* ===================== PREVIEW ===================== */

const previewPage = {
  minHeight: "100vh",
  background: cream,
  color: green,
  fontFamily: "Georgia, serif",
};

const headerStyle = {
  minHeight: 82,
  background: "rgba(251,247,242,.97)",
  display: "grid",
  gridTemplateColumns: "70px 1fr 70px",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 50,
  borderBottom: "1px solid #eee6dd",
};

const menuIcon = {
  textAlign: "center",
  fontSize: 28,
};

const musicIcon = {
  textAlign: "center",
  fontSize: 26,
};

const headerNames = {
  textAlign: "center",
  fontStyle: "italic",
  fontSize: "clamp(23px,5vw,36px)",
};

/* HERO */

const heroSection = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "25px 18px 55px",
  textAlign: "center",
};

const heroImageFrame = {
  width: "100%",
  background: "#f3eee7",
  borderRadius: 26,
  overflow: "hidden",
  padding: 8,
  boxSizing: "border-box",
};

const heroImage = {
  width: "100%",
  height: "auto",
  maxHeight: 780,
  objectFit: "contain",
  display: "block",
  margin: "0 auto",
  borderRadius: 20,
};

const heroPlaceholder = {
  minHeight: 450,
  display: "grid",
  placeItems: "center",
  background: "#eee7df",
  borderRadius: 26,
  color: "#888",
};

const heroText = {
  marginTop: 32,
};

const heroLabel = {
  color: gold,
  letterSpacing: 5,
  fontFamily: "Arial, sans-serif",
  fontSize: 13,
  fontWeight: 700,
};

const heroName = {
  marginTop: 14,
  fontStyle: "italic",
  fontSize: "clamp(40px,8vw,70px)",
};

const heartLine = {
  marginTop: 15,
  color: "#d5aa2a",
};

/* GREETING */

const sectionWrap = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "20px 20px 45px",
};

const greetingCard = {
  padding: "42px 28px",
  borderRadius: 28,
  border: "1px solid #d8c8a9",
  background:
    "linear-gradient(180deg,#fffdf9,#faf4e9)",
  boxShadow:
    "0 14px 40px rgba(0,0,0,.07)",
  textAlign: "center",
};

const greetingStar = {
  color: "#b79963",
  fontSize: 25,
};

const greetingTitle = {
  marginTop: 10,
  color: "#816b4b",
  fontFamily: "Arial, sans-serif",
  letterSpacing: 4,
  fontWeight: 700,
  fontSize: 13,
};

const greetingLine = {
  width: 70,
  height: 1,
  margin: "18px auto",
  background: "#cbb58d",
};

const greetingText = {
  maxWidth: 560,
  margin: "0 auto",
  fontSize: "clamp(18px,3vw,23px)",
  lineHeight: 1.9,
  color: "#555049",
  fontStyle: "italic",
};

const greetingBottom = {
  marginTop: 20,
  color: "#b79963",
  fontSize: 26,
};

/* DATE TIME */

const dateTimeCard = {
  padding: "30px 22px",
  borderRadius: 22,
  border: "1px solid #ded2bf",
  background: "#fffaf4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 18,
  flexWrap: "wrap",
  textAlign: "center",
};

const dateTimeLabel = {
  width: "100%",
  color: "#80681f",
  letterSpacing: 4,
  fontFamily: "Arial, sans-serif",
  fontSize: 13,
  fontWeight: 700,
};

const dateTimeValue = {
  fontSize: "clamp(22px,4vw,32px)",
};

const dateTimeDivider = {
  color: gold,
  fontSize: 25,
};

/* COUNTDOWN */

const countdownSection = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "25px 20px 75px",
  textAlign: "center",
};

const goldLabel = {
  color: "#8c7000",
  letterSpacing: 5,
  fontFamily: "Arial, sans-serif",
  fontWeight: 700,
  fontSize: 13,
};

const countdownGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4,minmax(0,1fr))",
  gap: 10,
  marginTop: 30,
};

const countdownBox = {
  padding: "20px 5px",
  background: "#fff",
  borderRadius: 18,
  boxShadow:
    "0 8px 25px rgba(0,0,0,.06)",
};

const countdownValue = {
  fontSize: "clamp(25px,5vw,44px)",
  fontWeight: 700,
};

const countdownLabel = {
  marginTop: 5,
  color: "#777",
  fontFamily: "Arial, sans-serif",
  fontSize: 11,
};

const weddingToday = {
  marginTop: 30,
  fontSize: 22,
  fontWeight: 700,
};

/* VENUE */

const venueCard = {
  maxWidth: 760,
  margin: "0 auto 80px",
  padding: 28,
  boxSizing: "border-box",
  border: "1px solid #d8c9ae",
};

const safeImageFrame = {
  width: "100%",
  background: "#f4efe8",
  borderRadius: 24,
  padding: 8,
  boxSizing: "border-box",
};

const safeImage = {
  width: "100%",
  height: "auto",
  maxHeight: 600,
  objectFit: "contain",
  display: "block",
  margin: "0 auto",
  borderRadius: 18,
};

const venueContent = {
  padding: "30px 10px 5px",
};

const venueLabel = {
  letterSpacing: 4,
  fontFamily: "Arial, sans-serif",
  fontSize: 13,
  fontWeight: 700,
};

const venueTitle = {
  marginTop: 24,
  fontSize: "clamp(28px,5vw,42px)",
  fontStyle: "italic",
};

const venueAddress = {
  marginTop: 12,
  color: "#555",
  fontStyle: "italic",
  fontSize: 20,
};

const mapButton = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 28,
  padding: "17px 18px",
  border: "1px solid #d2aa24",
  borderRadius: 999,
  background: green,
  color: "#f6d577",
  textDecoration: "none",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
  fontWeight: 700,
  letterSpacing: 3,
  cursor: "pointer",
};

/* GALLERY */

const gallerySection = {
  padding: "70px 0 90px",
  background: "#fff",
};

const galleryHeader = {
  padding: "0 35px 28px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: 15,
};

const galleryTitle = {
  marginTop: 10,
  fontStyle: "italic",
  fontSize: "clamp(28px,5vw,42px)",
};

const galleryButtons = {
  display: "flex",
  gap: 10,
};

const circleButton = {
  width: 52,
  height: 52,
  borderRadius: "50%",
  border: "1px solid #bbb",
  background: "#fff",
  color: green,
  fontSize: 30,
  cursor: "pointer",
};

const galleryScroller = {
  display: "flex",
  gap: 25,
  overflowX: "auto",
  padding: "0 35px 20px",
  scrollSnapType: "x mandatory",
};

const galleryPhotoFrame = {
  flex: "0 0 min(75vw,500px)",
  width: "min(75vw,500px)",
  minHeight: 350,
  display: "grid",
  placeItems: "center",
  background: "#f6f2ec",
  borderRadius: 20,
  padding: 10,
  boxSizing: "border-box",
  scrollSnapAlign: "start",
};

const galleryPhoto = {
  width: "100%",
  height: "auto",
  maxHeight: 650,
  objectFit: "contain",
  display: "block",
  borderRadius: 15,
};

/* RSVP */

const rsvpSection = {
  padding: "80px 20px",
};

const rsvpCard = {
  maxWidth: 680,
  margin: "0 auto",
  padding: "50px 30px",
  border: "1px solid #d8cbb4",
  background: "#fffaf6",
};

const rsvpTitle = {
  textAlign: "center",
  fontStyle: "italic",
  fontSize: "clamp(48px,8vw,68px)",
};

const rsvpIntro = {
  textAlign: "center",
  fontStyle: "italic",
  color: "#555",
  fontSize: 20,
};

const fieldLabel = {
  margin: "28px 0 12px",
  textAlign: "center",
  letterSpacing: 4,
  fontFamily: "Arial, sans-serif",
  fontWeight: 700,
};

const bigInput = {
  width: "100%",
  boxSizing: "border-box",
  padding: 18,
  borderRadius: 20,
  border: "2px solid #d4ddd7",
  fontSize: 17,
};

const radioCard = {
  display: "flex",
  gap: 18,
  alignItems: "center",
  padding: 20,
  marginTop: 14,
  borderRadius: 20,
  border: "2px solid #d4ddd7",
  background: "#fff",
  fontFamily: "Arial, sans-serif",
};

const radioTitle = {
  fontSize: 18,
};

const radioSub = {
  marginTop: 5,
  color: "#8ca095",
};

const sendButton = {
  width: "100%",
  marginTop: 28,
  padding: 17,
  border: "none",
  borderRadius: 999,
  background: softGreen,
  color: "#fff",
  fontSize: 17,
  letterSpacing: 3,
  fontWeight: 700,
  cursor: "pointer",
};

/* WISH */

const wishSection = {
  padding: "80px 20px",
};

const wishHeading = {
  textAlign: "center",
  letterSpacing: 5,
  fontFamily: "Arial, sans-serif",
  fontWeight: 700,
  marginBottom: 35,
};

const wishList = {
  maxWidth: 600,
  margin: "0 auto 40px",
};

const wishDisplayCard = {
  position: "relative",
  padding: "40px 30px",
  borderRadius: 26,
  background: "#fff8e7",
  marginBottom: 20,
};

const quoteMark = {
  position: "absolute",
  top: 10,
  right: 20,
  fontSize: 70,
  color: "#e1dfd0",
};

const wishDisplayText = {
  textAlign: "center",
  fontStyle: "italic",
  fontSize: "clamp(22px,4vw,34px)",
  lineHeight: 1.6,
};

const wishAuthor = {
  marginTop: 20,
  textAlign: "center",
  letterSpacing: 4,
  fontFamily: "Arial, sans-serif",
  fontSize: 12,
};

const wishFormCard = {
  maxWidth: 600,
  margin: "0 auto",
  padding: "32px 28px",
  borderRadius: 28,
  background: "#fff9ea",
  border: "1px solid #ddd4c2",
};

const underlineInput = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #cfc7b7",
  padding: "14px 0",
  background: "transparent",
  fontSize: 17,
  outline: "none",
};

const wishTextarea = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: 150,
  marginTop: 22,
  border: "none",
  borderBottom: "1px solid #cfc7b7",
  background: "transparent",
  fontStyle: "italic",
  fontSize: 18,
  lineHeight: 1.7,
  outline: "none",
  resize: "vertical",
};

const characterCount = {
  textAlign: "right",
  marginTop: 5,
  color: "#999",
  fontSize: 12,
};

/* SHARE */

const shareSection = {
  maxWidth: 650,
  margin: "0 auto",
  padding: "60px 25px 80px",
  textAlign: "center",
};

const shareIdStyle = {
  margin: "20px 0",
  padding: 14,
  borderRadius: 14,
  background: "#fff",
  fontFamily: "monospace",
};

/* FOOTER */

const footerStyle = {
  padding: "75px 25px 60px",
  textAlign: "center",
  background:
    "linear-gradient(135deg,#073f2d,#18320f)",
  color: "#efcf74",
};

const footerHeart = {
  fontSize: 35,
};

const footerNames = {
  marginTop: 20,
  fontStyle: "italic",
  fontSize: "clamp(36px,7vw,56px)",
};

const copyright = {
  marginTop: 20,
  letterSpacing: 3,
  fontFamily: "Arial, sans-serif",
  fontSize: 11,
};

const editButton = {
  marginTop: 30,
  padding: "12px 25px",
  borderRadius: 999,
  border: "1px solid #efcf74",
  background: "transparent",
  color: "#efcf74",
  cursor: "pointer",
};
