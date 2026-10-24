/**
 * One flash memory cell (a floating gate transistor) in cross-section, left. From the top: the
 * control gate, an insulating layer, the floating gate holding trapped electrons, a thin
 * insulating layer, then the silicon with a source and a drain. A voltage on the control gate
 * pulls electrons up through the thin insulator, where they are trapped. Right: the two states.
 * With no trapped electrons the cell is erased (read as 1 in NAND flash); with electrons
 * trapped it is programmed (read as 0). The electrons stay with the power off: non-volatile.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-floating-gate';

const W = 620;
const H = 250;

function Electrons({ xs, y, r = 6 }: { xs: number[]; y: number; r?: number }) {
  return (
    <g>
      {xs.map((x) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r} className="dg-dot-accent-2" />
          <line x1={x - r / 2} y1={y} x2={x + r / 2} y2={y} className="dg-fill-surface" style={{ stroke: 'var(--surface)', strokeWidth: 1.5 }} />
        </g>
      ))}
    </g>
  );
}

function Mini({ y, trapped, a, b }: { y: number; trapped: boolean; a: string; b: string }) {
  return (
    <g>
      <rect x={384} y={y} width={70} height={14} className="dg-fill-muted dg-thin" />
      <rect x={384} y={y + 18} width={70} height={22} className="dg-fill-accent dg-accent" />
      {trapped && <Electrons xs={[398, 412, 426, 440]} y={y + 29} r={5} />}
      <Label x={466} y={y + 12} anchor="start" className="dg-text-small">
        {a}
      </Label>
      <Label x={466} y={y + 30} anchor="start" className="dg-text-small dg-bold">
        {b}
      </Label>
    </g>
  );
}

export function ComputerComponentsFloatingGate() {
  return (
    <Svg width={W} height={H}>
      {/* the cell in cross-section */}
      <rect x={150} y={30} width={150} height={32} className="dg-fill-muted dg-line" />
      <Label x={225} y={46} className="dg-text-small dg-bold">
        control gate
      </Label>
      <rect x={150} y={62} width={150} height={12} className="dg-thin" />
      <rect x={150} y={74} width={150} height={34} className="dg-fill-accent dg-accent" />
      <Electrons xs={[170, 192, 214, 236]} y={91} />
      <rect x={150} y={108} width={150} height={8} className="dg-thin" />
      <rect x={70} y={116} width={310} height={88} className="dg-fill-muted dg-thin" />
      <rect x={80} y={116} width={70} height={36} className="dg-fill-accent-2 dg-thin" />
      <rect x={300} y={116} width={70} height={36} className="dg-fill-accent-2 dg-thin" />
      <Label x={115} y={134} className="dg-text-small">
        source
      </Label>
      <Label x={335} y={134} className="dg-text-small">
        drain
      </Label>
      <Label x={225} y={190} className="dg-text-small dg-text-muted">
        silicon
      </Label>
      <Arrow x1={272} y1={176} x2={272} y2={96} head={8} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={225} y={164} className="dg-text-small">
        electrons tunnel in
      </Label>

      <Label x={142} y={68} anchor="end" className="dg-text-small dg-text-muted">
        insulator
      </Label>
      <Label x={142} y={91} anchor="end" className="dg-text-small dg-text-accent">
        floating gate
      </Label>
      <Label x={142} y={110} anchor="end" className="dg-text-small dg-text-muted">
        thin insulator
      </Label>

      {/* the two states */}
      <Label x={490} y={22} className="dg-text-small dg-bold">
        the two states (NAND flash)
      </Label>
      <Mini y={44} trapped={false} a="no electrons trapped" b="erased: reads as 1" />
      <Mini y={104} trapped a="electrons trapped" b="programmed: reads as 0" />
      <Label x={490} y={190} className="dg-text-small dg-text-muted">
        trapped electrons stay with
      </Label>
      <Label x={490} y={206} className="dg-text-small dg-text-muted">
        the power off: non-volatile
      </Label>
    </Svg>
  );
}

export default ComputerComponentsFloatingGate;
