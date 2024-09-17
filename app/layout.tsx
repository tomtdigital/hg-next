import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { lusitana } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lusitana.className}  antialiased`}>{children}</body>
    </html>
  );
}
