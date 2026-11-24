import type { Metadata } from "next";
import "./globals.css";
import BackToTop from "../components/BackToTop";

export const metadata: Metadata = {
  title: "Sylvester Ujong Diabetes Foundation",
  description:
    "Awareness, prevention, education and community support for healthier lives.",
  icons: {
    icon: "/sudf-emblem.svg",
    shortcut: "/sudf-emblem.svg",
    apple: "/sudf-emblem.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<BackToTop /></body>
    </html>
  );
}