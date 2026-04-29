import {
  Albert_Sans,
  DM_Serif_Display,
  JetBrains_Mono,
} from "next/font/google";

export const fontDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ax-font-display-loaded",
});

export const fontSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--ax-font-sans-loaded",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--ax-font-mono-loaded",
});
