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

  const templates = {
    "Цагаан сонгодог": {
      page: {
        background:
          "linear-gradient(135deg, #f7f4ef 0%, #ffffff 50%, #f2ece4 100%)",
      },
      card: {
        background: "#ffffff",
        color: "#3f352c",
        border: "1px solid #d8c7ad",
        boxShadow: "0 20px 60px rgba(86, 66, 47, 0.12)",
      },
      accent: "#b28a55",
      nameColor: "#8a6238",
      title: "СОНГОДОГ ХУРИМЫН УРИЛГА",
      font: "Georgia, serif",
    },

    "Цэцгэн чимэг": {
      page: {
        background:
          "radial-gradient(circle at top left,#ffe9ef 0,#fff7f9 35%,#f7eee8 100%)",
      },
      card: {
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(fff5f7,0.95))",
        color: "#694b55",
        border: "2px solid #efc4ce",
        boxShadow: "0 20px 60px rgba(180, 90, 120, 0.16)",
      },
      accent: "#cf7f96",
      nameColor: "#b35d78",
      title: "🌸 БИДНИЙ ХУРИМЫН БАЯР 🌸",
      font: "Georgia, serif",
    },

    "Modern 3D": {
      page: {
        background:
          "linear-gradient(135deg,#dff5ff 0%,#f4e9ff 45%,#ffe8f0 100%)",
      },
      card: {
        background: "rgba(255,255,255,0.62)",
        color: "#28304a",
        border: "1px solid rgba(255,255,255,0.85)",
        boxShadow:
          "0 30px 80px rgba(86, 94, 160, 0.22), inset 0 1px 0 rgba(255,255,255,0.8)",
        backdropFilter: "blur(18px)",
      },
      accent: "#6f75c8",
      nameColor: "#5458a8",
      title: "✨ БИДНИЙ ХУРИМЫН БАЯР ✨",
      font: "Arial, sans-serif",
    },

    "Монгол хээ": {
      page: {
        background:
          "linear-gradient(135deg,#4b0b0b 0%,#8c1d18 45%,#4b0b0b 100%)",
      },
      card: {
        background:
          "linear-gradient(180deg,#fff9ec 0%,#f7e8bf 100%)",
        color: "#4c1d12",
        border: "4px double #c79a34",
        boxShadow: "0 25px 70px rgba(0,0,0,0.30)",
      },
      accent: "#b78b28",
      nameColor: "#8b1e17",
      title: "☯ БИДНИЙ ХУРИМЫН БАЯР ☯",
      font: "Georgia, serif",
    },

    "Казах той": {
      page: {
        background:
          "linear-gradient(135deg,#082f5b 0%,#0f5f8c 45%,#082f5b 100%)",
      },
      card: {
        background:
          "linear-gradient(180deg,#f6fbff 0%,#e7f3fb 100%)",
        color: "#133d5c",
        border: "4px double #d5af52",
        boxShadow: "0 25px 70px rgba(0,0,0,0.28)",
      },
      accent: "#d3aa4e",
      nameColor: "#0b5a87",
      title: "✦ ҮЙЛЕНУ ТОЙЫНА ШАҚЫРУ ✦",
      font: "Georgia, serif",
    },
  };

  const selectedTemplate =
    templates[form.template] || templates["Цагаан сонгодог"];

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
        <section style={cardStyle}>
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
              style={{
                ...pinkButton,
                position: "relative",
                zIndex: 10,
              }}
            >
              Урилгаа харах
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: selectedTemplate.font,
        ...selectedTemplate.page,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
          padding: "65px 35px",
          borderRadius: 30,
          ...selectedTemplate.card,
        }}
      >
        <div style={{ fontSize: 44 }}>💍</div>

        <p
          style={{
            letterSpacing: 2,
            fontSize: 15,
            color: selectedTemplate.accent,
            fontWeight: 700,
          }}
        >
          {selectedTemplate.title}
        </p>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            marginTop: 16,
          }}
        >
          Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
        </p>

        <h1
          style={{
            fontSize: 50,
            color: selectedTemplate.nameColor,
            margin: "28px 0",
          }}
        >
          {form.groom || "Хүргэн"} & {form.bride || "Бүсгүй"}
        </h1>

        <div
          style={{
            width: 90,
            height: 2,
            background: selectedTemplate.accent,
            margin: "25px auto",
          }}
        />

        <h2>{form.date || "2026-10-10"}</h2>

        <p style={{ fontSize: 19 }}>
          {form.time || "17:00"}
        </p>

        <h3 style={{ fontSize: 23 }}>
          {form.venue || "Хуримын ордон"}
        </h3>

        <p
          style={{
            maxWidth: 520,
            margin: "28px auto",
            lineHeight: 1.8,
            fontSize: 18,
          }}
        >
          {form.message ||
            "Эрхэм хүндэт таныг бидний хуримын баярт хүрэлцэн ирэхийг хүндэтгэн урьж байна."}
        </p>

        <div
          style={{
            marginTop: 30,
            padding: 18,
            borderRadius: 16,
            border: `1px solid ${selectedTemplate.accent}`,
          }}
        >
          <p>
            Хэл: <strong>{form.language}</strong>
          </p>

          <p>
            Загвар: <strong>{form.template}</strong>
          </p>
        </div>

        <button
          onClick={() => setStep("form")}
          style={{
            ...blackButton,
            background: selectedTemplate.accent,
          }}
        >
          ← Засах
        </button>
      </div>
    </main>
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

const cardStyle = {
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
