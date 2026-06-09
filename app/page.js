"use client";
import { useScoring } from "../lib/useScoring";
import { canon, matchSummary } from "../lib/scoring";
import { Football, Vuvuzela, KitParade } from "./Decor";

const gbp = (n) => "£" + n.toFixed(2);
const finished = (m) => m.status === "FINISHED" && m.homeGoals != null;

export default function Leaderboard() {
  const { loading, result, matches, source, note } = useScoring();
  if (loading) return <p className="sub" style={{ marginTop: 40 }}>Loading the carnage…</p>;
  if (!result) return <p className="sub" style={{ marginTop: 40 }}>{note || "No data."}</p>;

  const { players, total, finishedCount, groupOfDeath } = result;
  const maxPts = Math.max(1, ...players.map((p) => p.points));
  const live = source && source !== "seed";

  // team alive/out status (only once knockouts have started)
  const ko = matches.filter((m) => m.stage !== "GROUP_STAGE");
  const anyKO = ko.length > 0;
  const inKO = new Set(); ko.forEach((m) => { inKO.add(canon(m.home)); inKO.add(canon(m.away)); });
  const lostKO = new Set();
  ko.filter(finished).forEach((m) => {
    const h = canon(m.home), a = canon(m.away);
    if (m.homeGoals !== m.awayGoals) lostKO.add(m.homeGoals > m.awayGoals ? a : h);
  });
  const teamStatus = (n) => !anyKO ? "" : (lostKO.has(n) || !inKO.has(n)) ? "out" : "alive";

  // latest results feed
  const latest = matches.filter(finished)
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 8)
    .map((m) => matchSummary(m))
    .filter(Boolean);

  return (
    <>
      <h1>The <span className="u">Standings</span></h1>
      <p className="sub">
        {live ? <span className="tag live">● Live · {source}</span> : <span className="tag">Fixtures only — add the API key for live scores</span>}{" "}
        <span className="tag">{finishedCount} games scored</span>{" "}
        <span className="tag">Group of Death: {groupOfDeath}</span>
      </p>

      <div className="card" style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div className="pot">
          <div><div className="note" style={{ fontWeight: 800 }}>THE POT</div><div className="big">£120</div></div>
          <div className="note">Paid by finish: <strong>£50 / £35 / £20 / £10 / £5 / £0</strong>. Break-even at 3rd. Projection updates live.</div>
        </div>
        <Vuvuzela size={84} />
      </div>

      <h2>Live Table</h2>
      {players.map((p, i) => (
        <div key={p.name} className={`lb-row ${i === 0 ? "top" : ""} ${p.name === "Alex" ? "me" : ""}`}>
          <div className="pos">{i + 1}</div>
          <div>
            <div className="lb-name">{p.name} {i === 0 && total > 0 ? "👑" : ""}</div>
            <div className="lb-teams">
              {p.teams.map((t) => (
                <span key={t.name} className={`chip ${teamStatus(t.name)}`} title={`#${t.rank} · ${t.pts} pts`}>{t.name}</span>
              ))}
            </div>
          </div>
          <div className="lb-pts">{p.points}<small>PTS</small></div>
          <div className="lb-pay"><div className="gbp">{gbp(p.payout)}</div><div className="pct">{p.share.toFixed(0)}%</div></div>
        </div>
      ))}
      {anyKO && <p className="note" style={{ marginTop: 8 }}><span className="chip alive" style={{ padding: "0 6px" }}>green</span> = still in · <span className="chip out" style={{ padding: "0 6px" }}>grey</span> = knocked out</p>}

      <h2>Latest Results</h2>
      {latest.length === 0 && <p className="note">No games played yet — kick-off is 11 June. Until then everyone's tied on an even £20.</p>}
      {latest.map((s, i) => (
        <div key={i} className={`result ${s.upset ? "up" : ""}`}>
          <div className="emoji">{s.emoji}</div>
          <div>
            <div className="rscore">{s.home} {s.homeGoals}–{s.awayGoals} {s.away} <span className="pill">{s.stageName}</span></div>
            <div className="rhead">{s.headline}</div>
            <div className="rflav">{s.flavour}</div>
            <div className="rpts">Match points → {s.homeOwner} {s.homePts >= 0 ? "+" : ""}{s.homePts} · {s.awayOwner} {s.awayPts >= 0 ? "+" : ""}{s.awayPts}</div>
          </div>
        </div>
      ))}

      {note && <p className="note" style={{ marginTop: 12 }}>{note}</p>}
      <div className="foot">
        <div className="foot-decor"><Football size={30} /><KitParade /><Football size={30} /></div>
        <div>Tiered snake draft · FIFA world ranks (10 Jun 2026) · refreshes every 60s</div>
      </div>
    </>
  );
}
