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
    hosts: "",
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

  const hosts = form.hosts || "Хуримын эзэд";
  const date = form.date || "2026-10-10";
  const time = form.time || "17:00";
  const venueName = form.venueName || "Хуримын ордон";
  const venueAddress = form.venueAddress || "Улаанбаатар";

  const message =
    form.message ||
    "Эрхэм зочид оо! Хайр сэтгэлээ нэгтгэн амьдралын шинэ замаа эхлүүлэх энэ дурсамжит өдөр эрхэм таныг бидний хуримын баярт хүрэлцэн ирэхийг хүндэтгэн урьж байна.";

  /* ===================== ЗУРАГ ===================== */

  const readImage = (file, callback) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Зөвхөн зураг сонгоно уу.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => callback(reader.result);
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

            reader.onload = () =>
              resolve({
                id:
                  Date.now().toString() +
                  Math.random().toString(36),
                src: reader.result,
                name: file.name,
              });

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
    const value = new Date(`${form.date}T${targetTime}:00`);

    return Number.isNaN(value.getTime()) ? null : value;
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
      const diff = targetDate.getTime() - Date.now();

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
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
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

  /* ===================== ЕРӨӨЛ ===================== */

  const handleWish = () => {
    if (!wishName.trim() || !wishText.trim()) {
      alert("Нэр болон ерөөлөө бичнэ үү.");
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

  /* ===================== GALLERY SCROLL ===================== */

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
          <div style={{ fontSize: 60 }}>💍</div>

          <h1 style={{ fontSize: 48, margin: "10px 0" }}>
            Урилга
          </h1>

          <p style={{ color: "#777", fontSize: 19 }}>
            Хуримын онлайн урилгаа өөрөө бүтээ
          </p>

          <button
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
          <h1 style={{ textAlign: "center" }}>
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

            <input
              name="hosts"
              value={form.hosts}
              onChange={change}
              placeholder="Хуримын эзэд"
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
                style={{ display: "none" }}
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
                  {form.gallery.map((item) => (
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
                          removeGalleryPhoto(item.id)
                        }
                        style={miniDelete}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label>
              Урилгын мэндчилгээ
              <textarea
                name="message"
                value={form.message}
                onChange={change}
                placeholder="Эрхэм зочид оо..."
                rows={5}
                maxLength={800}
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
              style={pinkButton}
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
    <main style={previewBackground}>
      <header style={headerStyle}>
        <div style={menuIcon}>☰</div>

        <div style={headerNames}>
          {names}
        </div>

        <div style={musicIcon}>♪</div>
      </header>

      {/* HERO */}

      <section style={heroSection}>
        {form.heroPhoto ? (
          <img
            src={form.heroPhoto}
            alt="Хосын зураг"
            style={heroImage}
          />
        ) : (
          <div style={heroPlaceholder}>
            Хосын нүүр зураг
          </div>
        )}

        <div style={heroOverlay} />

        <div style={heroText}>
          <div style={heroSmall}>
            ХУРИМЫН УРИЛГА
          </div>

          <h1 style={heroNames}>
            {names}
          </h1>

          <div style={heartLine}>
            ─── ♥ ───
          </div>
        </div>
      </section>

      {/* МЭНДЧИЛГЭЭ */}

      <section style={invitationMessageSection}>
        <div style={smallScriptName}>
          {names}
        </div>

        <div style={guestTitle}>
          Эрхэм зочид оо!!
        </div>

        <p style={messageText}>
          {message}
        </p>

        <div style={sparkle}>
          ✦
        </div>
      </section>

      {/* ХУРИМЫН ЭЗЭД */}

      <section style={hostsSection}>
        <div style={goldLabel}>
          ХУРИМЫН ЭЗЭД
        </div>

        <div style={hostsPill}>
          {hosts}
        </div>
      </section>

      {/* DATE */}

      <section style={infoSection}>
        <InfoLargeCard
          icon="▣"
          label="ОГНОО / DATE"
          value={date}
        />

        <InfoLargeCard
          icon="◷"
          label="ЦАГ / TIME"
          value={`${time} ЦАГТ`}
        />
      </section>

      {/* VENUE */}

      <section style={venueCard}>
        {form.venuePhoto && (
          <img
            src={form.venuePhoto}
            alt="Байршил"
            style={venueImage}
          />
        )}

        <div style={venueContent}>
          <div style={venueLabel}>
            ★ БАЙРШИЛ / VENUE
          </div>

          <div style={venueTitle}>
            {venueName}
          </div>

          <div style={venueAddressStyle}>
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

      {/* COUNTDOWN */}

      <section style={countdownSection}>
        <div style={goldLabel}>
          ХУРИМ ХҮРТЭЛ
        </div>

        {!targetDate ? (
          <p>Хуримын огноогоо сонгоно уу.</p>
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
                onClick={() =>
                  scrollGallery(-1)
                }
                style={circleButton}
              >
                ‹
              </button>

              <button
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
              <img
                key={item.id}
                src={item.src}
                alt=""
                style={galleryPhoto}
              />
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
            onClick={handleRsvp}
            style={sendButton}
          >
            ИЛГЭЭХ
          </button>
        </div>
      </section>

      {/* WISHES */}

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
          onClick={copyShareLink}
          style={mapButton}
        >
          🔗 ЛИНК ХУУЛАХ
        </button>
      </section>

      {/* FOOTER */}

      <footer style={footerStyle}>
        <p style={footerQuote}>
          Хайрлаж явъя гэж харин бид өөрсдөө шийдсэн
        </p>

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
        style={{ display: "none" }}
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

function InfoLargeCard({
  icon,
  label,
  value,
}) {
  return (
    <div style={infoLargeCard}>
      <div style={infoIcon}>
        {icon}
      </div>

      <div style={infoLabel}>
        {label}
      </div>

      <div style={infoValue}>
        {value}
      </div>
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

/* ===================== STYLES ===================== */

const cream = "#fbf7f2";
const green = "#063f2d";
const gold = "#b58c19";
const softGreen = "#9eac9f";

const pageStyle = {
  minHeight: "100vh",
  background: "#f7efe9",
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
  borderRadius: 24,
  padding: 28,
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
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 15,
  fontSize: 16,
  marginTop: 6,
};

const primaryButton = {
  border: "none",
  background: green,
  color: "white",
  borderRadius: 999,
  padding: "15px 30px",
  fontSize: 17,
  cursor: "pointer",
  marginTop: 25,
};

const pinkButton = {
  ...primaryButton,
  width: "100%",
  background:
    "linear-gradient(90deg,#bd7b87,#d6949e)",
};

const uploadCard = {
  border: "1px solid #e6ddd4",
  borderRadius: 22,
  padding: 20,
  background: "#fffdf9",
};

const uploadTitle = {
  fontWeight: 700,
  fontSize: 17,
  color: green,
};

const uploadHint = {
  color: "#999",
  fontSize: 13,
  margin: "5px 0 15px",
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
  width: "100%",
  marginTop: 12,
  background: "#f4f1ed",
  borderRadius: 18,
  padding: 8,
  boxSizing: "border-box",
};

const photoPreview = {
  width: "100%",
  height: "auto",
  maxHeight: 550,
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
  objectFit: "cover",
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
  color: "white",
  cursor: "pointer",
};

/* PREVIEW */

const previewBackground = {
  minHeight: "100vh",
  background: cream,
  color: green,
  fontFamily: "Georgia, serif",
};

const headerStyle = {
  height: 84,
  background: "rgba(251,247,242,.96)",
  display: "grid",
  gridTemplateColumns: "70px 1fr 70px",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 50,
  borderBottom: "1px solid #eee6dd",
};

const menuIcon = {
  fontSize: 30,
  textAlign: "center",
};

const musicIcon = {
  fontSize: 28,
  textAlign: "center",
};

const headerNames = {
  textAlign: "center",
  fontSize: "clamp(24px,5vw,36px)",
  fontStyle: "italic",
};

const heroSection = {
  position: "relative",
  width: "100%",
  minHeight: 620,
  overflow: "hidden",
  background: "#ddd",
};

const heroImage = {
  width: "100%",
  height: 700,
  display: "block",
  objectFit: "cover",
};

const heroPlaceholder = {
  height: 650,
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(180deg,#cfc5bd,#eee6dd)",
  color: "#777",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom,rgba(0,0,0,.05) 25%,rgba(251,247,242,.15) 55%,#fbf7f2 100%)",
};

const heroText = {
  position: "absolute",
  left: 20,
  right: 20,
  bottom: 70,
  textAlign: "center",
};

const heroSmall = {
  letterSpacing: 5,
  color: gold,
  fontWeight: 700,
  fontSize: 14,
};

const heroNames = {
  margin: "18px 0",
  fontSize: "clamp(44px,9vw,76px)",
  fontStyle: "italic",
  fontWeight: 500,
  color: green,
};

const heartLine = {
  color: "#d7aa2c",
  letterSpacing: 5,
};

const invitationMessageSection = {
  padding: "85px 25px",
  maxWidth: 800,
  margin: "0 auto",
  textAlign: "center",
};

const smallScriptName = {
  fontStyle: "italic",
  fontSize: "clamp(28px,5vw,40px)",
  marginBottom: 35,
};

const guestTitle = {
  fontStyle: "italic",
  fontSize: 22,
  marginBottom: 25,
};

const messageText = {
  fontSize: "clamp(18px,3vw,25px)",
  lineHeight: 1.9,
  color: "#555",
  fontStyle: "italic",
};

const sparkle = {
  marginTop: 45,
  fontSize: 35,
  color: "#d8ae2a",
};

const hostsSection = {
  background: "#fbf1ea",
  textAlign: "center",
  padding: "75px 20px",
};

const goldLabel = {
  letterSpacing: 5,
  color: "#8e7000",
  fontWeight: 700,
  fontFamily: "Arial, sans-serif",
  fontSize: 14,
};

const hostsPill = {
  maxWidth: 560,
  margin: "30px auto 0",
  padding: "25px 20px",
  borderRadius: 999,
  border: "1px solid #d8c9ae",
  fontSize: "clamp(26px,5vw,40px)",
  fontStyle: "italic",
};

const infoSection = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "75px 25px 30px",
  display: "grid",
  gap: 28,
};

const infoLargeCard = {
  border: "1px solid #d9cbb2",
  padding: "45px 20px",
  textAlign: "center",
  background: "#fffaf6",
};

const infoIcon = {
  color: "#8b7000",
  fontSize: 42,
  marginBottom: 18,
};

const infoLabel = {
  fontFamily: "Arial, sans-serif",
  fontWeight: 700,
  letterSpacing: 4,
  fontSize: 14,
};

const infoValue = {
  marginTop: 20,
  fontSize: "clamp(25px,5vw,36px)",
};

const venueCard = {
  maxWidth: 760,
  margin: "20px auto 80px",
  border: "1px solid #d8c9ae",
  padding: 28,
  boxSizing: "border-box",
};

const venueImage = {
  width: "100%",
  maxHeight: 430,
  objectFit: "cover",
  borderRadius: 24,
  display: "block",
};

const venueContent = {
  padding: "35px 15px 10px",
};

const venueLabel = {
  fontFamily: "Arial, sans-serif",
  letterSpacing: 4,
  fontWeight: 700,
  fontSize: 14,
};

const venueTitle = {
  marginTop: 25,
  fontSize: "clamp(30px,6vw,45px)",
  fontStyle: "italic",
};

const venueAddressStyle = {
  marginTop: 15,
  fontSize: 21,
  fontStyle: "italic",
  color: "#555",
};

const mapButton = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 30,
  padding: "18px 20px",
  background: green,
  color: "#f6d577",
  textDecoration: "none",
  textAlign: "center",
  border: "1px solid #d4ad25",
  borderRadius: 999,
  fontFamily: "Arial, sans-serif",
  fontWeight: 700,
  letterSpacing: 3,
  cursor: "pointer",
};

const countdownSection = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "50px 20px 90px",
  textAlign: "center",
};

const countdownGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 10,
  marginTop: 35,
};

const countdownBox = {
  background: "#fff",
  padding: "20px 5px",
  borderRadius: 18,
  boxShadow:
    "0 8px 25px rgba(0,0,0,.06)",
};

const countdownValue = {
  fontSize: "clamp(28px,6vw,48px)",
  fontWeight: 700,
};

const countdownLabel = {
  marginTop: 7,
  color: "#777",
  fontFamily: "Arial, sans-serif",
  fontSize: 12,
};

const weddingToday = {
  marginTop: 30,
  fontSize: 25,
  color: green,
};

const gallerySection = {
  padding: "75px 0 90px",
  background: "#fff",
};

const galleryHeader = {
  padding: "0 35px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: 15,
};

const galleryTitle = {
  marginTop: 10,
  fontSize: "clamp(30px,6vw,45px)",
  fontStyle: "italic",
};

const galleryButtons = {
  display: "flex",
  gap: 10,
};

const circleButton = {
  width: 54,
  height: 54,
  borderRadius: "50%",
  border: "1px solid #bbb",
  background: "white",
  color: green,
  fontSize: 32,
  cursor: "pointer",
};

const galleryScroller = {
  display: "flex",
  gap: 28,
  overflowX: "auto",
  padding: "0 35px 20px",
  scrollSnapType: "x mandatory",
};

const galleryPhoto = {
  flex: "0 0 min(65vw,460px)",
  width: "min(65vw,460px)",
  height: 600,
  objectFit: "cover",
  borderRadius: 16,
  scrollSnapAlign: "start",
};

const rsvpSection = {
  padding: "90px 22px",
  background: cream,
};

const rsvpCard = {
  maxWidth: 700,
  margin: "0 auto",
  padding: "55px 35px",
  border: "1px solid #d8cbb4",
  background: "#fffaf6",
};

const rsvpTitle = {
  textAlign: "center",
  fontSize: "clamp(50px,9vw,70px)",
  fontStyle: "italic",
};

const rsvpIntro = {
  textAlign: "center",
  fontSize: 22,
  fontStyle: "italic",
  color: "#555",
  marginBottom: 45,
};

const fieldLabel = {
  margin: "25px 0 12px",
  fontFamily: "Arial, sans-serif",
  letterSpacing: 4,
  fontWeight: 700,
  textAlign: "center",
};

const bigInput = {
  width: "100%",
  boxSizing: "border-box",
  padding: 20,
  borderRadius: 22,
  border: "2px solid #d4ddd7",
  fontSize: 18,
  background: "white",
};

const radioCard = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  padding: 22,
  marginTop: 15,
  borderRadius: 20,
  border: "2px solid #d4ddd7",
  background: "white",
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
  border: "none",
  borderRadius: 999,
  background: softGreen,
  color: "white",
  padding: 18,
  marginTop: 30,
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: 3,
};

const wishSection = {
  padding: "85px 25px",
};

const wishHeading = {
  textAlign: "center",
  letterSpacing: 5,
  fontFamily: "Arial, sans-serif",
  fontWeight: 700,
  marginBottom: 40,
};

const wishList = {
  maxWidth: 600,
  margin: "0 auto 45px",
};

const wishDisplayCard = {
  position: "relative",
  minHeight: 220,
  padding: "45px 35px",
  borderRadius: 28,
  background: "#fff8e7",
  marginBottom: 20,
  boxSizing: "border-box",
};

const quoteMark = {
  position: "absolute",
  top: 15,
  right: 25,
  fontSize: 80,
  color: "#e1dfd0",
};

const wishDisplayText = {
  fontSize: "clamp(24px,5vw,36px)",
  lineHeight: 1.6,
  fontStyle: "italic",
  textAlign: "center",
};

const wishAuthor = {
  marginTop: 25,
  textAlign: "center",
  letterSpacing: 5,
  fontFamily: "Arial, sans-serif",
  fontSize: 13,
};

const wishFormCard = {
  maxWidth: 600,
  margin: "0 auto",
  borderRadius: 30,
  padding: "35px 30px",
  background: "#fff9ea",
  border: "1px solid #ddd4c2",
};

const underlineInput = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #cfc7b7",
  background: "transparent",
  padding: "15px 0",
  fontSize: 18,
  outline: "none",
};

const wishTextarea = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: 150,
  marginTop: 25,
  border: "none",
  borderBottom: "1px solid #cfc7b7",
  background: "transparent",
  fontSize: 19,
  fontStyle: "italic",
  lineHeight: 1.7,
  resize: "vertical",
  outline: "none",
};

const characterCount = {
  textAlign: "right",
  color: "#999",
  fontSize: 12,
  marginTop: 5,
};

const shareSection = {
  maxWidth: 650,
  margin: "0 auto",
  padding: "70px 25px",
  textAlign: "center",
};

const shareIdStyle = {
  margin: "25px 0",
  padding: 15,
  borderRadius: 14,
  background: "white",
  fontFamily: "monospace",
};

const footerStyle = {
  background:
    "linear-gradient(135deg,#063f2d,#152f0d)",
  color: "#efcf74",
  textAlign: "center",
  padding: "85px 25px 65px",
};

const footerQuote = {
  fontStyle: "italic",
  fontSize: 22,
  lineHeight: 1.8,
};

const footerHeart = {
  fontSize: 35,
  margin: "30px 0",
};

const footerNames = {
  fontSize: "clamp(38px,7vw,58px)",
  fontStyle: "italic",
};

const copyright = {
  marginTop: 25,
  fontFamily: "Arial, sans-serif",
  letterSpacing: 3,
  fontSize: 11,
};

const editButton = {
  marginTop: 35,
  padding: "12px 25px",
  borderRadius: 999,
  border: "1px solid #efcf74",
  background: "transparent",
  color: "#efcf74",
  cursor: "pointer",
};
