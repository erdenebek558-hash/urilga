"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [step, setStep] = useState("home");

  const [form, setForm] = useState({
    groom: "",
    bride: "",
    date: "",
    time: "",
    venue: "",
    mapUrl: "",
    message: "",
    language: "Монгол",
    template: "Цагаан сонгодог",
    photo: "",
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

  const names = `${form.groom || "Хүргэн"} & ${form.bride || "Бүсгүй"}`;
  const date = form.date || "2026-10-10";
  const time = form.time || "17:00";
  const venue = form.venue || "Хуримын ордон";
  const message =
    form.message ||
    "Эрхэм хүндэт таныг бидний хуримын баярт хүрэлцэн ирэхийг хүндэтгэн урьж байна.";

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

    const updateCountdown = () => {
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
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        finished: false,
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

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
  };

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

  const copyShareLink = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?invite=${shareId}`
        : "";

    try {
      await navigator.clipboard.writeText(url);
      alert("Линк хуулагдлаа.");
    } catch {
      alert(url);
    }
  };

  if (step === "home") {
    return (
      <main style={pageStyle}>
        <section style={centerStyle}>
          <div style={{ fontSize: 58 }}>💍</div>

          <h1 style={{ fontSize: 48, marginBottom: 10 }}>
            Урилга
          </h1>

          <p style={{ fontSize: 20, color: "#777" }}>
            Хуримын онлайн урилгаа өөрөө бүтээ
          </p>

          <button
            type="button"
            onClick={() => setStep("form")}
            style={blackButton}
          >
            Урилга бүтээх
          </button>
        </section>
      </main>
    );
  }

  if (step === "form") {
    return (
      <main style={pageStyle}>
        <section style={formCard}>
          <h1 style={{ textAlign: "center" }}>
            Урилгын мэдээлэл
          </h1>

          <div style={formStyle}>
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
              name="venue"
              value={form.venue}
              onChange={change}
              placeholder="Ресторан / Байршил"
              style={inputStyle}
            />

            <input
              name="mapUrl"
              value={form.mapUrl}
              onChange={change}
              placeholder="Google Maps линк"
              style={inputStyle}
            />

            <label>
              Хосын зураг
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                style={inputStyle}
              />
            </label>

            {form.photo && (
              <img
                src={form.photo}
                alt="Хосын зураг"
                style={{
                  width: "100%",
                  maxHeight: 280,
                  objectFit: "cover",
                  borderRadius: 18,
                }}
              />
            )}

            <textarea
              name="message"
              value={form.message}
              onChange={change}
              placeholder="Урилгын текст"
              rows={5}
              style={inputStyle}
            />

            <select
              name="language"
              value={form.language}
              onChange={change}
              style={inputStyle}
            >
              <option>Монгол</option>
              <option>Қазақша</option>
            </select>

            <select
              name="template"
              value={form.template}
              onChange={change}
              style={inputStyle}
            >
              <option>Цагаан сонгодог</option>
              <option>Цэцгэн чимэг</option>
              <option>Modern 3D</option>
              <option>Монгол хээ</option>
              <option>Казах той</option>
            </select>

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

  return (
    <main style={previewPage(form.template)}>
      <section style={previewCard(form.template)}>
        <TemplateHeader template={form.template} />

        <p style={{ fontSize: 18, lineHeight: 1.8 }}>
          Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
        </p>

        <h1 style={namesStyle(form.template)}>{names}</h1>

        {form.photo && (
          <img
            src={form.photo}
            alt="Хосын зураг"
            style={{
              width: "100%",
              maxWidth: 560,
              height: 360,
              objectFit: "cover",
              borderRadius: 26,
              margin: "20px auto 30px",
              display: "block",
              boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
            }}
          />
        )}

        <div style={infoGrid}>
          <InfoBox title="Огноо" value={date} />
          <InfoBox title="Цаг" value={time} />
          <InfoBox title="Байршил" value={venue} />
        </div>

        <p style={messageStyle}>{message}</p>

        <CountdownBlock countdown={countdown} hasDate={!!targetDate} />

        {form.mapUrl && (
          <a
            href={form.mapUrl}
            target="_blank"
            rel="noreferrer"
            style={mapButton}
          >
            📍 Google Maps дээр харах
          </a>
        )}

        <section style={sectionCard}>
          <h2 style={sectionTitle}>RSVP</h2>

          <p style={sectionSub}>
            Та хуримын баярт хүрэлцэн ирэх эсэхээ мэдэгдэнэ үү.
          </p>

          <input
            value={rsvpName}
            onChange={(e) => setRsvpName(e.target.value)}
            placeholder="Таны нэр"
            style={inputStyle}
          />

          <select
            value={rsvpStatus}
            onChange={(e) => setRsvpStatus(e.target.value)}
            style={inputStyle}
          >
            <option>Ирнэ</option>
            <option>Ирэхгүй</option>
            <option>Одоогоор мэдэхгүй</option>
          </select>

          <button
            type="button"
            onClick={handleRsvp}
            style={greenButton}
          >
            RSVP илгээх
          </button>

          {rsvps.length > 0 && (
            <div style={{ marginTop: 20 }}>
              {rsvps.map((item) => (
                <div key={item.id} style={smallCard}>
                  <strong>{item.name}</strong>
                  <span>{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={sectionCard}>
          <h2 style={sectionTitle}>Ерөөлөө бичнэ үү</h2>

          <input
            value={wishName}
            onChange={(e) => setWishName(e.target.value)}
            placeholder="Таны нэр"
            style={inputStyle}
          />

          <textarea
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            placeholder="Залуу гэр бүлд зориулсан ерөөл, хүсэлтээ бичнэ үү..."
            maxLength={500}
            rows={5}
            style={inputStyle}
          />

          <div style={{ textAlign: "right", color: "#888", fontSize: 13 }}>
            {wishText.length}/500
          </div>

          <button
            type="button"
            onClick={handleWish}
            style={greenButton}
          >
            Ерөөл илгээх
          </button>

          {wishes.length > 0 && (
            <div style={{ marginTop: 20 }}>
              {wishes.map((wish) => (
                <div key={wish.id} style={wishCard}>
                  <strong>{wish.name}</strong>
                  <p style={{ lineHeight: 1.7 }}>{wish.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={sectionCard}>
          <h2 style={sectionTitle}>Урилгын линк</h2>

          <p style={sectionSub}>
            Энэ линкийг зочдод илгээж болно.
          </p>

          <div style={shareCode}>
            invite={shareId}
          </div>

          <button
            type="button"
            onClick={copyShareLink}
            style={shareButton}
          >
            🔗 Линк хуулах
          </button>
        </section>

        <button
          type="button"
          onClick={() => setStep("form")}
          style={blackButton}
        >
          ← Засах
        </button>
      </section>
    </main>
  );
}

function TemplateHeader({ template }) {
  if (template === "Цэцгэн чимэг") {
    return (
      <>
        <div style={{ fontSize: 30 }}>🌸 🌿 🌷 🌿 🌸</div>
        <p style={{ letterSpacing: 4, color: "#a85f76" }}>
          ХАЙРЫН БАЯР
        </p>
      </>
    );
  }

  if (template === "Modern 3D") {
    return (
      <>
        <div style={{ fontSize: 46 }}>💎</div>
        <p style={{ letterSpacing: 4, color: "#6870c8" }}>
          MODERN WEDDING
        </p>
      </>
    );
  }

  if (template === "Монгол хээ") {
    return (
      <>
        <div style={mongolPattern}>◆ ◈ ◆ ◈ ◆ ◈ ◆</div>
        <p style={{ letterSpacing: 3, color: "#9b7627" }}>
          МОНГОЛ ХУРИМЫН УРИЛГА
        </p>
      </>
    );
  }

  if (template === "Казах той") {
    return (
      <>
        <div style={kazakhPattern}>✦ ❖ ✦ ❖ ✦ ❖ ✦</div>
        <p style={{ letterSpacing: 3, color: "#c49b3e" }}>
          ҮЙЛЕНУ ТОЙЫНА ШАҚЫРУ
        </p>
      </>
    );
  }

  return (
    <p style={{ letterSpacing: 4, color: "#a48354" }}>
      WEDDING INVITATION
    </p>
  );
}

function CountdownBlock({ countdown, hasDate }) {
  if (!hasDate) {
    return (
      <section style={sectionCard}>
        <h2 style={sectionTitle}>Countdown</h2>
        <p>Хуримын огноогоо сонгоно уу.</p>
      </section>
    );
  }

  if (countdown.finished) {
    return (
      <section style={sectionCard}>
        <h2 style={sectionTitle}>Хуримын өдөр ирлээ 🎉</h2>
      </section>
    );
  }

  return (
    <section style={sectionCard}>
      <h2 style={sectionTitle}>Хурим хүртэл</h2>

      <div style={countdownGrid}>
        <CountBox label="Өдөр" value={countdown.days} />
        <CountBox label="Цаг" value={countdown.hours} />
        <CountBox label="Минут" value={countdown.minutes} />
        <CountBox label="Секунд" value={countdown.seconds} />
      </div>
    </section>
  );
}

function CountBox({ label, value }) {
  return (
    <div style={countBox}>
      <strong style={{ fontSize: 26 }}>{value}</strong>
      <span style={{ fontSize: 12, color: "#777" }}>{label}</span>
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div style={infoBox}>
      <div style={{ fontSize: 12, color: "#777", marginBottom: 5 }}>
        {title}
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function previewPage(template) {
  const backgrounds = {
    "Цагаан сонгодог": "#f7f3ed",
    "Цэцгэн чимэг":
      "linear-gradient(135deg,#fff8fa,#fffdfb,#f8eef2)",
    "Modern 3D":
      "linear-gradient(135deg,#ccecff,#e6dcff,#ffe2ec)",
    "Монгол хээ":
      "linear-gradient(135deg,#4a0d0a,#851d18,#4a0d0a)",
    "Казах той":
      "linear-gradient(135deg,#062b54,#0e608f,#062b54)",
  };

  return {
    minHeight: "100vh",
    padding: "40px 16px",
    background: backgrounds[template] || backgrounds["Цагаан сонгодог"],
    fontFamily:
      template === "Modern 3D" ? "Arial, sans-serif" : "Georgia, serif",
  };
}

function previewCard(template) {
  const styles = {
    "Цагаан сонгодог": {
      background: "#fff",
      border: "1px solid #c9b08a",
    },
    "Цэцгэн чимэг": {
      background: "linear-gradient(180deg,#fff,#fff7fa)",
      border: "1px solid #efc8d2",
    },
    "Modern 3D": {
      background: "rgba(255,255,255,0.68)",
      border: "1px solid rgba(255,255,255,0.85)",
      backdropFilter: "blur(18px)",
    },
    "Монгол хээ": {
      background: "#fff4d7",
      border: "5px double #c99a32",
    },
    "Казах той": {
      background: "#f5fbff",
      border: "5px double #d2ae56",
    },
  };

  return {
    maxWidth: 760,
    margin: "0 auto",
    padding: "50px 28px",
    textAlign: "center",
    borderRadius: 28,
    boxShadow: "0 24px 70px rgba(0,0,0,0.16)",
    ...styles[template],
  };
}

function namesStyle(template) {
  const colors = {
    "Цагаан сонгодог": "#6c5135",
    "Цэцгэн чимэг": "#b85f7c",
    "Modern 3D": "#625fb1",
    "Монгол хээ": "#8d2019",
    "Казах той": "#0b5a87",
  };

  return {
    fontSize: "clamp(42px, 7vw, 60px)",
    margin: "24px 0",
    color: colors[template] || "#333",
  };
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#fffaf7,#f5ebe5)",
  fontFamily: "Arial, sans-serif",
  padding: 24,
};

const centerStyle = {
  textAlign: "center",
  paddingTop: 120,
};

const formCard = {
  maxWidth: 680,
  margin: "40px auto",
  background: "#fff",
  padding: 30,
  borderRadius: 22,
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
};

const formStyle = {
  display: "grid",
  gap: 16,
  marginTop: 30,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 14,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 16,
  marginTop: 6,
};

const blackButton = {
  marginTop: 24,
  border: "none",
  borderRadius: 14,
  padding: "15px 28px",
  fontSize: 17,
  background: "#222",
  color: "#fff",
  cursor: "pointer",
};

const pinkButton = {
  border: "none",
  borderRadius: 14,
  padding: 16,
  fontSize: 18,
  background: "#c97985",
  color: "#fff",
  cursor: "pointer",
};

const greenButton = {
  width: "100%",
  marginTop: 12,
  border: "none",
  borderRadius: 999,
  padding: 14,
  background: "#9cab9b",
  color: "#fff",
  fontSize: 17,
  cursor: "pointer",
};

const mapButton = {
  display: "inline-block",
  margin: "14px auto 30px",
  padding: "14px 22px",
  borderRadius: 999,
  background: "#456b57",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
};

const shareButton = {
  ...greenButton,
  background: "#5c6f8c",
};

const shareCode = {
  background: "#f4f4f4",
  padding: 12,
  borderRadius: 12,
  fontFamily: "monospace",
  marginBottom: 10,
  wordBreak: "break-all",
};

const sectionCard = {
  margin: "30px auto",
  padding: 24,
  maxWidth: 620,
  borderRadius: 22,
  background: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(150,150,150,0.18)",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: 10,
};

const sectionSub = {
  color: "#666",
  lineHeight: 1.6,
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: 14,
  margin: "30px 0",
};

const infoBox = {
  padding: 18,
  borderRadius: 18,
  background: "rgba(255,255,255,0.75)",
  boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
};

const countdownGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 10,
  marginTop: 16,
};

const countBox = {
  display: "grid",
  gap: 4,
  padding: 14,
  borderRadius: 16,
  background: "#fff",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const smallCard = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  padding: 12,
  marginBottom: 8,
  borderRadius: 12,
  background: "#fff",
};

const wishCard = {
  textAlign: "left",
  padding: 16,
  marginBottom: 12,
  borderRadius: 14,
  background: "#fff",
};

const messageStyle = {
  maxWidth: 560,
  margin: "30px auto",
  lineHeight: 1.8,
  fontSize: 18,
};

const mongolPattern = {
  textAlign: "center",
  color: "#c99a32",
  fontSize: 20,
  letterSpacing: 7,
  marginBottom: 16,
};

const kazakhPattern = {
  textAlign: "center",
  color: "#d2ae56",
  fontSize: 20,
  letterSpacing: 7,
  marginBottom: 16,
};
