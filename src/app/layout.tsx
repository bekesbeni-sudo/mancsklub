import type { Metadata } from "next";
import { Caveat, Fraunces, Inter_Tight, Instrument_Sans, Montserrat } from "next/font/google";
import { t } from "@/messages";
import "./globals.css";

const display = Inter_Tight({ variable: "--nf-display", subsets: ["latin", "latin-ext"] });
const serif = Fraunces({ variable: "--nf-serif", subsets: ["latin", "latin-ext"], axes: ["SOFT", "opsz"] });
const hand = Caveat({ variable: "--nf-hand", subsets: ["latin", "latin-ext"] });
const body = Instrument_Sans({ variable: "--nf-body", subsets: ["latin", "latin-ext"] });
const mont = Montserrat({ variable: "--nf-mont", subsets: ["latin", "latin-ext"], weight: "800" });

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hu" data-scroll-behavior="smooth" className={`${display.variable} ${serif.variable} ${body.variable} ${hand.variable} ${mont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
