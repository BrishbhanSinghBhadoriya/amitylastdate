import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  openGraph: {
    url: "https://amitylastdate.vercel.app",
    type: "website",
    images: [
      {
        url: "https://amitylastdate.vercel.app/banner.png",
        width: 1200,
        height: 630,
        alt: "Amity Admission",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    images: ["https://amitylastdate.vercel.app/banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}