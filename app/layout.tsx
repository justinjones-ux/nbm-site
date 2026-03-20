import "./globals.css";

export const metadata = {
  title: "NBM — Performance Marketing",
  description: "We run performance campaigns and build the pages they land on. For businesses that already have demand — and want more of it converting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}