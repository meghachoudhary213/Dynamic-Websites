import { Space_Grotesk, Cormorant_Garamond, Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"]
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-royal-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"]
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata = {
  title: "Jabalpur SmartEngine - MERN Multi-Business website operating system",
  description: "Futuristic dynamic website engine generator celebrating Jabalpur city.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${cormorant.variable} ${montserrat.variable} ${poppins.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
