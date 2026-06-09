import "./globals.css";
import Nav from "./Nav";

export const metadata = {
  title: "WC2026 Arcane Sweepstake",
  description: "Six players, 48 teams, one absurdly over-engineered World Cup sweepstake.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <div className="wrap">{children}</div>
      </body>
    </html>
  );
}
