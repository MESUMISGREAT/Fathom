/**
 * Friction: static vs limiting. Newton's third law pairs.
 * Top left: F ≤ μR (static). Top right: F = μR (limiting).
 * Bottom: Newton's third law pairs - book on table, student pushing wall.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'forces-equilibrium-friction-third-law';

const W = 660;
const H = 480;

export function ForcesEquilibriumFrictionThirdLaw() {
  // ORDINARY EQUILIBRIUM constants
  const BX1 = 115;
  const BY1 = 100;
  const BW = 80;
  const BH = 50;

  // LIMITING EQUILIBRIUM constants
  const BX2 = 445;
  const BY2 = 100;

  return (
    <Svg width={W} height={H}>
      <Label x={330} y={30} className="dg-text dg-bold">
        Friction: ordinary and limiting equilibrium; Newton's third-law pairs
      </Label>

      {/* ORDINARY EQUILIBRIUM - top left */}
      <Label x={165} y={70} className="dg-text dg-bold dg-accent">
        Ordinary equilibrium: F {'<'} μR
      </Label>

      {/* Block on rough surface */}
      <rect x={BX1} y={BY1} width={BW} height={BH} rx={4} className="dg-fill-accent dg-thin" />
      <Label x={BX1 + BW / 2} y={BY1 + BH / 2} className="dg-text-small dg-bold">block</Label>

      {/* Surface */}
      <line x1={BX1 - 30} y1={BY1 + BH} x2={BX1 + BW + 30} y2={BY1 + BH} className="dg-line" strokeWidth={3} />
      <Label x={BX1 + BW / 2} y={BY1 + BH + 20} className="dg-text-small dg-text-muted">rough floor</Label>

      {/* Weight mg */}
      <Arrow x1={BX1 + BW / 2} y1={BY1 + BH} x2={BX1 + BW / 2} y2={BY1 + BH + 45} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={BX1 + BW / 2 - 25} y={BY1 + BH + 25} tex="mg" w={30} h={32} anchor="end" />
      <Label x={BX1 + BW / 2 - 35} y={BY1 + BH + 25} className="dg-text-small dg-text-muted">weight</Label>

      {/* Normal reaction R */}
      <Arrow x1={BX1 + BW / 2} y1={BY1} x2={BX1 + BW / 2} y2={BY1 - 45} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={BX1 + BW / 2 - 25} y={BY1 - 30} tex="R = mg" w={50} h={32} anchor="end" tone="accent" />

      {/* Applied force P to the right (small) */}
      <Arrow x1={BX1 + BW} y1={BY1 + BH / 2} x2={BX1 + BW + 50} y2={BY1 + BH / 2} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={BX1 + BW + 30} y={BY1 + BH / 2 - 18} tex="P" w={30} h={32} anchor="start" tone="accent-2" />
      <Label x={BX1 + BW + 30} y={BY1 + BH / 2 - 18} className="dg-text-small dg-text-muted">push</Label>

      {/* Friction F to the left (balances P) */}
      <Arrow x1={BX1} y1={BY1 + BH / 2} x2={BX1 - 50} y2={BY1 + BH / 2} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={BX1 - 55} y={BY1 + BH / 2 - 18} tex="F" w={30} h={32} anchor="end" tone="accent" />
      <Label x={BX1 - 65} y={BY1 + BH / 2 - 18} className="dg-text-small dg-text-muted">friction</Label>

      {/* Equation */}
      <MathLabel x={165} y={BY1 + BH + 70} tex="F = P < \mu R" w={100} h={32} tone="muted" />
      <Label x={165} y={BY1 + BH + 95} className="dg-text-small dg-text-muted">
        Friction adjusts to balance P, up to its limit μR
      </Label>

      {/* LIMITING EQUILIBRIUM - top right */}
      <Label x={495} y={70} className="dg-text dg-bold dg-accent-2">
        Limiting equilibrium: F = μR
      </Label>

      {/* Block on rough surface */}
      <rect x={BX2} y={BY2} width={BW} height={BH} rx={4} className="dg-fill-accent-2 dg-thin" />
      <Label x={BX2 + BW / 2} y={BY2 + BH / 2} className="dg-text-small dg-bold">block</Label>

      {/* Surface */}
      <line x1={BX2 - 30} y1={BY2 + BH} x2={BX2 + BW + 30} y2={BY2 + BH} className="dg-line" strokeWidth={3} />
      <Label x={BX2 + BW / 2} y={BY2 + BH + 20} className="dg-text-small dg-text-muted">rough floor</Label>

      {/* Weight mg */}
      <Arrow x1={BX2 + BW / 2} y1={BY2 + BH} x2={BX2 + BW / 2} y2={BY2 + BH + 45} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={BX2 + BW / 2 - 25} y={BY2 + BH + 25} tex="mg" w={30} h={32} anchor="end" />

      {/* Normal reaction R */}
      <Arrow x1={BX2 + BW / 2} y1={BY2} x2={BX2 + BW / 2} y2={BY2 - 45} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={BX2 + BW / 2 - 25} y={BY2 - 30} tex="R = mg" w={50} h={32} anchor="end" tone="accent-2" />

      {/* Applied force P to the right (maximum) */}
      <Arrow x1={BX2 + BW} y1={BY2 + BH / 2} x2={BX2 + BW + 60} y2={BY2 + BH / 2} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={BX2 + BW + 40} y={BY2 + BH / 2 - 18} tex="P" w={30} h={32} anchor="start" tone="accent-2" />
      <Label x={BX2 + BW + 40} y={BY2 + BH / 2 - 18} className="dg-text-small dg-text-muted">max push</Label>

      {/* Friction F to the left (at maximum) */}
      <Arrow x1={BX2} y1={BY2 + BH / 2} x2={BX2 - 60} y2={BY2 + BH / 2} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={BX2 - 65} y={BY2 + BH / 2 - 18} tex="F = \mu R" w={70} h={32} anchor="end" tone="accent-2" />
      <Label x={BX2 - 75} y={BY2 + BH / 2 - 18} className="dg-text-small dg-text-muted">limiting friction</Label>

      {/* Equation */}
      <MathLabel x={495} y={BY2 + BH + 70} tex="F = \mu R = P" w={100} h={32} tone="muted" />
      <Label x={495} y={BY2 + BH + 95} className="dg-text-small dg-text-muted">
        About to slip: friction has reached its maximum value
      </Label>

      <line x1={40} y1={215} x2={620} y2={215} className="dg-grid" />

      {/* NEWTON'S THIRD LAW - bottom */}
      <Label x={330} y={235} className="dg-text dg-bold">
        Newton's third law: pairs act on different objects
      </Label>

      {/* Book on table - left */}
      <Label x={165} y={260} className="dg-text dg-bold dg-accent">
        Book on a table
      </Label>

      {/* Table */}
      <line x1={80} y1={350} x2={250} y2={350} className="dg-line" strokeWidth={4} />
      <Label x={165} y={365} className="dg-text-small dg-text-muted">table</Label>

      {/* Book on table */}
      <rect x={135} y={300} width={60} height={40} rx={3} className="dg-fill-accent dg-thin" />
      <Label x={165} y={320} className="dg-text-small dg-bold">book</Label>

      {/* Normal reaction on book (up) */}
      <Arrow x1={165} y1={300} x2={165} y2={270} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={165 - 25} y={285} tex="R_{\text{table on book}}" w={120} h={32} anchor="end" tone="accent" size="small" />

      {/* Book's force on table (down) */}
      <Arrow x1={165} y1={340} x2={165} y2={370} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={165 - 25} y={355} tex="R_{\text{book on table}}" w={120} h={32} anchor="end" tone="accent-2" size="small" />

      <Label x={165} y={395} className="dg-text-small dg-text-muted">
        Pair: table\u2192book (up) and book\u2192table (down). Equal, opposite, different objects.
      </Label>

      {/* Student pushing wall - right */}
      <Label x={495} y={260} className="dg-text dg-bold dg-accent-2">
        Student pushes wall
      </Label>

      {/* Wall */}
      <line x1={460} y1={290} x2={460} y2={370} className="dg-line" strokeWidth={5} />
      <Label x={460} y={385} className="dg-text-small dg-text-muted">wall</Label>

      {/* Student (simplified as circle) */}
      <circle cx={380} cy={330} r={30} className="dg-fill-muted dg-thin" />
      <Label x={380} y={330} className="dg-text-small dg-bold">student</Label>

      {/* Student pushes wall (right) */}
      <Arrow x1={410} y1={330} x2={455} y2={330} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={432} y={315} tex="F_{\text{student on wall}}" w={140} h={32} tone="accent" size="small" />
      <Label x={432} y={315} className="dg-text-small dg-text-muted">pushes right</Label>

      {/* Wall pushes student (left) */}
      <Arrow x1={455} y1={330} x2={410} y2={330} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={432} y={345} tex="F_{\text{wall on student}}" w={140} h={32} tone="accent-2" size="small" />
      <Label x={432} y={345} className="dg-text-small dg-text-muted">pushes left</Label>

      <Label x={495} y={395} className="dg-text-small dg-text-muted">
        Pair: student\u2192wall (right) and wall\u2192student (left). Same contact, opposite directions.
      </Label>

      <Label x={330} y={460} className="dg-text-small dg-text-muted">
        Third-law pairs are always: same interaction type, equal magnitude, opposite direction, acting on different objects.
      </Label>
    </Svg>
  );
}

export default ForcesEquilibriumFrictionThirdLaw;