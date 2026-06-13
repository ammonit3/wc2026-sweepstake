"use client";
import { CFG } from "../../lib/scoring";
import { Football, Vuvuzela, KitParade } from "../Decor";

const r = Math.round;

export default function Rules() {
  const k = CFG;
  const F = k.UPSET_STAGE_FACTOR;

  // ---- worked-example maths, computed live from the config ----
  // A) Group-stage giant-killing: #85 beats #9 1–0. gap = 76, factor 1.
  const gapA = 76;
  const A = {
    win: k.RESULT.win,
    gk: r(gapA * k.GIANT_KILLING_K),
    grab: r(gapA * k.UPSET_GOAL_K) * 1,
    cs: r(gapA * k.CLEAN_SHEET_K),
  };
  A.total = A.win + A.gk + A.grab + A.cs;

  // B) Same shape of shock (#20 beats #4 1–0) in the QUARTER-FINAL. gap = 16.
  const gapB = 16, fB = F.QUARTER_FINALS;
  const groupVer = k.RESULT.win + r(gapB * k.GIANT_KILLING_K) + r(gapB * k.UPSET_GOAL_K) + r(gapB * k.CLEAN_SHEET_K);
  const koVer = k.RESULT.win + r(gapB * k.GIANT_KILLING_K) * fB + r(gapB * k.UPSET_GOAL_K) * fB + r(gapB * k.CLEAN_SHEET_K) * fB;

  // C) Going deep: #20 team (factor ×3) reaches the QF.
  const mult20 = 1 + 20 / 10;
  const deep20 = r(k.STAGE_BASE.LAST_32 * mult20) + r(k.STAGE_BASE.LAST_16 * mult20) + r(k.STAGE_BASE.QUARTER_FINALS * mult20);
  const deep1 = r((k.STAGE_BASE.LAST_32 + k.STAGE_BASE.LAST_16 + k.STAGE_BASE.QUARTER_FINALS) * 1.1);

  return (
    <>
      <h1>The <span className="u">Rulebook</span></h1>
      <p className="sub">Everything is worked out automatically from each game's final score plus the two teams' <strong>FIFA world rankings</strong>. You never tot anything up yourself.</p>

      <div className="callout">
        <b>The one idea behind everything →</b> the <b>gap</b>. For any match, <code>gap = your team's world rank − the opponent's rank</code>. If your team is ranked #60 and plays #6, your gap is <b>+54</b> — a big underdog. The bigger the underdog, the bigger the reward for doing well. Favourites get a small, flat return; underdogs get the fireworks.
      </div>

      <h2>1 · Match points</h2>
      <p className="note">Awarded for the result of every single game, group or knockout.</p>
      <table className="rules">
        <tbody>
          <tr><th>Result</th><th>Points</th></tr>
          <tr><td>Win</td><td className="n">+{k.RESULT.win}</td></tr>
          <tr><td>Draw</td><td className="n">+{k.RESULT.draw}</td></tr>
          <tr><td>Loss</td><td className="n">0</td></tr>
        </tbody>
      </table>

      <h2>2 · Underdog bonuses</h2>
      <p className="note">The good stuff. These only trigger when <strong>your team is the underdog</strong> (positive gap).</p>
      <table className="rules">
        <tbody>
          <tr><th>Bonus</th><th>What earns it</th><th>Points</th></tr>
          <tr><td><strong>Giant-killing</strong></td><td>your lower-ranked team <em>wins</em></td><td className="n">round(gap × {k.GIANT_KILLING_K})</td></tr>
          <tr><td><strong>Backs-to-the-wall</strong></td><td>underdog grabs a <em>draw</em></td><td className="n">round(gap × {k.PLUCKY_DRAW_K})</td></tr>
          <tr><td><strong>Smash-and-grab</strong></td><td><em>each goal</em> an underdog scores</td><td className="n">round(gap × {k.UPSET_GOAL_K}) ×&nbsp;goals</td></tr>
          <tr><td><strong>Park-the-bus</strong></td><td>underdog keeps a <em>clean sheet</em></td><td className="n">round(gap × {k.CLEAN_SHEET_K})</td></tr>
          <tr><td><strong>Bottle-job</strong> 💸</td><td>a big favourite (gap ≤ −{k.BOTTLEJOB_GAP}) <em>loses</em></td><td className="n">−round(|gap| × {k.BOTTLEJOB_K})</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <b>⚡ THE KNOCKOUT MULTIPLIER — the big one.</b> A shock in the final matters far more than one in a dead group game, so <b>every underdog bonus and the bottle-job penalty in Section 2 is multiplied at each knockout round:</b>
        <table className="rules" style={{ marginTop: 10 }}>
          <tbody>
            <tr><th>Stage</th><th>Group</th><th>R32</th><th>R16</th><th>QF</th><th>SF</th><th>Final</th></tr>
            <tr>
              <td className="n">multiplier</td>
              <td>×{F.GROUP_STAGE}</td><td>×{F.LAST_32}</td><td>×{F.LAST_16}</td>
              <td>×{F.QUARTER_FINALS}</td><td>×{F.SEMI_FINALS}</td><td>×{F.FINAL}</td>
            </tr>
          </tbody>
        </table>
        It <b>doubles every round</b> — a giant-killing in the final is worth <b>{F.FINAL}×</b> the same one in the group stage. (Match points in Section 1 and the "going deep" points below are <i>not</i> multiplied.)
      </div>

      <div className="example">
        <div className="eh">Worked example A — a group-stage shock</div>
        Minnow <code>#85</code> beats giant <code>#9</code> <b>1–0</b> in the group stage. Gap = <code>{gapA}</code>, multiplier ×1:
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          <li>Win: <b>+{A.win}</b></li>
          <li>Giant-killing: round({gapA} × {k.GIANT_KILLING_K}) = <b>+{A.gk}</b></li>
          <li>Smash-and-grab: round({gapA} × {k.UPSET_GOAL_K}) × 1 goal = <b>+{A.grab}</b></li>
          <li>Park-the-bus clean sheet: round({gapA} × {k.CLEAN_SHEET_K}) = <b>+{A.cs}</b></li>
        </ul>
        <div style={{ marginTop: 6 }}>Total to the owner: <b>+{A.total} points.</b></div>
      </div>

      <div className="example">
        <div className="eh">Worked example B — the same kind of shock, but in the quarter-final</div>
        A <code>#20</code> side beats a <code>#4</code> side <b>1–0</b> in the QF. Gap = <code>{gapB}</code>. In the <b>group stage</b> that would be worth <b>+{groupVer}</b>. But the QF multiplier is <b>×{fB}</b>, so the underdog bonuses balloon:
        <div style={{ marginTop: 6 }}>Win +{k.RESULT.win} &nbsp;+&nbsp; giant-killing {r(gapB * k.GIANT_KILLING_K)}×{fB} &nbsp;+&nbsp; smash-and-grab {r(gapB * k.UPSET_GOAL_K)}×{fB} &nbsp;+&nbsp; clean sheet {r(gapB * k.CLEAN_SHEET_K)}×{fB} = <b>+{koVer} points.</b></div>
        <div style={{ marginTop: 6 }}>Same result, <b>{Math.round(koVer / groupVer)}× the reward</b> for doing it on the big stage.</div>
      </div>

      <h2>3 · Going deep</h2>
      <p className="note">Reward for survival, tilted towards weaker teams. Two parts.</p>
      <p className="note"><strong>Part 1 — base points for each round reached</strong> (they <em>accrue</em>; you keep the points from every round your team passes through):</p>
      <table className="rules">
        <tbody>
          <tr><th>Round reached</th><th>Base</th></tr>
          <tr><td>Round of 32</td><td className="n">{k.STAGE_BASE.LAST_32}</td></tr>
          <tr><td>Round of 16</td><td className="n">{k.STAGE_BASE.LAST_16}</td></tr>
          <tr><td>Quarter-final</td><td className="n">{k.STAGE_BASE.QUARTER_FINALS}</td></tr>
          <tr><td>Semi-final</td><td className="n">{k.STAGE_BASE.SEMI_FINALS}</td></tr>
          <tr><td>Final</td><td className="n">{k.STAGE_BASE.FINAL}</td></tr>
          <tr><td><strong>Win the World Cup</strong> (on top of the final)</td><td className="n">+{k.CHAMPION_BASE}</td></tr>
          <tr><td>Win the 3rd-place playoff</td><td className="n">+{k.BRONZE}</td></tr>
        </tbody>
      </table>
      <p className="note"><strong>Part 2 — a ranking multiplier</strong> = <code>1 + (world rank ÷ 10)</code>. The weaker the team, the bigger it is: #1 → ×1.1, #10 → ×2, #20 → ×3, #40 → ×5. Each base above is multiplied by it.</p>
      <div className="example">
        <div className="eh">Worked example C — going deep rewards the underdog</div>
        A <code>#20</code> team (multiplier ×{mult20}) reaching the quarter-final banks: R32 {k.STAGE_BASE.LAST_32}×{mult20}={r(k.STAGE_BASE.LAST_32 * mult20)} + R16 {k.STAGE_BASE.LAST_16}×{mult20}={r(k.STAGE_BASE.LAST_16 * mult20)} + QF {k.STAGE_BASE.QUARTER_FINALS}×{mult20}={r(k.STAGE_BASE.QUARTER_FINALS * mult20)} = <b>{deep20} points</b>. The world <code>#1</code> doing exactly the same banks about <b>{deep1}</b>. Same run, far bigger reward for the long-shot.
      </div>

      <h2>4 · Trophies (one-offs)</h2>
      <table className="rules">
        <tbody>
          <tr><th>Trophy</th><th>Points</th></tr>
          <tr><td><strong>Goal Machine</strong> — your team scores the most goals of the tournament</td><td className="n">+{k.GOAL_MACHINE}</td></tr>
          <tr><td><strong>Iron Curtain</strong> — most clean sheets</td><td className="n">+{k.IRON_CURTAIN}</td></tr>
          <tr><td><strong>Giant-slayer streak</strong> — a team racks up 3+ giant-killings</td><td className="n">+{k.GIANT_SLAYER}</td></tr>
          <tr><td><strong>Perfect Group</strong> — won all 3 group games</td><td className="n">+{k.PERFECT_GROUP}</td></tr>
          <tr><td><strong>Group of Death</strong> — advanced from the single strongest group</td><td className="n">+{k.GROUP_OF_DEATH}</td></tr>
        </tbody>
      </table>
      <p className="note">Goal Machine and Iron Curtain are whole-tournament awards, settled at the <strong>final whistle of the final</strong> — so running totals only ever climb during the tournament. Ties on a trophy: everyone tied collects it.</p>

      <h2>5 · The money</h2>
      <p className="note">£20 each = a <strong>£120 pot</strong>, paid by <strong>final finishing position</strong>:</p>
      <table className="rules">
        <tbody>
          <tr><th>Position</th><th>Payout</th><th>Net (−£20 stake)</th></tr>
          <tr><td>1st</td><td className="n">£{k.LADDER[0]}</td><td>+£{k.LADDER[0] - 20}</td></tr>
          <tr><td>2nd</td><td className="n">£{k.LADDER[1]}</td><td>+£{k.LADDER[1] - 20}</td></tr>
          <tr><td>3rd</td><td className="n">£{k.LADDER[2]}</td><td>break even</td></tr>
          <tr><td>4th</td><td className="n">£{k.LADDER[3]}</td><td>−£{20 - k.LADDER[3]}</td></tr>
          <tr><td>5th</td><td className="n">£{k.LADDER[4]}</td><td>−£{20 - k.LADDER[4]}</td></tr>
          <tr><td>6th</td><td className="n">£{k.LADDER[5]}</td><td>−£20</td></tr>
        </tbody>
      </table>
      <p className="note">Top half profits, bottom half pays in. <strong>Ties</strong> pool the money for the positions they cover and split it evenly (two tied for 2nd → (£{k.LADDER[1]} + £{k.LADDER[2]}) ÷ 2 = £{((k.LADDER[1] + k.LADDER[2]) / 2).toFixed(2)} each).</p>

      <div className="foot">
        <div className="foot-decor"><Vuvuzela size={44} /><KitParade /><Football size={28} /></div>
        <div>Every number above lives in one file (<code>lib/scoring.js → CFG</code>) — change it, redeploy, and this page updates with it.</div>
      </div>
    </>
  );
}
