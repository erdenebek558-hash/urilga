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
              <option>Монгол хээ</option>
              <option>Цэцгэн чимэг</option>
              <option>Modern 3D</option>
              <option>Казах той</option>
            </select>

            <button
              onClick={() => setStep("preview")}
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
    <main style={previewPage}>
      <div style={invitationCard}>
        <div style={{ fontSize: 42 }}>💍</div>

        <p style={{ letterSpacing: 3, color: "#a37b5b" }}>
          БИДНИЙ ХУРИМД УРЬЖ БАЙНА
        </p>

        <h1 style={namesStyle}>
          {form.groom || "Хүргэн"} & {form.bride || "Бүсгүй"}
        </h1>

        <div style={lineStyle} />

        <h2>{form.date || "2026-10-10"}</h2>

        <p style={{ fontSize: 18 }}>
          {form.time || "17:00"}
        </p>

        <h3>{form.venue || "Хуримын ордон"}</h3>

        <p
          style={{
            maxWidth: 500,
            margin: "25px auto",
            lineHeight: 1.8,
            color: "#555",
          }}
        >
          {form.message ||
            "Эрхэм хүндэт таныг бидний хуримын баярт хүрэлцэн ирэхийг урьж байна."}
        </p>

        <p>
          Хэл: <strong>{form.language}</strong>
        </p>

        <p>
          Загвар: <strong>{form.template}</strong>
        </p>

        <button
          onClick={() => setStep("form")}
          style={blackButton}
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

const previewPage = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#f8eee8,#fffaf7)",
  padding: "40px 20px",
  fontFamily: "Georgia, serif",
};

const invitationCard = {
  maxWidth: 700,
  margin: "0 auto",
  background: "#fff",
  textAlign: "center",
  padding: "70px 35px",
  borderRadius: 28,
  boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
};

const namesStyle = {
  fontSize: 48,
  color: "#9a6749",
  margin: "24px 0",
};

const lineStyle = {
  width: 90,
  height: 1,
  background: "#c7a17a",
  margin: "25px auto",
};
