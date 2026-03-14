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
  title: "Amity University Online – Admissions Open",
  description:
    "Apply for online MBA, MCA, BBA and more at Amity University. Limited seats – admission closes March 25.",

  openGraph: {
    title: "Amity University Online – Admissions Open",
    description:
      "Apply for online MBA, MCA, BBA and more. Limited seats – admission closes March 25.",
    url: "https://yourdomain.com",
    siteName: "Amity Online",
    images: [
      {
        url: "/banner.png", // banner image in public folder
        width: 1200,
        height: 630,
        alt: "Amity University Online Admission",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Amity University Online – Admissions Open",
    description:
      "Apply for online MBA, MCA, BBA and more at Amity University.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}