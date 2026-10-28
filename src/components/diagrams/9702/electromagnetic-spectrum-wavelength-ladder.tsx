/**
 * The seven regions of the electromagnetic spectrum as a ladder from longest to shortest
 * wavelength. The bars are deliberate equal-length rows, not a scale: the order and the
 * approximate wavelength ranges are what matter.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-electromagnetic-spectrum-wavelength-ladder';

const W = 640;
const H = 460;

const ROWS: Array<{ name: string; range: string }> = [
  { name: 'Radio waves', range: 'longer than 0.1 m' },
  { name: 'Microwaves', range: '0.1 m to 1 mm' },
  { name: 'Infrared', range: '1 mm to 700 nm' },
  { name: 'Visible light', range: '700 nm to 400 nm' },
  { name: 'Ultraviolet', range: '400 nm to 10 nm' },
  { name: 'X-rays', range: '10 nm to 0.01 nm' },
  { name: 'Gamma rays', range: 'shorter than 0.01 nm' },
];

const TOP = 56;
const ROW_H = 40;
const GAP = 8;

export function ElectromagneticSpectrumWavelengthLadder() {
  return (
    <Svg width={W} height={H}>
      <Label x={52} y={30} anchor="start" className="dg-text dg-bold">
        The electromagnetic spectrum: longest wavelength at the top
      </Label>

      {ROWS.map((row, i) => {
        const y = TOP + i * (ROW_H + GAP);
        const visible = row.name === 'Visible light';
        return (
          <g key={row.name}>
            <rect
              x={52}
              y={y}
              width={536}
              height={ROW_H}
              rx={6}
              className={visible ? 'dg-fill-accent-2' : i % 2 === 0 ? 'dg-fill-accent' : 'dg-fill-muted'}
            />
            <Label
              x={70}
              y={y + ROW_H / 2}
              anchor="start"
              className={visible ? 'dg-text dg-bold dg-text-accent-2' : 'dg-text'}
            >
              {row.name}
            </Label>
            <Label x={570} y={y + ROW_H / 2} anchor="end" className="dg-text-small dg-text-muted">
              {row.range}
            </Label>
          </g>
        );
      })}

      {/* direction of change down the ladder */}
      <Arrow x1={34} y1={TOP + 14} x2={34} y2={TOP + 6 * (ROW_H + GAP) + 26} head={8} className="dg-thin" />
      <Label x={34} y={TOP + 7 * (ROW_H + GAP) + 18} className="dg-text-small dg-text-muted">
        wavelength decreases, frequency increases
      </Label>

      <Label x={W / 2} y={H - 12} className="dg-text-small dg-text-muted">
        Ranges are approximate and run into each other. Only 400–700 nm reaches your eye.
      </Label>
    </Svg>
  );
}

export default ElectromagneticSpectrumWavelengthLadder;
