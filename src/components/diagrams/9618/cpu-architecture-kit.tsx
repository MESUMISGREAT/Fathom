/**
 * Shared pieces for the 9618 topic 4.1 (CPU architecture) diagrams: a labelled
 * box and a small register cell. Colours come from the dg-* classes, so every
 * diagram adapts to light and dark mode.
 */
import { Label } from '../primitives';

export function Box({
  x,
  y,
  w,
  h,
  title,
  lines,
  tone = 'plain',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  tone?: 'plain' | 'accent' | 'accent-2' | 'muted';
}) {
  const cls =
    tone === 'accent'
      ? 'dg-fill-accent dg-accent'
      : tone === 'accent-2'
        ? 'dg-fill-accent-2 dg-accent-2'
        : tone === 'muted'
          ? 'dg-fill-muted dg-thin'
          : 'dg-fill-surface dg-thin';
  const hasLines = !!lines && lines.length > 0;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={cls} />
      <Label x={x + w / 2} y={hasLines ? y + 24 : y + h / 2} className="dg-text dg-bold">
        {title}
      </Label>
      {(lines ?? []).map((l, i) => (
        <Label key={i} x={x + w / 2} y={y + 46 + i * 18} className="dg-text-small">
          {l}
        </Label>
      ))}
    </g>
  );
}

export function Cell({
  x,
  y,
  w,
  h,
  label,
  tone = 'plain',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tone?: 'plain' | 'accent' | 'muted';
}) {
  const cls =
    tone === 'accent'
      ? 'dg-fill-accent dg-thin'
      : tone === 'muted'
        ? 'dg-fill-muted dg-thin'
        : 'dg-fill-surface dg-thin';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} className={cls} />
      <Label x={x + w / 2} y={y + h / 2} className="dg-text-small dg-bold">
        {label}
      </Label>
    </g>
  );
}
