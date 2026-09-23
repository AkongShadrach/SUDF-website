import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sylvester Ujong Diabetes Foundation",
  description:
    "Awareness, prevention, education and community support for healthier lives.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}