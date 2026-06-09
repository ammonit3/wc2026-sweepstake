"use client";
import { useScoring } from "../lib/useScoring";

const gbp = (n) => "£" + n.toFixed(2);

export default function Leaderboard() {
  const { loading, result, source, note } = useScoring();
  if (loading) return <p className="sub" style={{ marginTop: 40 }}>Loading the carnage…</p>;
  if (!result) return <p className="sub" style={{ marginTop: 40 }}>{note || "No data."}</p>;

  const { players, total, finishedCount, groupOfDeath } = result;
  const max = Math.max(1, ...players.map((p) => p.points));
  const live = source && source !== "seed";

  return (
    <>
      <h1>The Standings</h1>
      <p className="sub">
        {live ? <span className="tag live">● LIVE · {source}</span> : <span className="tag">Fixtures only — connect the API key for live scores</span>}{" "}
        <span className="tag">{finishedCount} matches scored</span>{" "}
        <span className="tag">Group of Death: {groupOfDeath}</span>
      </p>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="pot">
          <div><div className="muted" style={{ fontSize: 12 }}>POT</div><div className="big">£120.00</div></div>
          <div className="note">Paid by <strong>final position</strong>: £50 / £35 / £20 / £10 / £5 / £0. Projection below updates live as results land.</div>
        </div>
      </div>

      <h2>Live payout projection</h2>
      {players.map((p, i) => (
        <div key={p.name} className={`lb-row ${i === 0 ? "top" : ""} ${p.name === "Alex" ? "me" : ""}`}>
          <div className="pos">{i + 1}</div>
          <div>
            <div className="lb-name">{p.name} {i === 0 && total > 0 ? "👑" : ""}</div>
            <div className="lb-teams">{p.teams.slice(0, 4).map((t) => t.name).join(" · ")} +4</div>
            <div className="bar"><i style={{ width: `${(p.points / max) * 100}%` }} /></div>
          </div>
          <div className="lb-pts">{p.points}<small> pts</small></div>
          <div className="lb-pay">
            <div className="gbp">{gbp(p.payout)}</div>
            <div className="pct">{p.share.toFixed(1)}%</div>
          </div>
        </div>
      ))}

      {total === 0 && <p className="note" style={{ marginTop: 14 }}>No finished matches yet — everyone's tied, so the pot shows an even £20 split until the first results land. Kickoff: 11 June.</p>}
      {note && <p className="note" style={{ marginTop: 10 }}>{note}</p>}

      <p className="foot">Tiered snake draft · FIFA ranks as of 10 Jun 2026 · refreshes every 60s</p>
    </>
  );
}
