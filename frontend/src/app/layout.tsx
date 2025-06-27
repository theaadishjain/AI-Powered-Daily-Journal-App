import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DayNote - AI Journal",
  description: "An intelligent journal that analyzes your mood and summarizes your day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
