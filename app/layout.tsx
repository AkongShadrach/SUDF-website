import type { Metadata } from "next";
import "./globals.css";
import BackToTop from "../components/BackToTop";

export const metadata: Metadata = {
  title: "Sylvester Ujong Diabetes Foundation",
  description:
    "Awareness, prevention, education and community support for healthier lives.",
  icons: {
    icon: "/sudf-favicon.png",
    shortcut: "/sudf-favicon.png",
    apple: "/sudf-favicon.png",
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