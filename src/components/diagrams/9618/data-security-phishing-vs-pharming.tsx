/**
 * Phishing and pharming compared (9618 6.1.4). On the left the user is tricked by a message and
 * clicks a lookalike link. On the right the user types the correct address, but a tampered hosts
 * file or poisoned DNS record returns the attacker's server, so no click is needed.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-security-phishing-vs-pharming';

const W = 640;
const H = 320;
const PANEL_W = 304;
const BOX_H = 46;
const BOX_Y = [58, 128, 198];
const NOTE_BAND = 266;

type Panel = {
  x: number;
  title: string;
  boxes: string[];
  note: string[];
};

const panels: Panel[] = [
  {
    x: 8,
    title: 'PHISHING',
    boxes: ['fake email from a spoofed sender', 'user clicks a lookalike link', "password goes to the attacker"],
    note: ['the user has to make', 'the mistake'],
  },
  {
    x: 328,
    title: 'PHARMING',
    boxes: ['user types the correct address', 'tampered DNS or hosts file replies', 'fake site loads under the real name'],
    note: ['no click is needed:', 'the address bar is right'],
  },
];

export function PhishingVsPharmingDiagram() {
  return (
    <Svg width={W} height={H}>
      {panels.map((panel) => {
        const cx = panel.x + PANEL_W / 2;
        return (
          <g key={panel.title}>
            <Label x={cx} y={24} className="dg-text dg-bold">
              {panel.title}
            </Label>
            <rect x={panel.x} y={36} width={PANEL_W} height={264} rx={8} className="dg-grid" fill="none" />
            {panel.boxes.map((text, i) => {
              const y = BOX_Y[i]!;
              return (
                <g key={text}>
                  <rect
                    x={panel.x + 16}
                    y={y}
                    width={PANEL_W - 32}
                    height={BOX_H}
                    rx={6}
                    className={i === 2 ? 'dg-fill-accent-2 dg-thin' : 'dg-fill-muted dg-thin'}
                  />
                  <Label x={cx} y={y + BOX_H / 2} className="dg-text-small">
                    {text}
                  </Label>
                  {i < 2 && (
                    <Arrow x1={cx} y1={y + BOX_H + 3} x2={cx} y2={BOX_Y[i + 1]! - 3} head={8} />
                  )}
                </g>
              );
            })}
            {panel.note.map((line, i) => (
              <Label key={line} x={cx} y={NOTE_BAND + i * 17} className="dg-text-small dg-text-muted">
                {line}
              </Label>
            ))}
          </g>
        );
      })}
    </Svg>
  );
}

export default PhishingVsPharmingDiagram;
