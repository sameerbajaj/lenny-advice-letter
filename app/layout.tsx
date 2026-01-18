import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  title: "Lenny's Time Capsule | Advice from Product Leaders",
  description: "Get a personalized letter from leaders featured on Lenny's Podcast who were in your exact situation. Wisdom from Brian Chesky, Julie Zhuo, Shreyas Doshi, and 265+ more.",
  icons: {
    icon: [
      { url: "/tools/timecapsule/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/tools/timecapsule/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/tools/timecapsule/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/tools/timecapsule/icons/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/tools/timecapsule/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/tools/timecapsule/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/tools/timecapsule/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/tools/timecapsule/icons/favicon.ico",
  },
  openGraph: {
    title: "Lenny's Time Capsule | Advice from Product Leaders",
    description: "Get a personalized letter from leaders featured on Lenny's Podcast who were in your exact situation.",
    type: "website",
    images: [
      {
        url: "/tools/timecapsule/icons/og-icon.png",
        width: 1200,
        height: 1200,
        alt: "Lenny's Time Capsule - A golden envelope with wax seal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lenny's Time Capsule",
    description: "Get a personalized letter from leaders featured on Lenny's Podcast who were in your exact situation.",
    images: ["/tools/timecapsule/icons/og-icon.png"],
  },
  manifest: "/tools/timecapsule/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}

