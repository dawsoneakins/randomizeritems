// app/layout.tsx
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import BackgroundParticles from "./components/BackgroundParticles";

export const metadata = {
  title: "Random Item Picker",
  description: "Pick something at random for fun!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className="relative z-0 min-h-screen overflow-x-hidden">
        <BackgroundParticles />
        <div className="relative z-10">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
