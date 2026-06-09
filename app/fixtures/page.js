"use client";
import { useScoring } from "../../lib/useScoring";
import { TEAMS } from "../../lib/data";
import { canon, prettyStage, explainMatch, matchSummary } from "../../lib/scoring";

const STAGE_ORDER = ["GROUP_STAGE", "LAST_32", "LAST_16", "QUARTER_FINALS", "SEMI_FINALS", "THIRD_PLACE", "FINAL"];
const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function owner(name) {
  const t = TEAMS[canon(name)];
  return t ? t.owner : null;
}

function SideBreakdown({ side }) {
  return (
    <div className="tip-side">
      <div className="tip-team">
        <span>{side.name} <span className="muted">#{side.rank} · {side.owner}</span></span>
        <span className={side.total >= 0 ? "pos" : "neg"}>{side.total >= 0 ? "+" : ""}{side.total} pts</span>
      </div>
      {side.events.map((e, i) => (
        <div className="tip-row" key={i}>
          <span className="tip-lbl">{e.label}</span>
          <span className="tip-calc">{e.formula}</span>
          <span className={e.p >= 0 ? "pos" : "neg"}>{e.p >= 0 ? "+" : ""}{e.p}</span>
        </div>
      ))}
    </div>
  );
}

function Score({ m, done, live }) {
  const ex = done ? explainMatch(m) : null;
  const sum = done ? matchSummary(m) : null;
  return (
    <div className={`scorewrap ${done || live ? "" : "sched"}`} tabIndex={ex ? 0 : -1}>
      <div className={`score ${done || live ? "" : "sched"}`}>
        {done || live ? `${m.homeGoals ?? 0}–${m.awayGoals ?? 0}` : fmt(m.utcDate)}
        {live && <div className="upset">● LIVE</div>}
      </div>
      {ex && (
        <div className="tip" role="tooltip">
          {sum && (
            <div className="tip-summary">
              <span className="em">{sum.emoji}</span>
              <span><span className="sh">{sum.headline}</span><span className="fl"> {sum.flavour}</span></span>
            </div>
          )}
          <div className="tip-h">How the points broke down · {prettyStage(ex.stage)}{ex.factor > 1 ? ` · upset bonuses ×${ex.factor}` : ""}</div>
          <SideBreakdown side={ex.home} />
          <SideBreakdown side={ex.away} />
          <div className="tip-foot">Plus per-team “going deep” &amp; trophy points — see the Players page.</div>
        </div>
      )}
    </div>
  );
}

export default function Fixtures() {
  const { loading, matches } = useScoring();
  if (loading) return <p className="sub" style={{ marginTop: 40 }}>Loading fixtures…</p>;

  const byStage = {};
  for (const m of matches) (byStage[m.stage] = byStage[m.stage] || []).push(m);
  const stages = STAGE_ORDER.filter((s) => byStage[s]);

  return (
    <>
      <h1>Fixtures & Results</h1>
      <p className="sub">Owner tags show who profits. ⚡ marks a shock result. <strong>Hover (or tap) a score</strong> to see exactly how its points were calculated.</p>

      {stages.map((s) => (
        <div key={s}>
          <h2>{prettyStage(s)}</h2>
          {byStage[s].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate)).map((m) => {
            const done = m.status === "FINISHED" && m.homeGoals != null;
            const live = m.status === "IN_PLAY";
            const hr = TEAMS[canon(m.home)]?.rank, ar = TEAMS[canon(m.away)]?.rank;
            let upset = false;
            if (done && hr && ar) {
              if (m.homeGoals > m.awayGoals && hr > ar) upset = true;
              if (m.awayGoals > m.homeGoals && ar > hr) upset = true;
              if (m.homeGoals === m.awayGoals && Math.abs(hr - ar) >= 20) upset = true;
            }
            return (
              <div className="fx" key={m.id}>
                <div className="h">
                  <div>{m.home} {hr ? <span className="pill">#{hr}</span> : null}</div>
                  {owner(m.home) && <div className="own">{owner(m.home)}</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Score m={m} done={done} live={live} />
                  {upset && <div className="upset">⚡ UPSET</div>}
                </div>
                <div className="a">
                  <div>{m.away} {ar ? <span className="pill">#{ar}</span> : null}</div>
                  {owner(m.away) && <div className="own">{owner(m.away)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <p className="foot">{matches.length} matches. Knockout fixtures appear once the live feed publishes them.</p>
    </>
  );
}
