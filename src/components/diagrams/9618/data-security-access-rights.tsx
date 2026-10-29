/**
 * Access rights as a grid (9618 6.1.6). Five roles against four files. R = read, W = write,
 * D = delete, a dash means no access. The receptionist can manage appointments but cannot open
 * clinical notes; payroll is limited to finance; only administrators hold delete rights.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-security-access-rights';

const W = 640;
const H = 328;
const LABEL_W = 150;
const CELL_W = 108;
const HEADER_Y = 44;
const HEADER_H = 34;
const ROW_H = 38;

const files = ['appointments', 'patient notes', 'prescriptions', 'payroll'];

type Row = { role: string; rights: string[] };

const rows: Row[] = [
  { role: 'receptionist', rights: ['R W', '—', '—', '—'] },
  { role: 'nurse', rights: ['R', 'R W', '—', '—'] },
  { role: 'doctor', rights: ['R', 'R W', 'R W', '—'] },
  { role: 'finance', rights: ['—', '—', '—', 'R W'] },
  { role: 'IT administrator', rights: ['R W D', 'R W D', 'R W D', '—'] },
];

export function AccessRightsDiagram() {
  const gridX = 12;
  return (
    <Svg width={W} height={H}>
      <rect x={gridX} y={HEADER_Y} width={LABEL_W} height={HEADER_H} rx={4} className="dg-fill-muted dg-thin" />
      <Label x={gridX + LABEL_W / 2} y={HEADER_Y + HEADER_H / 2} className="dg-text-small dg-bold">
        role / file
      </Label>
      {files.map((file, ci) => {
        const x = gridX + LABEL_W + ci * CELL_W;
        return (
          <g key={file}>
            <rect x={x} y={HEADER_Y} width={CELL_W} height={HEADER_H} rx={4} className="dg-fill-muted dg-thin" />
            <Label x={x + CELL_W / 2} y={HEADER_Y + HEADER_H / 2} className="dg-text-small dg-bold">
              {file}
            </Label>
          </g>
        );
      })}
      {rows.map((row, ri) => {
        const y = HEADER_Y + HEADER_H + 4 + ri * ROW_H;
        return (
          <g key={row.role}>
            <Label x={gridX + 6} y={y + ROW_H / 2 - 2} anchor="start" className="dg-text-small">
              {row.role}
            </Label>
            {row.rights.map((right, ci) => {
              const x = gridX + LABEL_W + ci * CELL_W + 2;
              const denied = right === '—';
              return (
                <g key={`${row.role}-${files[ci]}`}>
                  <rect
                    x={x}
                    y={y}
                    width={CELL_W - 4}
                    height={ROW_H - 8}
                    rx={4}
                    className={denied ? 'dg-fill-surface dg-grid' : 'dg-fill-accent dg-thin'}
                  />
                  <Label
                    x={x + (CELL_W - 4) / 2}
                    y={y + (ROW_H - 8) / 2}
                    className={denied ? 'dg-text-small dg-text-muted' : 'dg-text-small dg-mono dg-bold'}
                  >
                    {right}
                  </Label>
                </g>
              );
            })}
          </g>
        );
      })}
      <Label x={W / 2} y={HEADER_Y + HEADER_H + 8 + rows.length * ROW_H + 18} className="dg-text-small dg-text-muted">
        R = read · W = write · D = delete · — = no access
      </Label>
      <Label x={W / 2} y={H - 8} className="dg-text-small dg-text-accent">
        grant only what the job needs
      </Label>
    </Svg>
  );
}

export default AccessRightsDiagram;
