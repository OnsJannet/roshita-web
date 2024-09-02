import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({ 
  subsets: ["latin"], 
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--poppins-tajawal",
});


export const metadata: Metadata = {
  title: "روشــــــــيتــــــا",
  description: "صحــة أفضل تواصـــــل أســـرع",
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={tajawal.className}>{children}</body>
    </html>
  );
}
