/**
 * How σ and π bonds form from atomic orbitals. Row 1: two s orbitals overlap head-on to
 * give a σ bond (e.g. H₂). Row 2: two p orbitals pointing at each other overlap end-on to
 * give a σ bond. Row 3: two parallel p orbitals overlap sideways to give a π bond, whose
 * electron density sits above and below the line joining the nuclei (one bond, two
 * regions). Dots are nuclei; shaded regions are where the bonding pair is concentrated.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Lobe } from './covalent-bonding-kit';

export const diagramKey = 'chem-covalent-bonding-sigma-pi-overlap';

const W = 640;
const H = 440;
const AX = 236;
const BX = 296;
const NA = 380;
const NB = 420;

function Nucleus({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={3.2} className="dg-dot" />;
}

function P({ x, y, vertical, className = 'dg-thin dg-fill-muted' }: { x: number; y: number; vertical?: boolean; className?: string }) {
  const a = vertical ? 90 : 0;
  return (
    <g>
      <Lobe x={x} y={y} angle={a} len={36} w={28} className={className} />
      <Lobe x={x} y={y} angle={a + 180} len={36} w={28} className={className} />
    </g>
  );
}

function Notes({ y, lines }: { y: number; lines: string[] }) {
  return (
    <g>
      {lines.map((l, i) => (
        <Label key={i} x={486} y={y + (i - (lines.length - 1) / 2) * 17} anchor="start" className="dg-text-small">
          {l}
        </Label>
      ))}
    </g>
  );
}

export function CovalentBondingSigmaPiOverlap() {
  const y1 = 78;
  const y2 = 216;
  const y3 = 362;
  return (
    <Svg width={W} height={H}>
      {/* row 1: s + s */}
      <Label x={24} y={y1 - 52} anchor="start" className="dg-text dg-bold">
        s + s → σ bond (e.g. H₂)
      </Label>
      <circle cx={80} cy={y1} r={26} className="dg-thin dg-fill-muted" />
      <circle cx={160} cy={y1} r={26} className="dg-thin dg-fill-muted" />
      <Nucleus x={80} y={y1} />
      <Nucleus x={160} y={y1} />
      <Arrow x1={AX} y1={y1} x2={BX} y2={y1} />
      <ellipse cx={400} cy={y1} rx={50} ry={27} className="dg-thin dg-fill-accent" />
      <Nucleus x={NA} y={y1} />
      <Nucleus x={NB} y={y1} />
      <Notes y={y1} lines={['head-on overlap:', 'density on the line', 'between the nuclei']} />

      <line x1={24} y1={y1 + 52} x2={W - 24} y2={y1 + 52} className="dg-grid" />

      {/* row 2: p + p end-on */}
      <Label x={24} y={y2 - 52} anchor="start" className="dg-text dg-bold">
        p + p end-on → σ bond (e.g. Cl₂)
      </Label>
      <P x={70} y={y2} />
      <P x={170} y={y2} />
      <Nucleus x={70} y={y2} />
      <Nucleus x={170} y={y2} />
      <Arrow x1={AX} y1={y2} x2={BX} y2={y2} />
      <Lobe x={NA} y={y2} angle={180} len={24} w={20} className="dg-thin dg-fill-muted" />
      <Lobe x={NB} y={y2} angle={0} len={24} w={20} className="dg-thin dg-fill-muted" />
      <ellipse cx={400} cy={y2} rx={34} ry={22} className="dg-thin dg-fill-accent" />
      <Nucleus x={NA} y={y2} />
      <Nucleus x={NB} y={y2} />
      <Notes y={y2} lines={['end-on (direct) overlap:', 'density on the line', 'between the nuclei']} />

      <line x1={24} y1={y2 + 64} x2={W - 24} y2={y2 + 64} className="dg-grid" />

      {/* row 3: p + p sideways */}
      <Label x={24} y={y3 - 62} anchor="start" className="dg-text dg-bold">
        p + p sideways → π bond (e.g. the second bond in C=C)
      </Label>
      <P x={100} y={y3} vertical />
      <P x={150} y={y3} vertical />
      <Nucleus x={100} y={y3} />
      <Nucleus x={150} y={y3} />
      <Arrow x1={AX} y1={y3} x2={BX} y2={y3} />
      <P x={NA} y={y3} vertical className="dg-muted" />
      <P x={NB} y={y3} vertical className="dg-muted" />
      <ellipse cx={400} cy={y3 - 24} rx={44} ry={14} className="dg-thin dg-fill-accent-2" />
      <ellipse cx={400} cy={y3 + 24} rx={44} ry={14} className="dg-thin dg-fill-accent-2" />
      <line x1={340} y1={y3} x2={460} y2={y3} className="dg-muted dg-dashed" />
      <Nucleus x={NA} y={y3} />
      <Nucleus x={NB} y={y3} />
      <Notes y={y3} lines={['sideways overlap:', 'density above and below', 'the line between the', 'nuclei (one π bond)']} />
    </Svg>
  );
}

export default CovalentBondingSigmaPiOverlap;
