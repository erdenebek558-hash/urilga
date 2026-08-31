"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const heroRef = useRef(null);
  const venueRef = useRef(null);
  const galleryRef = useRef(null);
  const galleryScrollRef = useRef(null);

  const [step, setStep] = useState("home");

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

  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState([]);

  const names =
    `${form.groom || "Хүргэн"} & ${form.bride || "Бүсгүй"}`;

  const inviteMessage =
    form.message ||
    "Хайр сэтгэлээ нэгтгэн, амьдралын шинэ замаа хамтдаа эхлүүлэх энэ дурсамжит өдөр эрхэм таныг бидний хуримын баярт хүрэлцэн ирэхийг хүндэтгэн урьж байна.";

  const weddingDate = form.date || "2026-10-10";
  const weddingTime = form.time || "17:00";

  const changeForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
      ЗУРАГ УНШИХ
  ========================= */

  const readImage = (file, done) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Зөвхөн зураг сонгоно уу.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      done(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const selectHero = (e) => {
    const file = e.target.files?.[0];

    readImage(file, (result) => {
      setForm((prev) => ({
        ...prev,
        heroPhoto: result,
      }));
    });
  };

  const selectVenue = (e) => {
    const file = e.target.files?.[0];

    readImage(file, (result) => {
      setForm((prev) => ({
        ...prev,
        venuePhoto: result,
      }));
    });
  };

  const selectGallery = (e) => {
    const files = Array.from(e.target.files || [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 8);

    if (!files.length) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve({
                id:
                  `${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2)}`,
                src: reader.result,
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

  const removeHero = () => {
    setForm((prev) => ({
      ...prev,
      heroPhoto: "",
    }));

    if (heroRef.current) {
      heroRef.current.value = "";
    }
  };

  const removeVenue = () => {
    setForm((prev) => ({
      ...prev,
      venuePhoto: "",
    }));

    if (venueRef.current) {
      venueRef.current.value = "";
    }
  };

  const removeGallery = (id) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter(
        (item) => item.id !== id
      ),
    }));
  };

  /* =========================
        COUNTDOWN
  ========================= */

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

    const timer = setInterval(() => {
      const selectedTime = form.time || "00:00";

      const target = new Date(
        `${form.date}T${selectedTime}:00`
      ).getTime();

      const now = Date.now();
      const diff = target - now;

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
          (diff % 86400000) / 3600000
        ),
        minutes: Math.floor(
          (diff % 3600000) / 60000
        ),
        seconds: Math.floor(
          (diff % 60000) / 1000
        ),
        finished: false,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [form.date, form.time]);

  /* =========================
        RSVP
  ========================= */

  const submitRsvp = () => {
    if (!rsvpName.trim()) {
      alert("Нэрээ бичнэ үү.");
      return;
    }

    alert(
      `${rsvpName} — ${rsvpStatus} гэсэн хариу илгээгдлээ.`
    );

    setRsvpName("");
    setRsvpStatus("Ирнэ");
  };

  /* =========================
        ЕРӨӨЛ
  ========================= */

  const submitWish = () => {
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
  };

  /* =========================
       SHARE LINK
  ========================= */

  const copyShareLink = async () => {
    const slug = encodeURIComponent(
      `${form.groom || "groom"}-${
        form.bride || "bride"
      }-${form.date || "wedding"}`
    );

    const link =
      `${window.location.origin}/?invite=${slug}`;

    try {
      await navigator.clipboard.writeText(link);
      alert("Урилгын линк хуулагдлаа.");
    } catch {
      window.prompt(
        "Энэ линкийг хуулна уу:",
        link
      );
    }
  };

  /* =========================
       НҮҮР
  ========================= */

  if (step === "home") {
    return (
      <main style={styles.homePage}>
        <div style={styles.homeCard}>
          <div style={styles.ring}>💍</div>

          <h1 style={styles.homeTitle}>
            Урилга
          </h1>

          <p style={styles.homeText}>
            Хуримын онлайн урилгаа өөрөө бүтээ
          </p>

          <button
            type="button"
            onClick={() => setStep("form")}
            style={styles.mainButton}
          >
            Урилга бүтээх
          </button>
        </div>
      </main>
    );
  }

  /* =========================
       МЭДЭЭЛЭЛ ОРУУЛАХ
  ========================= */

  if (step === "form") {
    return (
      <main style={styles.formPage}>
        <section style={styles.formCard}>
          <h1 style={styles.formTitle}>
            Урилгын мэдээлэл
          </h1>

          <div style={styles.formGrid}>
            <input
              name="groom"
              value={form.groom}
              onChange={changeForm}
              placeholder="Хүргэний нэр"
              style={styles.input}
            />

            <input
              name="bride"
              value={form.bride}
              onChange={changeForm}
              placeholder="Бүсгүйн нэр"
              style={styles.input}
            />

            <label style={styles.label}>
              Хуримын огноо
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={changeForm}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Цаг
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={changeForm}
                style={styles.input}
              />
            </label>

            <input
              name="venueName"
              value={form.venueName}
              onChange={changeForm}
              placeholder="Хурим болох газрын нэр"
              style={styles.input}
            />

            <input
              name="venueAddress"
              value={form.venueAddress}
              onChange={changeForm}
              placeholder="Хурим болох газрын хаяг"
              style={styles.input}
            />

            <input
              name="mapUrl"
              value={form.mapUrl}
              onChange={changeForm}
              placeholder="Google Maps линк"
              style={styles.input}
            />

            <ImageUploader
              title="Хосын нүүр зураг"
              image={form.heroPhoto}
              inputRef={heroRef}
              onChange={selectHero}
              onRemove={removeHero}
            />

            <ImageUploader
              title="Байршлын зураг"
              image={form.venuePhoto}
              inputRef={venueRef}
              onChange={selectVenue}
              onRemove={removeVenue}
            />

            <div style={styles.uploadCard}>
              <h3 style={styles.uploadTitle}>
                🖼 Дурсамжийн зургууд
              </h3>

              <p style={styles.helpText}>
                8 хүртэл зураг оруулж болно
              </p>

              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                onChange={selectGallery}
                style={{ display: "none" }}
              />

              <button
                type="button"
                style={styles.chooseButton}
                onClick={() =>
                  galleryRef.current?.click()
                }
              >
                ＋ Зургууд сонгох
              </button>

              {form.gallery.length > 0 && (
                <div
                  style={
                    styles.galleryEditGrid
                  }
                >
                  {form.gallery.map(
                    (item) => (
                      <div
                        key={item.id}
                        style={
                          styles.galleryEditItem
                        }
                      >
                        <img
                          src={item.src}
                          alt=""
                          style={
                            styles.galleryEditImage
                          }
                        />

                        <button
                          type="button"
                          style={
                            styles.removeSmall
                          }
                          onClick={() =>
                            removeGallery(
                              item.id
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

            <label style={styles.label}>
              Урилгын мэндчилгээ
              <textarea
                name="message"
                value={form.message}
                onChange={changeForm}
                maxLength={800}
                rows={5}
                placeholder="Хайр сэтгэлээ нэгтгэн..."
                style={styles.textarea}
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setStep("preview");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              style={styles.previewButton}
            >
              Урилгаа харах
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* =========================
       УРИЛГЫН ХАРАГДАЦ
  ========================= */

  return (
    <main style={styles.previewPage}>
      {/* HEADER */}

      <header style={styles.header}>
        <button
          type="button"
          onClick={() => setStep("form")}
          style={styles.iconButton}
        >
          ☰
        </button>

        <div style={styles.headerNames}>
          {names}
        </div>

        <div style={styles.musicIcon}>
          ♪
        </div>
      </header>

      {/* HERO */}

      <section style={styles.hero}>
        {form.heroPhoto ? (
          <div style={styles.heroPhotoBox}>
            <img
              src={form.heroPhoto}
              alt="Хосын зураг"
              style={styles.heroPhoto}
            />
          </div>
        ) : (
          <div style={styles.heroEmpty}>
            📷 Хосын зураг
          </div>
        )}

        <div style={styles.heroWords}>
          <div style={styles.smallGold}>
            ХУРИМЫН УРИЛГА
          </div>

          <h1 style={styles.heroNames}>
            {names}
          </h1>

          <div style={styles.heartLine}>
            ─── ♥ ───
          </div>
        </div>
      </section>

      {/* МЭНДЧИЛГЭЭ */}

      <section style={styles.section}>
        <div style={styles.greetingCard}>
          <div style={styles.star}>
            ✦
          </div>

          <div style={styles.greetingTitle}>
            УРИЛГЫН МЭНДЧИЛГЭЭ
          </div>

          <div style={styles.goldLine} />

          <p style={styles.greetingText}>
            {inviteMessage}
          </p>

          <div style={styles.greetingOrnament}>
            ❦
          </div>
        </div>
      </section>

      {/* ОГНОО + ЦАГ */}

      <section style={styles.section}>
        <div style={styles.dateCard}>
          <div style={styles.dateIcon}>
            ◫
          </div>

          <div style={styles.dateLabel}>
            ОГНОО & ЦАГ
          </div>

          <div style={styles.dateValue}>
            {weddingDate}
          </div>

          <div style={styles.dateDot}>
            •
          </div>

          <div style={styles.dateValue}>
            {weddingTime}
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}

      <section style={styles.countdownSection}>
        <div style={styles.smallGold}>
          ХУРИМ ХҮРТЭЛ
        </div>

        {!form.date ? (
          <p style={styles.muted}>
            Огноогоо сонгоно уу
          </p>
        ) : countdown.finished ? (
          <div style={styles.today}>
            ♥ ӨНӨӨДӨР БИДНИЙ ХУРИМЫН ӨДӨР ♥
          </div>
        ) : (
          <div style={styles.countdownGrid}>
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

      {/* БАЙРШИЛ */}

      <section style={styles.venueCard}>
        {form.venuePhoto && (
          <div style={styles.venuePhotoBox}>
            <img
              src={form.venuePhoto}
              alt="Хурим болох газар"
              style={styles.venuePhoto}
            />
          </div>
        )}

        <div style={styles.venueBody}>
          <div style={styles.venueLabel}>
            ★ БАЙРШИЛ / VENUE
          </div>

          <h2 style={styles.venueName}>
            {form.venueName ||
              "Хурим болох газар"}
          </h2>

          <p style={styles.venueAddress}>
            {form.venueAddress ||
              "Хурим болох газрын хаяг"}
          </p>

          {form.mapUrl && (
            <a
              href={form.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mapButton}
            >
              📍 ГАЗРЫН ЗУРГААС ХАРАХ
            </a>
          )}
        </div>
      </section>

      {/* GALLERY */}

      {form.gallery.length > 0 && (
        <section style={styles.gallerySection}>
          <div style={styles.galleryTop}>
            <div>
              <div style={styles.smallGold}>
                БИДНИЙ ТҮҮХ
              </div>

              <h2 style={styles.galleryTitle}>
                Хуримын дурсамжууд
              </h2>
            </div>

            <div style={styles.arrowGroup}>
              <button
                type="button"
                style={styles.arrow}
                onClick={() =>
                  galleryScrollRef.current?.scrollBy(
                    {
                      left: -350,
                      behavior: "smooth",
                    }
                  )
                }
              >
                ‹
              </button>

              <button
                type="button"
                style={styles.arrow}
                onClick={() =>
                  galleryScrollRef.current?.scrollBy(
                    {
                      left: 350,
                      behavior: "smooth",
                    }
                  )
                }
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={galleryScrollRef}
            style={styles.galleryScroll}
          >
            {form.gallery.map((item) => (
              <div
                key={item.id}
                style={styles.galleryPhotoBox}
              >
                <img
                  src={item.src}
                  alt=""
                  style={styles.galleryPhoto}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}

      <section style={styles.rsvpSection}>
        <div style={styles.rsvpCard}>
          <h2 style={styles.rsvpHeading}>
            RSVP
          </h2>

          <p style={styles.rsvpText}>
            Таны ирэх нь бидний хувьд том
            хүндэтгэл!
          </p>

          <div style={styles.fieldTitle}>
            НЭРЭЭ БИЧНЭ ҮҮ
          </div>

          <input
            value={rsvpName}
            onChange={(e) =>
              setRsvpName(e.target.value)
            }
            placeholder="Таны нэр"
            style={styles.rsvpInput}
          />

          <div style={styles.fieldTitle}>
            ХУРИМД ИРЭХ ҮҮ?
          </div>

          <RadioOption
            value="Ирнэ"
            text="Хуримд оролцоно"
            selected={rsvpStatus}
            setSelected={setRsvpStatus}
          />

          <RadioOption
            value="Одоогоор мэдэхгүй"
            text="Одоохондоо тодорхойгүй"
            selected={rsvpStatus}
            setSelected={setRsvpStatus}
          />

          <RadioOption
            value="Ирэхгүй"
            text="Оролцох боломжгүй"
            selected={rsvpStatus}
            setSelected={setRsvpStatus}
          />

          <button
            type="button"
            onClick={submitRsvp}
            style={styles.sendButton}
          >
            ИЛГЭЭХ
          </button>
        </div>
      </section>

      {/* ЕРӨӨЛ */}

      <section style={styles.wishSection}>
        <div style={styles.wishHeader}>
          ♥ ЕРӨӨЛ ҮЛДЭЭХ ♥
        </div>

        {wishes.length > 0 && (
          <div style={styles.wishList}>
            {wishes.map((wish) => (
              <div
                key={wish.id}
                style={styles.wishCard}
              >
                <div style={styles.quote}>
                  ”
                </div>

                <p style={styles.wishQuote}>
                  “{wish.text}”
                </p>

                <div style={styles.wishAuthor}>
                  — {wish.name} —
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.wishForm}>
          <div style={styles.fieldTitle}>
            ЕРӨӨЛӨӨ БИЧНЭ ҮҮ
          </div>

          <input
            value={wishName}
            onChange={(e) =>
              setWishName(e.target.value)
            }
            placeholder="Таны нэр..."
            style={styles.wishInput}
          />

          <textarea
            value={wishText}
            onChange={(e) =>
              setWishText(e.target.value)
            }
            placeholder="Залуу гэр бүлд дулаан ерөөл, хүсэлтээ бичнэ үү..."
            rows={5}
            maxLength={500}
            style={styles.wishTextarea}
          />

          <div style={styles.counter}>
            {wishText.length}/500
          </div>

          <button
            type="button"
            onClick={submitWish}
            style={styles.sendButton}
          >
            ▷ ИЛГЭЭХ
          </button>
        </div>
      </section>

      {/* SHARE */}

      <section style={styles.shareSection}>
        <div style={styles.smallGold}>
          УРИЛГАА ХУВААЛЦАХ
        </div>

        <button
          type="button"
          onClick={copyShareLink}
          style={styles.mapButton}
        >
          🔗 УРИЛГЫН ЛИНК ХУУЛАХ
        </button>
      </section>

      {/* FOOTER */}

      <footer style={styles.footer}>
        <div style={styles.footerHeart}>
          ♥
        </div>

        <div style={styles.footerNames}>
          {names}
        </div>

        <p style={styles.footerText}>
          © 2026 {names}. ХАЙРААР БҮТЭЭВ.
        </p>

        <button
          type="button"
          onClick={() => {
            setStep("form");
            window.scrollTo(0, 0);
          }}
          style={styles.footerButton}
        >
          ← Засах
        </button>
      </footer>
    </main>
  );
}

/* ======================================================
   COMPONENTS
====================================================== */

function ImageUploader({
  title,
  image,
  inputRef,
  onChange,
  onRemove,
}) {
  return (
    <div style={styles.uploadCard}>
      <h3 style={styles.uploadTitle}>
        📷 {title}
      </h3>

      <p style={styles.helpText}>
        Босоо болон хэвтээ зураг автоматаар
        бүтнээрээ харагдана
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
      />

      {!image ? (
        <button
          type="button"
          style={styles.chooseButton}
          onClick={() =>
            inputRef.current?.click()
          }
        >
          ＋ Зураг сонгох
        </button>
      ) : (
        <>
          <div style={styles.previewImageBox}>
            <img
              src={image}
              alt=""
              style={styles.previewImage}
            />
          </div>

          <div style={styles.imageActions}>
            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              style={styles.changeImageButton}
            >
              ↻ Зураг солих
            </button>

            <button
              type="button"
              onClick={onRemove}
              style={styles.deleteImageButton}
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
    <div style={styles.countBox}>
      <div style={styles.countValue}>
        {String(value).padStart(2, "0")}
      </div>

      <div style={styles.countLabel}>
        {label}
      </div>
    </div>
  );
}

function RadioOption({
  value,
  text,
  selected,
  setSelected,
}) {
  return (
    <label style={styles.radioCard}>
      <input
        type="radio"
        value={value}
        checked={selected === value}
        onChange={() => setSelected(value)}
      />

      <div>
        <div style={styles.radioMain}>
          {value}
        </div>

        <div style={styles.radioSub}>
          {text}
        </div>
      </div>
    </label>
  );
}

/* ======================================================
   STYLES
====================================================== */

const GREEN = "#073f2d";
const GOLD = "#b78e18";
const CREAM = "#fbf7f2";
const LIGHT = "#fffaf5";

const styles = {
  homePage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(160deg,#fffaf5,#f3e8df)",
    fontFamily: "Arial, sans-serif",
    padding: 20,
  },

  homeCard: {
    textAlign: "center",
    padding: 40,
  },

  ring: {
    fontSize: 60,
  },

  homeTitle: {
    fontSize: 50,
    color: GREEN,
    marginBottom: 10,
  },

  homeText: {
    color: "#777",
    fontSize: 17,
    marginBottom: 30,
  },

  mainButton: {
    border: "none",
    borderRadius: 999,
    padding: "16px 34px",
    background: GREEN,
    color: "#fff",
    fontSize: 17,
    cursor: "pointer",
  },

  formPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg,#f6eee8,#fffaf5)",
    padding: "30px 15px",
    fontFamily: "Arial, sans-serif",
  },

  formCard: {
    width: "100%",
    maxWidth: 760,
    margin: "0 auto",
    padding: "28px",
    boxSizing: "border-box",
    background: "#fff",
    borderRadius: 26,
    boxShadow:
      "0 16px 45px rgba(0,0,0,.08)",
  },

  formTitle: {
    textAlign: "center",
    marginBottom: 30,
    color: GREEN,
  },

  formGrid: {
    display: "grid",
    gap: 18,
  },

  label: {
    display: "grid",
    gap: 7,
    color: "#555",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 15,
    border: "1px solid #ddd",
    fontSize: 16,
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: 16,
    borderRadius: 15,
    border: "1px solid #ddd",
    fontSize: 16,
    lineHeight: 1.7,
    resize: "vertical",
  },

  previewButton: {
    border: "none",
    borderRadius: 999,
    padding: 17,
    background:
      "linear-gradient(90deg,#be7f89,#d99ba3)",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
  },

  uploadCard: {
    border: "1px solid #e5ddd2",
    borderRadius: 20,
    padding: 20,
    background: "#fffdf9",
  },

  uploadTitle: {
    margin: 0,
    color: GREEN,
  },

  helpText: {
    fontSize: 13,
    color: "#999",
    margin: "8px 0 15px",
  },

  chooseButton: {
    width: "100%",
    padding: 15,
    borderRadius: 14,
    border: "1px dashed #b7a184",
    background: "#fff8ef",
    cursor: "pointer",
    fontSize: 16,
  },

  previewImageBox: {
    background: "#f4f0ea",
    padding: 8,
    borderRadius: 18,
  },

  previewImage: {
    width: "100%",
    height: "auto",
    maxHeight: 500,
    objectFit: "contain",
    display: "block",
    borderRadius: 14,
  },

  imageActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 12,
  },

  changeImageButton: {
    padding: 13,
    borderRadius: 12,
    border: "1px solid #bbb",
    background: "#fff",
    cursor: "pointer",
  },

  deleteImageButton: {
    padding: 13,
    borderRadius: 12,
    border: "1px solid #e8c6c6",
    background: "#fff5f5",
    color: "#9e4646",
    cursor: "pointer",
  },

  galleryEditGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(110px,1fr))",
    gap: 10,
    marginTop: 15,
  },

  galleryEditItem: {
    position: "relative",
  },

  galleryEditImage: {
    width: "100%",
    height: 130,
    objectFit: "contain",
    background: "#f4f1ec",
    borderRadius: 13,
  },

  removeSmall: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,.65)",
    color: "#fff",
    cursor: "pointer",
  },

  previewPage: {
    minHeight: "100vh",
    background: CREAM,
    color: GREEN,
    fontFamily: "Georgia, serif",
  },

  header: {
    minHeight: 78,
    display: "grid",
    gridTemplateColumns: "65px 1fr 65px",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(251,247,242,.96)",
    borderBottom: "1px solid #eee5dc",
  },

  iconButton: {
    border: "none",
    background: "transparent",
    fontSize: 27,
    color: GREEN,
    cursor: "pointer",
  },

  headerNames: {
    textAlign: "center",
    fontStyle: "italic",
    fontSize: "clamp(22px,5vw,34px)",
  },

  musicIcon: {
    textAlign: "center",
    fontSize: 25,
  },

  hero: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "25px 18px 55px",
    textAlign: "center",
  },

  heroPhotoBox: {
    width: "100%",
    background: "#f3eee7",
    borderRadius: 26,
    padding: 8,
    boxSizing: "border-box",
  },

  heroPhoto: {
    width: "100%",
    height: "auto",
    maxHeight: "760px",
    objectFit: "contain",
    display: "block",
    margin: "0 auto",
    borderRadius: 20,
  },

  heroEmpty: {
    minHeight: 350,
    display: "grid",
    placeItems: "center",
    background: "#eee6dd",
    borderRadius: 24,
    color: "#aaa",
  },

  heroWords: {
    marginTop: 30,
  },

  smallGold: {
    color: "#8a6c00",
    letterSpacing: 5,
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
    fontSize: 12,
    textAlign: "center",
  },

  heroNames: {
    margin: "16px 0 0",
    fontStyle: "italic",
    fontSize: "clamp(38px,8vw,68px)",
    fontWeight: 500,
  },

  heartLine: {
    marginTop: 13,
    color: "#d4aa27",
  },

  section: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "20px 20px 35px",
  },

  greetingCard: {
    padding: "42px 28px",
    borderRadius: 28,
    border: "1px solid #d6c49e",
    background:
      "linear-gradient(180deg,#fffdf9,#faf2e6)",
    boxShadow:
      "0 14px 38px rgba(0,0,0,.06)",
    textAlign: "center",
  },

  star: {
    color: "#b89a61",
    fontSize: 26,
  },

  greetingTitle: {
    marginTop: 10,
    color: "#826a46",
    letterSpacing: 4,
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
    fontSize: 12,
  },

  goldLine: {
    width: 70,
    height: 1,
    background: "#c9b285",
    margin: "18px auto",
  },

  greetingText: {
    maxWidth: 570,
    margin: "0 auto",
    fontSize: "clamp(18px,3vw,23px)",
    lineHeight: 1.9,
    color: "#524d46",
    fontStyle: "italic",
  },

  greetingOrnament: {
    marginTop: 22,
    color: "#b79963",
    fontSize: 26,
  },

  dateCard: {
    padding: "30px 20px",
    border: "1px solid #ded2bd",
    borderRadius: 22,
    background: LIGHT,
    textAlign: "center",
  },

  dateIcon: {
    fontSize: 30,
    color: GOLD,
  },

  dateLabel: {
    marginTop: 10,
    letterSpacing: 4,
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
    fontSize: 12,
    color: "#7c6315",
  },

  dateValue: {
    marginTop: 13,
    fontSize: "clamp(23px,4vw,31px)",
  },

  dateDot: {
    color: GOLD,
    margin: "5px 0",
  },

  countdownSection: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "30px 20px 70px",
    textAlign: "center",
  },

  countdownGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,minmax(0,1fr))",
    gap: 10,
    marginTop: 28,
  },

  countBox: {
    padding: "20px 5px",
    background: "#fff",
    borderRadius: 18,
    boxShadow:
      "0 7px 24px rgba(0,0,0,.06)",
  },

  countValue: {
    fontSize: "clamp(26px,5vw,43px)",
    fontWeight: 700,
  },

  countLabel: {
    marginTop: 5,
    fontFamily: "Arial, sans-serif",
    fontSize: 11,
    color: "#777",
  },

  muted: {
    color: "#888",
    marginTop: 25,
  },

  today: {
    marginTop: 28,
    fontSize: 22,
    color: GOLD,
  },

  venueCard: {
    maxWidth: 760,
    margin: "0 auto 80px",
    padding: 26,
    boxSizing: "border-box",
    border: "1px solid #d6c59e",
    background: "#fffaf5",
  },

  venuePhotoBox: {
    background: "#f3eee8",
    padding: 8,
    borderRadius: 22,
  },

  venuePhoto: {
    width: "100%",
    height: "auto",
    maxHeight: 600,
    objectFit: "contain",
    display: "block",
    borderRadius: 17,
  },

  venueBody: {
    padding: "28px 10px 5px",
  },

  venueLabel: {
    fontFamily: "Arial, sans-serif",
    letterSpacing: 4,
    fontWeight: 700,
    fontSize: 12,
  },

  venueName: {
    margin: "22px 0 0",
    fontSize: "clamp(28px,5vw,42px)",
    fontWeight: 500,
    fontStyle: "italic",
  },

  venueAddress: {
    color: "#555",
    fontStyle: "italic",
    fontSize: 19,
  },

  mapButton: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    marginTop: 25,
    padding: "17px 18px",
    borderRadius: 999,
    border: "1px solid #d5aa27",
    background: GREEN,
    color: "#f4d575",
    textAlign: "center",
    textDecoration: "none",
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: 3,
    cursor: "pointer",
  },

  gallerySection: {
    padding: "70px 0 85px",
    background: "#fff",
  },

  galleryTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 15,
    padding: "0 30px 28px",
  },

  galleryTitle: {
    margin: "10px 0 0",
    fontSize: "clamp(28px,5vw,42px)",
    fontStyle: "italic",
    fontWeight: 500,
  },

  arrowGroup: {
    display: "flex",
    gap: 8,
  },

  arrow: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "1px solid #bbb",
    background: "#fff",
    color: GREEN,
    fontSize: 28,
    cursor: "pointer",
  },

  galleryScroll: {
    display: "flex",
    gap: 22,
    overflowX: "auto",
    padding: "0 30px 20px",
    scrollSnapType: "x mandatory",
  },

  galleryPhotoBox: {
    flex: "0 0 min(78vw,470px)",
    width: "min(78vw,470px)",
    display: "grid",
    placeItems: "center",
    background: "#f4f0ea",
    padding: 10,
    borderRadius: 19,
    scrollSnapAlign: "start",
  },

  galleryPhoto: {
    width: "100%",
    height: "auto",
    maxHeight: 650,
    objectFit: "contain",
    display: "block",
    borderRadius: 14,
  },

  rsvpSection: {
    padding: "75px 20px",
  },

  rsvpCard: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "45px 28px",
    border: "1px solid #d7cab3",
    background: "#fffaf6",
  },

  rsvpHeading: {
    margin: 0,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: 500,
    fontSize: "clamp(48px,8vw,68px)",
  },

  rsvpText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#555",
    fontSize: 19,
  },

  fieldTitle: {
    margin: "28px 0 12px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: 4,
    fontSize: 13,
  },

  rsvpInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: 17,
    borderRadius: 18,
    border: "2px solid #d6ded9",
    fontSize: 17,
  },

  radioCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: 18,
    marginTop: 12,
    borderRadius: 18,
    border: "2px solid #d6ded9",
    background: "#fff",
    fontFamily: "Arial, sans-serif",
  },

  radioMain: {
    fontSize: 17,
  },

  radioSub: {
    marginTop: 4,
    color: "#8da095",
  },

  sendButton: {
    width: "100%",
    marginTop: 25,
    padding: 17,
    borderRadius: 999,
    border: "none",
    background: "#9cab9b",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: 3,
    cursor: "pointer",
  },

  wishSection: {
    padding: "70px 20px",
  },

  wishHeader: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: 5,
    marginBottom: 35,
  },

  wishList: {
    maxWidth: 600,
    margin: "0 auto 35px",
  },

  wishCard: {
    position: "relative",
    padding: "38px 28px",
    marginBottom: 18,
    background: "#fff7e5",
    borderRadius: 25,
  },

  quote: {
    position: "absolute",
    top: 5,
    right: 18,
    fontSize: 70,
    color: "#dddccc",
  },

  wishQuote: {
    textAlign: "center",
    fontStyle: "italic",
    fontSize: "clamp(22px,4vw,32px)",
    lineHeight: 1.6,
  },

  wishAuthor: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    letterSpacing: 4,
    fontSize: 12,
  },

  wishForm: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "30px 26px",
    borderRadius: 27,
    border: "1px solid #ddd2be",
    background: "#fff9e9",
  },

  wishInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    borderBottom: "1px solid #c9c1b4",
    padding: "14px 0",
    background: "transparent",
    fontSize: 17,
    outline: "none",
  },

  wishTextarea: {
    width: "100%",
    boxSizing: "border-box",
    marginTop: 20,
    minHeight: 140,
    border: "none",
    borderBottom: "1px solid #c9c1b4",
    background: "transparent",
    fontStyle: "italic",
    fontSize: 18,
    lineHeight: 1.7,
    outline: "none",
    resize: "vertical",
  },

  counter: {
    textAlign: "right",
    marginTop: 5,
    color: "#999",
    fontSize: 12,
  },

  shareSection: {
    maxWidth: 650,
    margin: "0 auto",
    padding: "50px 25px 75px",
    textAlign: "center",
  },

  footer: {
    padding: "70px 25px 55px",
    textAlign: "center",
    background:
      "linear-gradient(135deg,#073f2d,#172f0e)",
    color: "#efd074",
  },

  footerHeart: {
    fontSize: 32,
  },

  footerNames: {
    marginTop: 18,
    fontSize: "clamp(34px,7vw,54px)",
    fontStyle: "italic",
  },

  footerText: {
    fontFamily: "Arial, sans-serif",
    letterSpacing: 3,
    fontSize: 10,
  },

  footerButton: {
    marginTop: 25,
    padding: "12px 25px",
    borderRadius: 999,
    border: "1px solid #efd074",
    background: "transparent",
    color: "#efd074",
    cursor: "pointer",
  },
};
