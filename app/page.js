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
          <h1 style={{ fontSize: 48, marginBottom: 10 }}>Урилга</h1>
          <p style={{ fontSize: 20, color: "#777" }}>
            Хуримын онлайн урилгаа өөрөө бүтээ
          </p>

          <button onClick={() => setStep("form")} style={blackButton}>
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
          <h1 style={{ textAlign: "center" }}>Урилгын мэдээлэл</h1>

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

          <div
            style={{
              width: 70,
              height: 1,
              background: "#b99b6b",
              margin: "25px auto",
            }}
          />

          <h1 style={{ fontSize: 52, color: "#6c5135" }}>{names}</h1>

          <p style={{ fontSize: 18, lineHeight: 1.8, margin: "35px auto" }}>
            Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
          </p>

          <h2>{date}</h2>
          <p>{time}</p>
          <h3>{venue}</h3>

          <p style={{ maxWidth: 500, margin: "30px auto", lineHeight: 1.8 }}>
            {message}
          </p>

          <button onClick={() => setStep("form")} style={goldButton}>
            ← Засах
          </button>
        </div>
      </main>
    );
  }

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
          <h1 style={{ fontSize: 48, marginBottom: 10 }}>Урилга</h1>
          <p style={{ fontSize: 20, color: "#777" }}>
            Хуримын онлайн урилгаа өөрөө бүтээ
          </p>

          <button onClick={() => setStep("form")} style={blackButton}>
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
          <h1 style={{ textAlign: "center" }}>Урилгын мэдээлэл</h1>

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

          <div
            style={{
              width: 70,
              height: 1,
              background: "#b99b6b",
              margin: "25px auto",
            }}
          />

          <h1 style={{ fontSize: 52, color: "#6c5135" }}>{names}</h1>

          <p style={{ fontSize: 18, lineHeight: 1.8, margin: "35px auto" }}>
            Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
          </p>

          <h2>{date}</h2>
          <p>{time}</p>
          <h3>{venue}</h3>

          <p style={{ maxWidth: 500, margin: "30px auto", lineHeight: 1.8 }}>
            {message}
          </p>

          <button onClick={() => setStep("form")} style={goldButton}>
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
          padding: "40px 20px",
          background:
            "linear-gradient(135deg,#fff2f5,#fffaf7,#f7eef1)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#fff",
            padding: "45px",
            borderRadius: 30,
            border: "2px solid #efc2ce",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={flowerTop}>🌸 🌿 🌷 🌿 🌸</div>

          <p style={{ color: "#bf6f86", letterSpacing: 2 }}>
            ХАЙРЫН БАЯР
          </p>

          <h1
            style={{
              fontSize: 54,
              color: "#a95370",
              fontStyle: "italic",
            }}
          >
            {names}
          </h1>

          <div style={flowerLine}>❀ ❀ ❀</div>

          <p style={{ fontSize: 18, lineHeight: 1.8 }}>
            Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
          </p>

          <div
            style={{
              margin: "30px auto",
              padding: 25,
              maxWidth: 420,
              background: "#fff7f9",
              borderRadius: 22,
            }}
          >
            <h2>{date}</h2>
            <p>{time}</p>
            <h3>{venue}</h3>
          </div>

          <p style={{ maxWidth: 520, margin: "30px auto", lineHeight: 1.8 }}>
            {message}
          </p>

          <div style={flowerBottom}>🌷 🌿 🌸 🌿 🌷</div>

          <button onClick={() => setStep("form")} style={pinkButton}>
            ← Засах
          </button>
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
            "linear-gradient(135deg,#ccecff,#e6dcff,#ffe2ec)",
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
              "0 30px 80px rgba(85,91,170,0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
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

            <h1
              style={{
                fontSize: 58,
                margin: "20px 0",
                background:
                  "linear-gradient(90deg,#555bc0,#9b5faf,#d36f8e)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {names}
            </h1>

            <p style={{ fontSize: 19 }}>
              Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
            </p>

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

            <p
              style={{
                maxWidth: 520,
                margin: "35px auto",
                lineHeight: 1.8,
                color: "#4d536b",
              }}
            >
              {message}
            </p>

            <button
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
            padding: "28px",
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

            <h1
              style={{
                fontSize: 54,
                color: "#8d2019",
                margin: "25px 0",
              }}
            >
              {names}
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.8 }}>
              Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
            </p>

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

            <p style={{ maxWidth: 520, margin: "30px auto", lineHeight: 1.8 }}>
              {message}
            </p>

            <button onClick={() => setStep("form")} style={redGoldButton}>
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
          padding: 25,
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

          <p style={{ maxWidth: 520, margin: "30px auto", lineHeight: 1.8 }}>
            {message}
          </p>

          <button onClick={() => setStep("form")} style={blueGoldButton}>
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

const flowerTop = {
  fontSize: 28,
  marginBottom: 24,
};

const flowerBottom = {
  fontSize: 28,
  marginTop: 28,
};

const flowerLine = {
  color: "#d68aa0",
  fontSize: 22,
  margin: "20px 0",
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

  if (form.template === "Modern 3D") {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "45px 20px",
          background:
            "linear-gradient(135deg,#ccecff,#e6dcff,#ffe2ec)",
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
              "0 30px 80px rgba(85,91,170,0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
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

            <h1
              style={{
                fontSize: 58,
                margin: "20px 0",
                background:
                  "linear-gradient(90deg,#555bc0,#9b5faf,#d36f8e)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {names}
            </h1>

            <p style={{ fontSize: 19 }}>
              Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
            </p>

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

            <p
              style={{
                maxWidth: 520,
                margin: "35px auto",
                lineHeight: 1.8,
                color: "#4d536b",
              }}
            >
              {message}
            </p>

            <button
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
            padding: "28px",
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

            <h1
              style={{
                fontSize: 54,
                color: "#8d2019",
                margin: "25px 0",
              }}
            >
              {names}
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.8 }}>
              Бидний хуримын баярт хүрэлцэн ирэхийг урьж байна.
            </p>

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

            <p style={{ maxWidth: 520, margin: "30px auto", lineHeight: 1.8 }}>
              {message}
            </p>

            <button onClick={() => setStep("form")} style={redGoldButton}>
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
          padding: 25,
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

          <p style={{ maxWidth: 520, margin: "30px auto", lineHeight: 1.8 }}>
            {message}
          </p>

          <button onClick={() => setStep("form")} style={blueGoldButton}>
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

const flowerTop = {
  fontSize: 28,
  marginBottom: 24,
};

const flowerBottom = {
  fontSize: 28,
  marginTop: 28,
};

const flowerLine = {
  color: "#d68aa0",
  fontSize: 22,
  margin: "20px 0",
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
