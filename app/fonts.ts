import { Instrument_Serif, Inter, Space_Mono } from "next/font/google";

export const displaySerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

export const grotesk = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});

export const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
});

export const fontVariables = `${displaySerif.variable} ${grotesk.variable} ${mono.variable}`;
