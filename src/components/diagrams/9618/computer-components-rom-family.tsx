/**
 * The programmable ROM family side by side. Left, PROM: a grid of fuses, some blown by a high
 * voltage; it is written once and can't be erased. Middle, EPROM: a chip with a quartz window
 * under an ultraviolet lamp; UV light erases the whole chip, which has to be taken out of the
 * circuit. Right, EEPROM: a chip still on its circuit board, with one byte being rewritten by an
 * electrical signal. An arrow along the bottom points right: easier to rewrite.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-rom-family';

const W = 640;
const H = 330;
const PW = 200;
const X0 = [10, 220, 430];
const cxOf = (i: number) => X0[i]! + PW / 2;

/** Blown fuses in the PROM grid (1 = blown). */
const BLOWN = [
  [0, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 0],
];

function Panel({ i, title, sub, facts }: { i: number; title: string; sub: string; facts: string[] }) {
  const x = X0[i]!;
  const cx = cxOf(i);
  return (
    <g>
      <rect x={x} y={8} width={PW} height={268} rx={10} className="dg-thin" />
      <Label x={cx} y={30} className="dg-text dg-bold">
        {title}
      </Label>
      <Label x={cx} y={50} className="dg-text-small dg-text-muted">
        {sub}
      </Label>
      {facts.map((f, k) => (
        <Label key={f} x={cx} y={214 + k * 20} className={k === 0 ? 'dg-text-small dg-bold' : 'dg-text-small'}>
          {f}
        </Label>
      ))}
    </g>
  );
}

function Prom() {
  const cols = [45, 85, 125, 165].map((c) => X0[0]! + c);
  const rows = [86, 114, 142];
  return (
    <g>
      {rows.map((y, r) =>
        cols.map((x, c) => {
          const blown = BLOWN[r]![c] === 1;
          return (
            <g key={`${r}-${c}`}>
              <circle cx={x - 14} cy={y} r={3} className="dg-dot" />
              <circle cx={x + 14} cy={y} r={3} className="dg-dot" />
              {blown ? (
                <g>
                  <line x1={x - 14} y1={y} x2={x - 5} y2={y + 4} className="dg-accent-2" />
                  <line x1={x + 14} y1={y} x2={x + 5} y2={y - 4} className="dg-accent-2" />
                </g>
              ) : (
                <line x1={x - 14} y1={y} x2={x + 14} y2={y} className="dg-line" />
              )}
            </g>
          );
        }),
      )}
      <line x1={X0[0]! + 22} y1={172} x2={X0[0]! + 46} y2={172} className="dg-line" />
      <Label x={X0[0]! + 52} y={172} anchor="start" className="dg-text-small">
        intact
      </Label>
      <line x1={X0[0]! + 112} y1={172} x2={X0[0]! + 120} y2={175} className="dg-accent-2" />
      <line x1={X0[0]! + 136} y1={172} x2={X0[0]! + 128} y2={169} className="dg-accent-2" />
      <Label x={X0[0]! + 142} y={172} anchor="start" className="dg-text-small">
        blown
      </Label>
    </g>
  );
}

function Eprom() {
  const cx = cxOf(1);
  const pins = [128, 140, 152, 164];
  return (
    <g>
      <rect x={cx - 48} y={64} width={96} height={20} rx={4} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={cx} y={74} className="dg-text-small dg-bold">
        UV lamp
      </Label>
      {[-22, 0, 22].map((dx) => (
        <line key={dx} x1={cx + dx} y1={88} x2={cx + dx * 0.35} y2={128} className="dg-accent-2 dg-dashed" />
      ))}
      {pins.map((y) => (
        <g key={y}>
          <line x1={cx - 52} y1={y} x2={cx - 40} y2={y} className="dg-thin" />
          <line x1={cx + 40} y1={y} x2={cx + 52} y2={y} className="dg-thin" />
        </g>
      ))}
      <rect x={cx - 40} y={118} width={80} height={56} rx={4} className="dg-fill-muted dg-thin" />
      <circle cx={cx} cy={142} r={13} className="dg-fill-accent dg-accent" />
      <Label x={cx} y={188} className="dg-text-small dg-text-muted">
        quartz window
      </Label>
    </g>
  );
}

function Eeprom() {
  const cx = cxOf(2);
  const cells = [0, 1, 2, 3];
  return (
    <g>
      <rect x={cx - 80} y={150} width={160} height={22} rx={3} className="dg-fill-muted dg-thin" />
      <Label x={cx} y={188} className="dg-text-small dg-text-muted">
        still on the circuit board
      </Label>
      {[-30, -10, 10, 30].map((dx) => (
        <line key={dx} x1={cx + dx} y1={140} x2={cx + dx} y2={150} className="dg-thin" />
      ))}
      <rect x={cx - 46} y={88} width={92} height={52} rx={4} className="dg-fill-muted dg-thin" />
      {[0, 1].map((r) =>
        cells.map((c) => (
          <rect
            key={`${r}-${c}`}
            x={cx - 38 + c * 19}
            y={96 + r * 19}
            width={15}
            height={15}
            className={r === 0 && c === 2 ? 'dg-fill-accent-2 dg-accent-2' : 'dg-thin'}
          />
        )),
      )}
      <Arrow x1={cx + 50} y1={80} x2={cx + 6} y2={99} head={8} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={cx + 72} y={70} anchor="end" className="dg-text-small dg-text-accent-2">
        rewrite one byte
      </Label>
    </g>
  );
}

export function ComputerComponentsRomFamily() {
  return (
    <Svg width={W} height={H}>
      <Panel i={0} title="PROM" sub="programmable ROM" facts={['written once', "can't be erased", 'mistake = new chip']} />
      <Panel i={1} title="EPROM" sub="erasable PROM" facts={['erased by UV light', 'whole chip at once', 'out of the circuit']} />
      <Panel
        i={2}
        title="EEPROM"
        sub="electrically erasable PROM"
        facts={['erased electrically', 'byte by byte', 'stays in the circuit']}
      />
      <Prom />
      <Eprom />
      <Eeprom />
      <Arrow x1={40} y1={298} x2={600} y2={298} head={10} />
      <Label x={W / 2} y={318} className="dg-text-small dg-bold">
        easier to rewrite
      </Label>
    </Svg>
  );
}

export default ComputerComponentsRomFamily;
