export const metadata = {
  title: "Урилга",
  description: "Онлайн хуримын урилга",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
