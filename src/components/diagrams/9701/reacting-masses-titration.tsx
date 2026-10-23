/**
 * Titration set-up and a results table. Left: a burette held in a clamp on a
 * stand, with a tap and jet above a conical flask (25.0 cm³ of solution from
 * a pipette, plus indicator) on a white tile. Right: illustrative burette
 * readings for a rough run and three accurate runs: titres 24.40 (rough),
 * 23.80, 24.15 and 23.70 cm³. Runs 1 and 3 agree within 0.10 cm³
 * (concordant), so the mean titre is (23.80 + 23.70) ÷ 2 = 23.75 cm³.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-reacting-masses-titration';

const W = 640;
const H = 380;

const RUNS = [
  { name: 'rough', final: '24.40', initial: '0.00', titre: '24.40', ok: '' },
  { name: '1', final: '24.00', initial: '0.20', titre: '23.80', ok: '✓' },
  { name: '2', final: '48.15', initial: '24.00', titre: '24.15', ok: '✗' },
  { name: '3', final: '24.20', initial: '0.50', titre: '23.70', ok: '✓' },
];

export function ReactingMassesTitration() {
  const bx = 120; // burette left edge
  const bw = 16;
  const tx = 352; // table left
  const col0 = 88;
  const colW = 50;
  const rowH = 30;
  const ty = 92;
  const rows: Array<[string, (r: (typeof RUNS)[number]) => string]> = [
    ['final', (r) => r.final],
    ['initial', (r) => r.initial],
    ['titre', (r) => r.titre],
    ['concordant', (r) => r.ok],
  ];
  return (
    <Svg width={W} height={H}>
      {/* stand and clamp */}
      <rect x={28} y={346} width={176} height={10} rx={2} className="dg-fill-muted dg-line" />
      <line x1={50} y1={30} x2={50} y2={346} className="dg-line" />
      <line x1={50} y1={96} x2={bx} y2={96} className="dg-line" />
      <rect x={bx - 6} y={88} width={bw + 12} height={16} rx={3} className="dg-fill-surface dg-line" />

      {/* burette */}
      <rect x={bx} y={70} width={bw} height={180} className="dg-fill-accent" />
      <path d={`M${bx},30 L${bx},250 L${bx + 5},262 L${bx + 11},262 L${bx + bw},250 L${bx + bw},30`} className="dg-line" />
      {Array.from({ length: 10 }, (_, i) => (
        <line key={i} x1={bx} y1={50 + i * 20} x2={bx + 7} y2={50 + i * 20} className="dg-thin" />
      ))}
      <rect x={bx - 8} y={262} width={bw + 16} height={8} rx={2} className="dg-fill-muted dg-line" />
      <line x1={bx + 8} y1={270} x2={bx + 8} y2={288} className="dg-line" />

      {/* conical flask on a white tile */}
      <rect x={66} y={340} width={124} height={6} className="dg-fill-surface dg-thin" />
      <path d="M88,326 L73,339 L183,339 L168,326 Z" className="dg-fill-accent" />
      <line x1={88} y1={326} x2={168} y2={326} className="dg-thin" />
      <path d="M116,284 L116,300 L70,340 L186,340 L140,300 L140,284" className="dg-line" />

      {/* labels */}
      {[
        { y: 56, from: [bx + bw, 56], lines: ['burette: read to the', 'nearest 0.05 cm³'] },
        { y: 266, from: [bx + bw + 8, 266], lines: ['tap: add dropwise', 'near the end-point'] },
        { y: 312, from: [164, 332], lines: ['25.0 cm³ (pipette)', '+ indicator'] },
        { y: 350, from: [190, 344], lines: ['white tile'] },
      ].map((l) => (
        <g key={l.lines[0]}>
          <line x1={l.from[0]} y1={l.from[1]} x2={208} y2={l.y} className="dg-muted" />
          {l.lines.map((t, i) => (
            <Label key={t} x={214} y={l.y + i * 15 - (l.lines.length - 1) * 7} anchor="start" className="dg-text-small">
              {t}
            </Label>
          ))}
        </g>
      ))}

      {/* results table */}
      <Label x={tx} y={36} anchor="start" className="dg-text dg-bold">
        burette readings / cm³
      </Label>
      <Label x={tx} y={56} anchor="start" className="dg-text-muted">
        (illustrative results)
      </Label>
      <line x1={tx} y1={ty - rowH / 2} x2={tx + col0 + 4 * colW} y2={ty - rowH / 2} className="dg-grid" />
      <Label x={tx + 4} y={ty} anchor="start" className="dg-text-small dg-bold">
        run
      </Label>
      {RUNS.map((r, j) => (
        <Label key={r.name} x={tx + col0 + j * colW + colW / 2} y={ty} className="dg-text-small dg-bold">
          {r.name}
        </Label>
      ))}
      {rows.map(([name, get], i) => {
        const y = ty + (i + 1) * rowH;
        return (
          <g key={name}>
            <line x1={tx} y1={y - rowH / 2} x2={tx + col0 + 4 * colW} y2={y - rowH / 2} className="dg-grid" />
            {name === 'titre' && (
              <rect x={tx} y={y - rowH / 2} width={col0 + 4 * colW} height={rowH} className="dg-fill-accent" />
            )}
            <Label x={tx + 4} y={y} anchor="start" className="dg-text-small">
              {name}
            </Label>
            {RUNS.map((r, j) => (
              <Label
                key={r.name}
                x={tx + col0 + j * colW + colW / 2}
                y={y}
                className={name === 'titre' && r.ok === '✓' ? 'dg-text-small dg-bold' : 'dg-text-small'}
              >
                {get(r)}
              </Label>
            ))}
          </g>
        );
      })}
      <line x1={tx} y1={ty + 4 * rowH + rowH / 2} x2={tx + col0 + 4 * colW} y2={ty + 4 * rowH + rowH / 2} className="dg-grid" />

      <Label x={tx} y={268} anchor="start" className="dg-text-small">
        titre = final − initial
      </Label>
      <Label x={tx} y={288} anchor="start" className="dg-text-small">
        concordant: within 0.10 cm³ of each other
      </Label>
      <Label x={tx} y={318} anchor="start" className="dg-text-accent">
        mean = (23.80 + 23.70) ÷ 2
      </Label>
      <Label x={tx} y={340} anchor="start" className="dg-text-accent">
        = 23.75 cm³
      </Label>
    </Svg>
  );
}

export default ReactingMassesTitration;
