"use client";
import { useScoring } from "../../lib/useScoring";

export default function Players() {
  const { loading, result } = useScoring();
  if (loading || !result) return <p className="sub" style={{ marginTop: 40 }}>Loading squads…</p>;
  const { players } = result;

  return (
    <>
      <h1>Players & Squads</h1>
      <p className="sub">8 teams each, drawn via tiered snake draft. Tap a team to see exactly where its points came from.</p>

      {players.map((p) => (
        <div key={p.name} style={{ marginTop: 22 }}>
          <h2 style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span>{p.name}</span>
            <span className="tag acc">{p.points} pts · £{p.payout.toFixed(2)}</span>
          </h2>
          {p.teams.map((t) => (
            <details key={t.name}>
              <summary>
                <span>{t.name} <span className="pill">#{t.rank} · Grp {t.group}</span></span>
                <span className="tp">{t.pts} pts</span>
              </summary>
              <div style={{ paddingBottom: 10 }}>
                {t.events.length === 0 && <div className="note" style={{ padding: "8px 0" }}>No points yet — hasn't played, or no bonuses triggered.</div>}
                {t.events.map((e, i) => (
                  <div className="evt" key={i}>
                    <span>{e.label}{e.vs ? <span className="muted"> · vs {e.vs}</span> : null}</span>
                    <span className={`p ${e.p >= 0 ? "pos" : "neg"}`}>{e.p >= 0 ? "+" : ""}{e.p}</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      ))}
      <p className="foot">Underdog bonuses scale with the FIFA-rank gap. The lowlier the team, the juicier the upset.</p>
    </>
  );
}
