// app/layout.tsx
export const metadata = {
  title: "Nex-a Agent",
  description: "AI agent API for Nex-a ops",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui" }}>
        {children}
      </body>
    </html>
  );
}
