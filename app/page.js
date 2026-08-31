"use client";

import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState("home");

  const [form, setForm] = useState({
    groom: "",
    bride: "",
    date: "",
    time: "",
    venue: "",
    message: "",
    language: "Монгол",
    template: "Цагаан сонгодог",
  });

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const names = `${form.groom || "Хүргэн"} & ${form.bride || "Бүсгүй"}`;
  const date = form.date || "2026-10-10";
  const time = form.time || "17:00";
  const venue = form.venue || "Хуримын ордон";
  const message =
    form.message ||
    "Эрхэм хүндэт таныг бидний хуримын баярт хүрэлцэн ирэхийг хүндэтгэн урьж байна.";

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

  if (form.template === "Цагаан сонгодог") {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "50px 20px",
          background: "#f7f3ed",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#fff",
            padding: "80px 45px",
            textAlign: "center",
            border: "1px solid #c9b08a",
            boxShadow: "0 20px 70px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ letterSpacing: 4, color: "#a48354" }}>
            WEDDING INVITATION
          </p>

          <div style={goldLine} />

          <p style={{ fontSize: 18, lineHeight: 1.8 }}>
            Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
          </p>

          <h1
            style={{
              fontSize: 52,
              color: "#6c5135",
              margin: "25px 0",
            }}
          >
            {names}
          </h1>

          <h2>{date}</h2>
          <p>{time}</p>
          <h3>{venue}</h3>

          <p style={messageStyle}>{message}</p>

          <button
            type="button"
            onClick={() => setStep("form")}
            style={goldButton}
          >
            ← Засах
          </button>
        </div>
      </main>
    );
  }

  if (form.template === "Цэцгэн чимэг") {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px 16px",
          background:
            "linear-gradient(135deg,#fff8fa 0%,#fffdfb 45%,#f8eef2 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background:
              "linear-gradient(180deg,#ffffff 0%,#fff7fa 100%)",
            padding: "42px 28px",
            borderRadius: 30,
            border: "1px solid #efc8d2",
            boxShadow: "0 24px 70px rgba(164,92,118,0.16)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={cornerFlowerTopLeft}>🌸</div>
          <div style={cornerFlowerTopRight}>🌷</div>
          <div style={cornerFlowerBottomLeft}>🌿</div>
          <div style={cornerFlowerBottomRight}>🌸</div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                fontSize: 28,
                letterSpacing: 8,
                color: "#c77690",
              }}
            >
              ❀ ❁ ❀
            </div>

            <p
              style={{
                color: "#a85f76",
                letterSpacing: 4,
                fontSize: 14,
                fontWeight: 700,
                marginTop: 18,
              }}
            >
              ХАЙРЫН БАЯР
            </p>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.8,
                color: "#6d5960",
              }}
            >
              Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
            </p>

            <h1
              style={{
                fontSize: "clamp(42px, 7vw, 66px)",
                color: "#b85f7c",
                fontStyle: "italic",
                margin: "22px 0",
              }}
            >
              {names}
            </h1>

            <div style={pinkLine} />

            <div style={flowerInfoCard}>
              <div style={infoItem}>
                <span style={infoLabel}>ОГНОО</span>
                <strong style={infoValue}>{date}</strong>
              </div>

              <div style={infoItem}>
                <span style={infoLabel}>ЦАГ</span>
                <strong style={infoValue}>{time}</strong>
              </div>

              <div style={infoItem}>
                <span style={infoLabel}>БАЙРШИЛ</span>
                <strong style={infoValue}>{venue}</strong>
              </div>
            </div>

            <p style={messageStyle}>{message}</p>

            <div
              style={{
                fontSize: 24,
                letterSpacing: 8,
                color: "#c77690",
                marginTop: 24,
              }}
            >
              ❀ ❁ ❀
            </div>

            <button
              type="button"
              onClick={() => setStep("form")}
              style={{
                ...pinkButton,
                marginTop: 28,
              }}
            >
              ← Засах
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (form.template === "Modern 3D") {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "45px 20px",
          background:
            "linear-gradient(135deg,#ccecff 0%,#e6dcff 45%,#ffe2ec 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            padding: 30,
            borderRadius: 38,
            background: "rgba(255,255,255,0.32)",
            backdropFilter: "blur(18px)",
            boxShadow:
              "0 30px 80px rgba(85,91,170,0.25)",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.62)",
              borderRadius: 30,
              padding: "60px 35px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(110,110,180,0.14)",
            }}
          >
            <div style={{ fontSize: 48 }}>💎</div>

            <p
              style={{
                textTransform: "uppercase",
                letterSpacing: 4,
                color: "#6870c8",
                fontWeight: 700,
              }}
            >
              Modern Wedding
            </p>

            <p style={{ fontSize: 19 }}>
              Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
            </p>

            <h1
              style={{
                fontSize: 58,
                margin: "20px 0",
                color: "#625fb1",
              }}
            >
              {names}
            </h1>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 35,
              }}
            >
              <InfoBox title="Огноо" value={date} />
              <InfoBox title="Цаг" value={time} />
              <InfoBox title="Байршил" value={venue} />
            </div>

            <p style={messageStyle}>{message}</p>

            <button
              type="button"
              onClick={() => setStep("form")}
              style={{
                ...blackButton,
                background:
                  "linear-gradient(90deg,#666ad4,#b26ca4)",
              }}
            >
              ← Засах
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (form.template === "Монгол хээ") {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px 20px",
          background:
            "linear-gradient(135deg,#4a0d0a,#851d18,#4a0d0a)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#fff4d7",
            border: "6px double #c99a32",
            boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
          }}
        >
          <div style={mongolPattern}>◆ ◈ ◆ ◈ ◆ ◈ ◆</div>

          <div style={{ padding: "45px 30px", textAlign: "center" }}>
            <p
              style={{
                color: "#b28628",
                letterSpacing: 3,
                fontWeight: 700,
              }}
            >
              МОНГОЛ ХУРИМЫН УРИЛГА
            </p>

            <p style={{ fontSize: 18, lineHeight: 1.8 }}>
              Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
            </p>

            <h1
              style={{
                fontSize: 54,
                color: "#8d2019",
                margin: "25px 0",
              }}
            >
              {names}
            </h1>

            <div
              style={{
                maxWidth: 430,
                margin: "30px auto",
                padding: 24,
                borderTop: "2px solid #c99a32",
                borderBottom: "2px solid #c99a32",
              }}
            >
              <h2>{date}</h2>
              <p>{time}</p>
              <h3>{venue}</h3>
            </div>

            <p style={messageStyle}>{message}</p>

            <button
              type="button"
              onClick={() => setStep("form")}
              style={redGoldButton}
            >
              ← Засах
            </button>
          </div>

          <div style={mongolPattern}>◆ ◈ ◆ ◈ ◆ ◈ ◆</div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background:
          "linear-gradient(135deg,#062b54,#0e608f,#062b54)",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "#f5fbff",
          border: "6px double #d2ae56",
          boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
        }}
      >
        <div style={kazakhPattern}>✦ ❖ ✦ ❖ ✦ ❖ ✦</div>

        <div style={{ padding: "50px 30px", textAlign: "center" }}>
          <p
            style={{
              color: "#c49b3e",
              letterSpacing: 3,
              fontWeight: 700,
            }}
          >
            ҮЙЛЕНУ ТОЙЫНА ШАҚЫРУ
          </p>

          <h1
            style={{
              fontSize: 54,
              color: "#0b5a87",
              margin: "25px 0",
            }}
          >
            {names}
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.8 }}>
            Құрметті қонақ, қуанышымызға ортақтасуға шақырамыз.
          </p>

          <div
            style={{
              margin: "35px auto",
              padding: 26,
              maxWidth: 430,
              border: "2px solid #d2ae56",
              borderRadius: 20,
            }}
          >
            <h2>{date}</h2>
            <p>{time}</p>
            <h3>{venue}</h3>
          </div>

          <p style={messageStyle}>{message}</p>

          <button
            type="button"
            onClick={() => setStep("form")}
            style={blueGoldButton}
          >
            ← Засах
          </button>
        </div>

        <div style={kazakhPattern}>✦ ❖ ✦ ❖ ✦ ❖ ✦</div>
      </div>
    </main>
  );
}

function InfoBox({ title, value }) {
  return (
    <div
      style={{
        minWidth: 150,
        padding: 18,
        borderRadius: 18,
        background: "rgba(255,255,255,0.68)",
        boxShadow: "0 10px 25px rgba(80,80,150,0.10)",
      }}
    >
      <div style={{ fontSize: 13, color: "#777" }}>{title}</div>
      <strong>{value}</strong>
    </div>
  );
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

const goldButton = {
  ...blackButton,
  background: "#a98655",
};

const redGoldButton = {
  ...blackButton,
  background: "#8d2019",
  border: "1px solid #d7ae50",
};

const blueGoldButton = {
  ...blackButton,
  background: "#0b5a87",
  border: "1px solid #d7ae50",
};

const goldLine = {
  width: 70,
  height: 1,
  background: "#b99b6b",
  margin: "25px auto",
};

const pinkLine = {
  width: 90,
  height: 1,
  background: "#d8a4b3",
  margin: "24px auto",
};

const messageStyle = {
  maxWidth: 520,
  margin: "30px auto",
  lineHeight: 1.8,
  fontSize: 18,
};

const flowerInfoCard = {
  maxWidth: 470,
  margin: "0 auto",
  padding: "26px 22px",
  borderRadius: 24,
  background: "linear-gradient(180deg,#fffafb,#fff4f7)",
  border: "1px solid #efcfd8",
  boxShadow: "0 14px 32px rgba(177,103,127,0.10)",
};

const infoItem = {
  display: "grid",
  gap: 5,
  marginBottom: 16,
};

const infoLabel = {
  fontSize: 12,
  letterSpacing: 2,
  color: "#b07a8c",
};

const infoValue = {
  fontSize: 22,
  color: "#5f4a52",
};

const cornerFlowerTopLeft = {
  position: "absolute",
  top: -20,
  left: -15,
  fontSize: 82,
  opacity: 0.18,
  transform: "rotate(-18deg)",
};

const cornerFlowerTopRight = {
  position: "absolute",
  top: -18,
  right: -14,
  fontSize: 78,
  opacity: 0.18,
  transform: "rotate(16deg)",
};

const cornerFlowerBottomLeft = {
  position: "absolute",
  bottom: -18,
  left: -10,
  fontSize: 78,
  opacity: 0.16,
  transform: "rotate(18deg)",
};

const cornerFlowerBottomRight = {
  position: "absolute",
  bottom: -18,
  right: -10,
  fontSize: 80,
  opacity: 0.16,
  transform: "rotate(-16deg)",
};

const mongolPattern = {
  textAlign: "center",
  color: "#c99a32",
  fontSize: 22,
  letterSpacing: 8,
  padding: "12px 0",
  background: "#7b1712",
};

const kazakhPattern = {
  textAlign: "center",
  color: "#d2ae56",
  fontSize: 22,
  letterSpacing: 8,
  padding: "12px 0",
  background: "#083b68",
};
