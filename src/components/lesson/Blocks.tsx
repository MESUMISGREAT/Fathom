/**
 * Server-rendered lesson blocks. HTML comes from the content importer, which
 * renders markdown with raw HTML disabled, so it is safe to inject.
 */
import type { RenderedBlock } from '@/content/rendered';
import { diagrams } from '@/components/diagrams';
import { AlertIcon, BulbIcon, CheckIcon, ChevronRightIcon, FlagIcon, SparkIcon, TargetIcon, XIcon, BookIcon } from '@/components/icons';
import { WorkedExample } from './WorkedExample';

const Html = ({ html, className = 'prose' }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

export function BlockView({ block }: { block: Exclude<RenderedBlock, { type: 'check' }> }) {
  switch (block.type) {
    case 'objective':
      return (
        <div className="callout callout-objective">
          <div className="callout-label">
            <TargetIcon /> By the end of this lesson
          </div>
          <Html html={block.html} />
        </div>
      );
    case 'explain':
      return (
        <section className="stack stack-sm">
          {block.title && <h2 className="block-title">{block.title}</h2>}
          <Html html={block.html} />
        </section>
      );
    case 'definition':
      return (
        <div className="callout callout-definition">
          <div className="callout-label">
            <BookIcon /> Definition
          </div>
          <p className="definition-term">{block.term}</p>
          <Html html={block.html} />
        </div>
      );
    case 'intuition':
      return (
        <div className="callout callout-intuition">
          <div className="callout-label">
            <BulbIcon /> {block.title ?? 'Why it works'}
          </div>
          <Html html={block.html} />
        </div>
      );
    case 'example':
      return <WorkedExample title={block.title} problemHtml={block.problemHtml} stepsHtml={block.stepsHtml} answerHtml={block.answerHtml} />;
    case 'diagram': {
      const D = diagrams[block.diagram];
      return (
        <figure className="diagram">
          <div role="img" aria-label={block.alt}>
            {D ? <D /> : <p className="small faint">Diagram unavailable.</p>}
          </div>
          {block.captionHtml && <figcaption dangerouslySetInnerHTML={{ __html: block.captionHtml }} />}
        </figure>
      );
    }
    case 'misconceptions':
      return (
        <section className="stack stack-sm" aria-label="Common mistakes">
          <h2 className="block-title row" style={{ ['--gap' as string]: '8px' }}>
            <AlertIcon width={20} height={20} style={{ color: 'var(--warn)' }} /> Common mistakes
          </h2>
          <div>
            {block.items.map((m, i) => (
              <div key={i} className="misconception">
                <div className="mc-line mc-wrong">
                  <XIcon aria-label="Mistake" />
                  <Html html={m.wrongHtml} />
                </div>
                <div className="mc-line mc-right">
                  <CheckIcon aria-label="Instead" />
                  <Html html={m.rightHtml} />
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'exam':
      return (
        <div className="callout callout-exam">
          <div className="callout-label">
            <FlagIcon /> In the exam
          </div>
          <Html html={block.html} />
        </div>
      );
    case 'takeaways':
      return (
        <div className="callout callout-takeaways">
          <div className="callout-label">
            <CheckIcon /> Key takeaways
          </div>
          <ul className="takeaways prose">
            {block.itemsHtml.map((h, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: h }} />
            ))}
          </ul>
        </div>
      );
    case 'deeper':
      return (
        <details className="disclosure">
          <summary>
            <ChevronRightIcon /> Go deeper: {block.title}
          </summary>
          <div className="disclosure-body">
            <Html html={block.html} />
          </div>
        </details>
      );
    case 'enrichment':
      return (
        <details className="disclosure">
          <summary>
            <SparkIcon /> {block.title} <span className="badge" style={{ marginLeft: 'auto' }}>Not examinable</span>
          </summary>
          <div className="disclosure-body">
            <p className="tiny faint" style={{ marginBottom: 8 }}>
              Beyond the syllabus. Interesting, but you won&rsquo;t be asked about it.
            </p>
            <Html html={block.html} />
          </div>
        </details>
      );
  }
}
