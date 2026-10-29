/**
 * The system clock and the Immediate Access Store. Top: a 3 GHz square wave with
 * three clock cycles highlighted. Below: one cycle takes about 0.33 ns, a third
 * of a 1 ns tick (T = 1/f). Right: the small IAS sits inside the CPU and holds
 * the current instruction and data; main memory is much larger.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'cs-cpu-architecture-clock-ias';

const W = 620;
const H = 420;

const wave =
  'M40,120 H60 V70 H100 V120 H140 V70 H180 V120 H220 V70 H260 V120 H300 V70 H340 V120';

export function CpuArchitectureClockIas() {
  return (
    <Svg width={W} height={H}>
      <Label x={40} y={52} anchor="start" className="dg-text-small dg-text-muted">
        clock signal — one pulse per beat
      </Label>
      <path d={wave} className="dg-line" />
      <path d="M60,120 V70 H100 V120 H140" className="dg-accent" />
      <path d="M140,120 V70 H180 V120 H220" className="dg-accent" />
      <path d="M220,120 V70 H260 V120 H300" className="dg-accent" />
      <Label x={180} y={144} className="dg-text-accent">
        3 clock cycles
      </Label>
      <Label x={500} y={72} className="dg-text-small dg-text-muted">
        clock speed
      </Label>
      <Label x={500} y={94} className="dg-text dg-bold">
        3 GHz
      </Label>

      <path d="M40,260 H60 V215 H100 V260 H120" className="dg-line" />
      <path d="M60,260 V215 H100 V260" className="dg-accent" />
      <path d="M40,205 V270" className="dg-dashed dg-muted" />
      <path d="M120,205 V270" className="dg-dashed dg-muted" />

      <line x1={40} y1={300} x2={280} y2={300} className="dg-thin" />
      <line x1={40} y1={300} x2={120} y2={300} className="dg-accent" />
      {[40, 120, 200, 280].map((x) => (
        <line key={x} x1={x} y1={292} x2={x} y2={308} className="dg-thin" />
      ))}
      <Label x={80} y={324} className="dg-text-accent">
        0.33 ns
      </Label>
      <Label x={280} y={324} anchor="end" className="dg-text-small">
        1 ns
      </Label>
      <MathLabel
        x={30}
        y={362}
        anchor="start"
        w={360}
        h={48}
        tex={"T = \\dfrac{1}{f} = \\dfrac{1}{3.0 \\times 10^{9}\\ \\text{Hz}} = 0.33\\ \\text{ns}"}
      />

      <rect x={430} y={176} width={170} height={112} rx={12} className="dg-fill-accent dg-accent" />
      <Label x={448} y={200} anchor="start" className="dg-text dg-bold">
        CPU
      </Label>
      <rect x={444} y={208} width={142} height={68} rx={8} className="dg-fill-surface dg-thin" />
      <Label x={515} y={230} className="dg-text dg-bold">
        IAS
      </Label>
      <Label x={515} y={250} className="dg-text-small">
        current instruction
      </Label>
      <Label x={515} y={268} className="dg-text-small">
        and data in use
      </Label>
      <Arrow x1={515} y1={288} x2={515} y2={306} double head={8} />
      <rect x={420} y={306} width={190} height={86} rx={12} className="dg-fill-muted dg-thin" />
      <Label x={515} y={332} className="dg-text dg-bold">
        Main memory
      </Label>
      <Label x={515} y={356} className="dg-text-small">
        much larger
      </Label>
      <Label x={515} y={374} className="dg-text-small">
        holds everything else
      </Label>
    </Svg>
  );
}

export default CpuArchitectureClockIas;
