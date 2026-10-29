/**
 * Java source is compiled to portable bytecode, and each platform's JVM
 * executes that same bytecode.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-language-translators-java-bytecode';

const W = 580;
const H = 300;

const platforms = ['Windows JVM', 'macOS JVM', 'Linux JVM'];

export function LanguageTranslatorsJavaBytecode() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Compile once, run anywhere
      </Label>

      <rect x={26} y={92} width={112} height={56} rx={6} className="dg-fill-muted dg-line" />
      <Label x={82} y={112} className="dg-text-small dg-text">
        Hello.java
      </Label>
      <Label x={82} y={132} className="dg-text-small dg-text-muted">
        source code
      </Label>

      <Arrow x1={144} y1={120} x2={178} y2={120} head={8} className="dg-muted" headClassName="dg-dot" />

      <rect x={182} y={92} width={104} height={56} rx={6} className="dg-fill-accent dg-line" />
      <Label x={234} y={112} className="dg-text-small dg-text dg-bold">
        compiler
      </Label>
      <Label x={234} y={132} className="dg-text-small dg-text">
        javac
      </Label>

      <Arrow x1={290} y1={120} x2={324} y2={120} head={8} className="dg-muted" headClassName="dg-dot" />

      <rect x={328} y={92} width={112} height={56} rx={6} className="dg-fill-accent-2 dg-line" />
      <Label x={384} y={112} className="dg-text-small dg-text dg-bold">
        bytecode
      </Label>
      <Label x={384} y={132} className="dg-text-small dg-text">
        Hello.class
      </Label>

      {platforms.map((p, i) => {
        const x = 70 + i * 168;
        return (
          <g key={p}>
            <Arrow x1={384} y1={152} x2={x + 62} y2={196} head={7} className="dg-muted" headClassName="dg-dot" />
            <rect x={x} y={200} width={124} height={44} rx={6} className="dg-fill-muted dg-line" />
            <Label x={x + 62} y={222} className="dg-text-small dg-text">
              {p}
            </Label>
          </g>
        );
      })}

      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">
        The bytecode is portable; each platform supplies the JVM that runs it
      </Label>
    </Svg>
  );
}

export default LanguageTranslatorsJavaBytecode;
