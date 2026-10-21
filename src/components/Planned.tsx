import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageHead } from '@/components/ui';

/** A page for a feature that is designed but not built yet. Says so plainly. */
export function Planned({ title, phase, lede, planned, meanwhile }: { title: string; phase: string; lede: string; planned: ReactNode[]; meanwhile: ReactNode }) {
  return (
    <div className="container-narrow stack stack-lg">
      <PageHead title={title} lede={lede} eyebrow={<span className="badge badge-warn">Not built yet · {phase}</span>} />
      <section className="card card-pad stack" aria-labelledby="planned">
        <h2 id="planned" className="h3">
          What&rsquo;s planned
        </h2>
        <ul className="prose small" style={{ margin: 0 }}>
          {planned.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>
      <section className="panel panel-lavender stack stack-sm" aria-labelledby="meanwhile">
        <h2 id="meanwhile" className="h3">
          What you can do now
        </h2>
        <div className="small muted">{meanwhile}</div>
      </section>
      <p className="tiny muted">
        Design notes for this feature are in the project plan. <Link href="/about#roadmap">See the roadmap</Link>
      </p>
    </div>
  );
}
