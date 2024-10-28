import type { Metadata } from "next";

import Header from "@components/UCOL/ui/Header/Header";

import "./globals.css";

export const metadata: Metadata = {
  title: "UCOL | Titulaciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Header />
        <section className="ucolMainContainer">
          {children}
        </section>
      </body>
    </html>
  );
}
