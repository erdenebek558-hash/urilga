"use client";

import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#fffaf7,#f8f1ec)",
        fontFamily: "Arial, sans-serif",
        padding: "30px 20px",
      }}
    >
      {!showForm ? (
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
            paddingTop: "100px",
          }}
        >
          <div style={{ fontSize: "56px" }}>💍</div>

          <h1 style={{ fontSize: "48px", margin: "15px 0" }}>
            Урилга
          </h1>

          <p style={{ fontSize: "20px", color: "#666" }}>
            Хуримын онлайн урилгаа өөрөө бүтээ
          </p>

          <button
            onClick={() => setShowForm(true)}
            style={{
              marginTop: "30px",
              border: "none",
              borderRadius: "14px",
              padding: "16px 30px",
              fontSize: "18px",
              background: "#111",
              color: "white",
              cursor: "pointer",
            }}
          >
            Урилга бүтээх
          </button>
        </section>
      ) : (
        <section
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ textAlign: "center" }}>
            Урилгын мэдээлэл
          </h1>

          <div style={{ display: "grid", gap: "16px", marginTop: "30px" }}>
            <input placeholder="Хүргэний нэр" style={inputStyle} />
            <input placeholder="Бүсгүйн нэр" style={inputStyle} />

            <label>
              Хуримын огноо
              <input type="date" style={inputStyle} />
            </label>

            <label>
              Цаг
              <input type="time" style={inputStyle} />
            </label>

            <input placeholder="Ресторан / Байршил" style={inputStyle} />

            <textarea
              placeholder="Урилгын текст"
              rows="5"
              style={inputStyle}
            />

            <select style={inputStyle}>
              <option>Монгол хэл</option>
              <option>Қазақша</option>
            </select>

            <select style={inputStyle}>
              <option>Цагаан сонгодог</option>
              <option>Монгол хээ</option>
              <option>Цэцгэн чимэг</option>
              <option>Modern 3D</option>
              <option>Казах той</option>
            </select>

            <button
              style={{
                border: "none",
                borderRadius: "14px",
                padding: "16px",
                fontSize: "18px",
                background: "#c97985",
                color: "white",
                cursor: "pointer",
              }}
            >
              Урилгаа харах
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "16px",
  marginTop: "6px",
};
