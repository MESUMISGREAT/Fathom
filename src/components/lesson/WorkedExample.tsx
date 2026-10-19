'use client';
import { useState } from 'react';

/** A worked example whose steps are revealed one at a time, so students can try each step first. */
export function WorkedExample({
  title,
  problemHtml,
  stepsHtml,
  answerHtml,
}: {
  title?: string;
  problemHtml: string;
  stepsHtml: string[];
  answerHtml?: string;
}) {
  const [shown, setShown] = useState(0);
  const all = shown >= stepsHtml.length;
  return (
    <section className="example" aria-label={title ? `Worked example: ${title}` : 'Worked example'}>
      <div className="example-head">
        <p className="eyebrow" style={{ marginBottom: 4 }}>
          Worked example{title ? `: ${title}` : ''}
        </p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: problemHtml }} />
      </div>
      {shown > 0 && (
        <ol className="example-steps" aria-live="polite">
          {stepsHtml.slice(0, shown).map((h, i) => (
            <li key={i} className="prose" dangerouslySetInnerHTML={{ __html: h }} />
          ))}
        </ol>
      )}
      {all && answerHtml && <div className="example-answer prose" dangerouslySetInnerHTML={{ __html: answerHtml }} />}
      {!all && (
        <div className="example-foot" style={{ paddingTop: shown === 0 ? 16 : 0 }}>
          <button type="button" className="btn btn-sm" onClick={() => setShown((n) => n + 1)}>
            {shown === 0 ? 'Show step 1' : `Next step (${shown + 1} of ${stepsHtml.length})`}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShown(stepsHtml.length)}>
            Show all steps
          </button>
          {shown === 0 && <span className="tiny faint" style={{ alignSelf: 'center' }}>Have a go first?</span>}
        </div>
      )}
    </section>
  );
}
