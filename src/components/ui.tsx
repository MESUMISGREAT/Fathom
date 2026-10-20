/** Small presentational building blocks shared across pages. */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { MASTERY_LABEL, type MasteryState } from '@/domain/mastery';
import type { Provenance } from '@/content/schema';
import { Spot, type SpotName } from '@/components/art/Spot';
import {
  AlertIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CircleIcon,
  HalfCircleIcon,
  RefreshIcon,
  ShieldIcon,
  SparkIcon,
  SUBJECT_ICONS,
  DotsIcon,
} from './icons';

const STATE_ICON: Record<MasteryState, typeof CircleIcon> = {
  'not-started': CircleIcon,
  learning: DotsIcon,
  practising: HalfCircleIcon,
  secure: CheckCircleIcon,
  'needs-revision': RefreshIcon,
};

/** Mastery state: icon + text label, never colour alone. */
export function StatusPill({ state, bare = false }: { state: MasteryState; bare?: boolean }) {
  const Icon = STATE_ICON[state];
  return (
    <span className={`status${bare ? ' bare' : ''}`} data-state={state}>
      <Icon />
      {MASTERY_LABEL[state]}
    </span>
  );
}

export const STATE_COLOR: Record<MasteryState, string> = {
  'not-started': 'var(--st-not-started)',
  learning: 'var(--st-learning)',
  practising: 'var(--st-practising)',
  secure: 'var(--st-secure)',
  'needs-revision': 'var(--st-revision)',
};

export function Meter({ value, label, thin, color }: { value: number; label: string; thin?: boolean; color?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={`meter${thin ? ' meter-thin' : ''}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      style={{ ['--value' as string]: pct, ...(color ? { ['--meter-fill' as string]: color } : {}) }}
    >
      <span />
    </div>
  );
}

export function Ring({ value, label, size = 56, color }: { value: number; label: string; size?: number; color?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const r = 25;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ ['--size' as string]: `${size}px`, ...(color ? { ['--ring-fill' as string]: color } : {}) }} role="img" aria-label={`${label}: ${pct}%`}>
      <svg viewBox="0 0 60 60" aria-hidden="true">
        <circle className="track" cx="30" cy="30" r={r} />
        <circle className="fill" cx="30" cy="30" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <span className="ring-label" aria-hidden="true">
        {pct}%
      </span>
    </div>
  );
}

export function SubjectTile({ code, large }: { code: string; large?: boolean }) {
  const Icon = SUBJECT_ICONS[code] ?? SparkIcon;
  return (
    <span className={`subject-tile${large ? ' lg' : ''}`} data-subject={code} aria-hidden="true">
      <Icon />
    </span>
  );
}

export function Crumbs({ items }: { items: Array<{ href?: string; label: string }> }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs list">
        {items.map((it, i) => (
          <li key={i} className="row" style={{ ['--gap' as string]: '6px' }}>
            {i > 0 && <ChevronRightIcon />}
            {it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHead({
  title,
  lede,
  crumbs,
  actions,
  eyebrow,
  art,
}: {
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  /** A small spot illustration on the right (hidden on narrow phones). */
  art?: SpotName;
}) {
  const text = (
    <>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <div className="row row-between" style={{ alignItems: 'flex-start' }}>
        <h1 className="grow">{title}</h1>
        {actions}
      </div>
      {lede && <p className="lede">{lede}</p>}
    </>
  );
  return (
    <header className="page-head">
      {crumbs}
      {art ? (
        <div className="page-head-art">
          <div className="stack stack-sm grow">{text}</div>
          <Spot name={art} size={108} />
        </div>
      ) : (
        text
      )}
    </header>
  );
}

/** An empty state with a small illustration (or an icon), a title and what to do next. */
export function EmptyState({ icon, art, title, children }: { icon?: ReactNode; art?: SpotName; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      {art ? <Spot name={art} size={132} /> : icon ? <div className="empty-icon">{icon}</div> : null}
      <h2 className="h3" style={{ color: 'var(--text)' }}>
        {title}
      </h2>
      {children && <div className="stack stack-md" style={{ marginTop: 4, alignItems: 'center' }}>{children}</div>}
    </div>
  );
}

/** How a piece of content was produced and checked. Honest by construction. */
export function ProvenanceLabel({ provenance }: { provenance: Provenance }) {
  if (provenance.status === 'human-reviewed') {
    return (
      <span className="provenance" title={provenance.notes}>
        <ShieldIcon /> Teacher-reviewed{provenance.reviewedBy ? ` by ${provenance.reviewedBy}` : ''}
      </span>
    );
  }
  if (provenance.status === 'ai-checked') {
    return (
      <Link className="provenance" href="/about#content" title={provenance.notes}>
        <SparkIcon /> AI-drafted, independently checked · not yet teacher-reviewed
      </Link>
    );
  }
  return (
    <Link className="provenance" href="/about#content" style={{ color: 'var(--warn)' }} title={provenance.notes}>
      <AlertIcon /> Draft · not yet checked
    </Link>
  );
}

export function LevelBadge({ level }: { level: 'AS' | 'A' }) {
  return <span className={`badge${level === 'A' ? ' badge-accent' : ''}`}>{level === 'AS' ? 'AS Level' : 'A Level'}</span>;
}

export function SoonBadge({ phase }: { phase?: string }) {
  return <span className="badge soon">{phase ? `Planned · ${phase}` : 'Soon'}</span>;
}

/** Distribution of mastery states as a stacked bar with a legend. */
export function MasteryBar({ counts, total }: { counts: Partial<Record<MasteryState, number>>; total: number }) {
  const order: MasteryState[] = ['secure', 'practising', 'learning', 'needs-revision'];
  const started = order.reduce((s, k) => s + (counts[k] ?? 0), 0);
  return (
    <div className="stack stack-sm">
      <div className="stacked-meter" role="img" aria-label={order.map((k) => `${MASTERY_LABEL[k]}: ${counts[k] ?? 0}`).join(', ') + `, not started: ${total - started}`}>
        {order.map((k) =>
          counts[k] ? <span key={k} style={{ width: `${(100 * counts[k]!) / Math.max(1, total)}%`, background: STATE_COLOR[k] }} /> : null,
        )}
      </div>
      <div className="legend" aria-hidden="true">
        {order.map((k) => (
          <span key={k}>
            <i style={{ background: STATE_COLOR[k] }} />
            {MASTERY_LABEL[k]} {counts[k] ?? 0}
          </span>
        ))}
        <span>
          <i style={{ background: 'var(--surface-3)' }} />
          Not started {total - started}
        </span>
      </div>
    </div>
  );
}

export function pluralise(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
