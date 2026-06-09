import "./globals.css";
import Nav from "./Nav";
import { Football } from "./Decor";

export const metadata = {
  title: "WC2026 Sweepstake — It's Mathematically Possible!",
  description: "Six players, 48 teams, one absurdly over-engineered World Cup sweepstake. It's Mathematically Possible!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="header-band" />
        <Nav />
        <div className="tagline-bar">
          <Football size={16} />
          <span className="tagline">It&apos;s Mathematically Possible!</span>
          <Football size={16} />
        </div>
        <div className="wrap">{children}</div>
      </body>
    </html>
  );
}
