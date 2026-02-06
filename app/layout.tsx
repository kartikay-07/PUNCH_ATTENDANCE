import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "macOS Attendance System",
  description: "A beautiful macOS-style attendance management system",
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
