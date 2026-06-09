"use client";
import { CFG } from "../../lib/scoring";

export default function Rules() {
  const k = CFG;
  return (
    <>
      <h1>The Arcane Rulebook</h1>
      <p className="sub">Everything is computed automatically from final scores + each team's FIFA ranking. <strong>gap</strong> = your team's rank number minus its opponent's. A bigger positive gap = a bigger underdog = bigger rewards.</p>

      <h2>1 · Match points (every game)</h2>
      <table className="rules">
        <tbody>
          <tr><td className="n">+{k.RESULT.win}</td><td>Win</td><td className="note">base result</td></tr>
          <tr><td className="n">+{k.RESULT.draw}</td><td>Draw</td><td className="note">base result</td></tr>
          <tr><td className="n">0</td><td>Loss</td><td className="note">base result</td></tr>
        </tbody>
      </table>

      <h2>2 · Underdog bonuses (the good stuff)</h2>
      <table className="rules">
        <tbody>
          <tr><td className="n">+round(gap × {k.GIANT_KILLING_K})</td><td><strong>Giant-killing</strong></td><td className="note">your lower-ranked team WINS. Beat a team 40 places above you → +20.</td></tr>
          <tr><td className="n">+round(gap × {k.PLUCKY_DRAW_K})</td><td><strong>Backs-to-the-wall draw</strong></td><td className="note">underdog grabs a point.</td></tr>
          <tr><td className="n">+round(gap × {k.UPSET_GOAL_K}) <em>per goal</em></td><td><strong>Smash-and-grab</strong></td><td className="note">every goal an underdog scores against a stronger side, win or lose.</td></tr>
          <tr><td className="n">+round(gap × {k.CLEAN_SHEET_K})</td><td><strong>Park-the-bus</strong></td><td className="note">underdog keeps a clean sheet vs a stronger side.</td></tr>
          <tr><td className="n">−round(|gap| × {k.BOTTLEJOB_K})</td><td><strong>Bottle-job</strong></td><td className="note">a heavy favourite (≥{k.BOTTLEJOB_GAP} places stronger) LOSES. Ouch.</td></tr>
        </tbody>
      </table>
      <p className="note"><strong>Knockout multiplier:</strong> every bonus (and the bottle-job penalty) in this section <strong>doubles at each knockout round</strong> — Round of 32 ×{k.UPSET_STAGE_FACTOR.LAST_32}, Round of 16 ×{k.UPSET_STAGE_FACTOR.LAST_16}, Quarter-final ×{k.UPSET_STAGE_FACTOR.QUARTER_FINALS}, Semi-final ×{k.UPSET_STAGE_FACTOR.SEMI_FINALS}, Final ×{k.UPSET_STAGE_FACTOR.FINAL}. A shock in the final is worth 32× the same shock in the group stage. (Base win/draw points and the "going deep" points below are <em>not</em> affected.)</p>

      <h2>3 · Going deep — rewards weaker teams for going far</h2>
      <p className="note">Two parts. First, a <strong>base value</strong> for each round your team reaches — and these <strong>accrue</strong>, so you bank the points from every round it passes through. Second, every base is multiplied by a <strong>ranking factor = 1 + (world rank ÷ 10)</strong>: #1 → ×1.1, #10 → ×2, #20 → ×3, #40 → ×5. Realistically only top-40-ish teams go deep, so the giant multipliers for minnows rarely fire — but when one does, it's a jackpot.</p>
      <table className="rules">
        <tbody>
          <tr><th>Round reached</th><th>Base</th><th>× factor</th></tr>
          <tr><td>Round of 32</td><td className="n">{k.STAGE_BASE.LAST_32}</td><td>× (1 + rank/10)</td></tr>
          <tr><td>Round of 16</td><td className="n">{k.STAGE_BASE.LAST_16}</td><td>× (1 + rank/10)</td></tr>
          <tr><td>Quarter-final</td><td className="n">{k.STAGE_BASE.QUARTER_FINALS}</td><td>× (1 + rank/10)</td></tr>
          <tr><td>Semi-final</td><td className="n">{k.STAGE_BASE.SEMI_FINALS}</td><td>× (1 + rank/10)</td></tr>
          <tr><td>Reach the Final</td><td className="n">{k.STAGE_BASE.FINAL}</td><td>× (1 + rank/10)</td></tr>
          <tr><td><strong>Win the World Cup</strong> (on top of reaching the final)</td><td className="n">+{k.CHAMPION_BASE}</td><td>× (1 + rank/10)</td></tr>
          <tr><td>Win the 3rd-place playoff</td><td className="n">+{k.BRONZE}</td><td>flat, no factor</td></tr>
        </tbody>
      </table>
      <p className="note">Worked example — a <strong>#20</strong> team (factor ×3) reaching the quarter-final banks: R32 {k.STAGE_BASE.LAST_32}×3={k.STAGE_BASE.LAST_32*3} + R16 {k.STAGE_BASE.LAST_16}×3={k.STAGE_BASE.LAST_16*3} + QF {k.STAGE_BASE.QUARTER_FINALS}×3={k.STAGE_BASE.QUARTER_FINALS*3} = <strong>{(k.STAGE_BASE.LAST_32+k.STAGE_BASE.LAST_16+k.STAGE_BASE.QUARTER_FINALS)*3} points</strong>. The world #1 doing the same banks {Math.round((k.STAGE_BASE.LAST_32+k.STAGE_BASE.LAST_16+k.STAGE_BASE.QUARTER_FINALS)*1.1)}.</p>

      <h2>4 · Tournament-wide trophies (one-off)</h2>
      <table className="rules">
        <tbody>
          <tr><td className="n">+{k.GOAL_MACHINE}</td><td><strong>Goal Machine</strong> — your team scores the most goals of the whole tournament</td></tr>
          <tr><td className="n">+{k.IRON_CURTAIN}</td><td><strong>Iron Curtain</strong> — most clean sheets</td></tr>
          <tr><td className="n">+{k.GIANT_SLAYER}</td><td><strong>Giant-slayer streak</strong> — a team racks up 3+ giant-killings</td></tr>
          <tr><td className="n">+{k.PERFECT_GROUP}</td><td><strong>Perfect group</strong> — won all 3 group games</td></tr>
          <tr><td className="n">+{k.GROUP_OF_DEATH}</td><td><strong>Group of Death</strong> — advance from the single strongest group</td></tr>
        </tbody>
      </table>
      <p className="note">Ties on a trophy: everyone tied collects it.</p>

      <h2>5 · The money</h2>
      <p className="note">£20 buy-in each = a <strong>£120 pot</strong>, paid out by <strong>final finishing position</strong>:</p>
      <table className="rules">
        <tbody>
          <tr><th>Position</th><th>Payout</th><th></th></tr>
          <tr><td>1st</td><td className="n">£{k.LADDER[0]}</td><td className="note">+£30</td></tr>
          <tr><td>2nd</td><td className="n">£{k.LADDER[1]}</td><td className="note">+£15</td></tr>
          <tr><td>3rd</td><td className="n">£{k.LADDER[2]}</td><td className="note">break even</td></tr>
          <tr><td>4th</td><td className="n">£{k.LADDER[3]}</td><td className="note">−£10</td></tr>
          <tr><td>5th</td><td className="n">£{k.LADDER[4]}</td><td className="note">−£15</td></tr>
          <tr><td>6th</td><td className="n">£{k.LADDER[5]}</td><td className="note">−£20 (lose your stake)</td></tr>
        </tbody>
      </table>
      <p className="note">Top half profits, bottom half pays in. <strong>Ties</strong> pool the prize money for the positions they cover and split it evenly — e.g. two players tied for 2nd share (£35 + £20) ÷ 2 = £27.50 each. The Leaderboard shows the live projected payout at every stage.</p>

      <p className="foot">Want to tune any number? They all live in one place: <code>lib/scoring.js → CFG</code>. Change a value, redeploy, done.</p>
    </>
  );
}
