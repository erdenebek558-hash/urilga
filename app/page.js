export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fffaf7",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div>
        <div style={{ fontSize: "48px" }}>💍</div>

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "12px",
          }}
        >
          Урилга
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#666",
            marginBottom: "28px",
          }}
        >
          Хуримын онлайн урилгаа бүтээ
        </p>

        <button
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "14px 28px",
            fontSize: "18px",
            cursor: "pointer",
            background: "#111",
            color: "#fff",
          }}
        >
          Урилга бүтээх
        </button>
      </div>
    </main>
  );
}
