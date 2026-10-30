import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'p2-trigonometry-reciprocal-graphs';

const PI = Math.PI;
const width = 500;
const panelHeight = 132;
const plot = axes({ width, height: panelHeight, pad: 42, x: [-PI, PI], y: [-3, 3] });
const panels = [
  { name: 'sec', fn: (x: number) => 1 / Math.cos(x), poles: [-PI / 2, PI / 2] },
  { name: 'cosec', fn: (x: number) => 1 / Math.sin(x), poles: [-PI, 0, PI] },
  { name: 'cot', fn: (x: number) => Math.cos(x) / Math.sin(x), poles: [-PI, 0, PI] },
];

export default function ReciprocalTrigGraphs() {
  return (
    <Svg width={width} height={panelHeight * 3 + 24}>
      {panels.map((panel, index) => {
        const top = index * (panelHeight + 8);
        const endpointLabelOffset = index === 0 ? 0 : 18;
        let label = '\\sec x';
        if (panel.name === 'cosec') label = '\\operatorname{cosec} x';
        if (panel.name === 'cot') label = '\\cot x';
        return (
          <g key={panel.name} transform={`translate(0, ${top})`}>
            <MathLabel x={width / 2} y={12} tex={label} w={100} h={28} />
            <line x1={plot.sx(-PI)} y1={plot.sy(0)} x2={plot.sx(PI)} y2={plot.sy(0)} className="dg-thin" />
            <line x1={plot.sx(0)} y1={plot.sy(-3)} x2={plot.sx(0)} y2={plot.sy(3)} className="dg-thin" />
            {panel.poles.map((x) => (
              <line key={`pole-${x}`} x1={plot.sx(x)} y1={plot.sy(-3)} x2={plot.sx(x)} y2={plot.sy(3)} className="dg-dashed dg-muted" />
            ))}
            <path d={graph(panel.fn, [-PI, PI], plot, [-3, 3])} className="dg-accent" />
            <MathLabel x={plot.sx(-PI) + endpointLabelOffset} y={plot.sy(0) + 14} tex="-\pi" w={42} h={36} size="small" />
            <Label x={plot.sx(0)} y={plot.sy(0) + 14} className="dg-text-small">0</Label>
            <MathLabel x={plot.sx(PI) - endpointLabelOffset} y={plot.sy(0) + 14} tex="\pi" w={42} h={36} size="small" />
            {index < 2 && <line x1={12} y1={panelHeight + 4} x2={width - 12} y2={panelHeight + 4} className="dg-grid" />}
          </g>
        );
      })}
      <Label x={width / 2} y={panelHeight * 3 + 8} className="dg-text-small">Horizontal scale in radians; dashed lines are asymptotes</Label>
    </Svg>
  );
}
