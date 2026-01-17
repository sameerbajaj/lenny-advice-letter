import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Time Capsule | Advice from Product Leaders",
  description: "Get a personalized letter from product leaders who were in your exact situation. Based on 269 episodes of Lenny's Podcast.",
  openGraph: {
    title: "Time Capsule | Advice from Product Leaders",
    description: "Get a personalized letter from product leaders who were in your exact situation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Capsule | Advice from Product Leaders",
    description: "Get a personalized letter from product leaders who were in your exact situation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
