"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/", "Leaderboard"],
  ["/players", "Players"],
  ["/fixtures", "Fixtures"],
  ["/rules", "Rules"],
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand">⚽ WC26 <span>Sweepstake</span></div>
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} className={path === href ? "active" : ""}>{label}</Link>
        ))}
      </div>
    </nav>
  );
}
