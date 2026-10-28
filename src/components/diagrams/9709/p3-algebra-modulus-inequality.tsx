/**
 * The two shapes of modulus inequality on a number line, next to the graph of
 * y = |x − a| with the line y = b cutting it.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'math-p3-algebra-modulus-inequality';

const W = 600;
const H = 332;

export function P3AlgebraModulusInequality() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        Where |x − a| is less than b, and where it is more
      </Label>

      {/* inside */}
      <Label x={40} y={56} anchor="start" className="dg-text-small dg-text-accent">
        |x − a| &lt; b
      </Label>
      <line x1={40} y1={88} x2={540} y2={88} className="dg-line" />
      <line x1={180} y1={80} x2={180} y2={96} className="dg-muted" />
      <line x1={400} y1={80} x2={400} y2={96} className="dg-muted" />
      <line x1={180} y1={88} x2={400} y2={88} className="dg-accent" />
      <circle cx={180} cy={88} r={5} className="dg-fill-muted dg-thin" />
      <circle cx={400} cy={88} r={5} className="dg-fill-muted dg-thin" />
      <Label x={290} y={110} className="dg-text-small dg-text-muted">
        a − b &lt; x &lt; a + b
      </Label>

      {/* outside */}
      <Label x={40} y={162} anchor="start" className="dg-text-small dg-text-accent">
        |x − a| &gt; b
      </Label>
      <line x1={40} y1={194} x2={540} y2={194} className="dg-line" />
      <line x1={180} y1={186} x2={180} y2={202} className="dg-muted" />
      <line x1={400} y1={186} x2={400} y2={202} className="dg-muted" />
      <line x1={40} y1={194} x2={180} y2={194} className="dg-accent" />
      <line x1={400} y1={194} x2={540} y2={194} className="dg-accent" />
      <circle cx={180} cy={194} r={5} className="dg-fill-muted dg-thin" />
      <circle cx={400} cy={194} r={5} className="dg-fill-muted dg-thin" />
      <Label x={290} y={216} className="dg-text-small dg-text-muted">
        x &lt; a − b or x &gt; a + b
      </Label>

      {/* graph reading */}
      <line x1={90} y1={296} x2={300} y2={296} className="dg-thin" />
      <path d="M120,246 L188,296 L256,246" className="dg-accent" />
      <line x1={128} y1={262} x2={248} y2={262} className="dg-muted dg-dashed" />
      <line x1={146} y1={262} x2={230} y2={262} className="dg-accent" />
      <Label x={122} y={262} anchor="end" className="dg-text-small dg-text-muted">
        b
      </Label>
      <Label x={146} y={316} className="dg-text-small dg-text-muted">
        a − b
      </Label>
      <Label x={230} y={316} className="dg-text-small dg-text-muted">
        a + b
      </Label>
      <Label x={470} y={276} anchor="middle" className="dg-text-small dg-text-muted">
        y = |x − a| is below y = b
      </Label>
      <Label x={470} y={296} anchor="middle" className="dg-text-small dg-text-muted">
        exactly between a − b and a + b
      </Label>
    </Svg>
  );
}

export default P3AlgebraModulusInequality;
