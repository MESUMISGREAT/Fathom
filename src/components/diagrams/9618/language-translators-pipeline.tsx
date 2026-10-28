/**
 * What each translator takes in and produces: assembler and compiler produce
 * machine code that is saved, while an interpreter translates and executes as
 * it goes.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-language-translators-pipeline';

const W = 560;
const H = 348;
const BOX_H = 46;

const rows = [
  {
    y: 64,
    source: 'assembly\nlanguage',
    translator: 'assembler',
    output: 'machine code',
    note: 'saved, then executed',
  },
  {
    y: 156,
    source: 'high-level\nlanguage',
    translator: 'compiler',
    output: 'machine code',
    note: 'saved as an executable',
  },
  {
    y: 244,
    source: 'high-level\nlanguage',
    translator: 'interpreter',
    output: 'nothing saved',
    note: 'translated and run line by line',
  },
];

const BOX_W = 118;

export function LanguageTranslatorsPipeline() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Three translators, three outputs
      </Label>

      {rows.map((r) => (
        <g key={r.translator}>
          <rect x={34} y={r.y} width={BOX_W + 8} height={BOX_H} rx={6} className="dg-fill-muted dg-line" />
          {r.source.split('\n').map((line, i) => (
            <Label key={i} x={38 + BOX_W / 2} y={r.y + 16 + i * 16} className="dg-text-small dg-text">
              {line}
            </Label>
          ))}

          <Arrow x1={162} y1={r.y + BOX_H / 2} x2={196} y2={r.y + BOX_H / 2} head={8} className="dg-muted" headClassName="dg-dot" />

          <rect x={200} y={r.y} width={BOX_W} height={BOX_H} rx={6} className="dg-fill-accent dg-line" />
          <Label x={200 + BOX_W / 2} y={r.y + BOX_H / 2 + 1} className="dg-text-small dg-text dg-bold">
            {r.translator}
          </Label>

          <Arrow x1={320} y1={r.y + BOX_H / 2} x2={354} y2={r.y + BOX_H / 2} head={8} className="dg-muted" headClassName="dg-dot" />

          <rect x={358} y={r.y} width={BOX_W} height={BOX_H} rx={6} className="dg-fill-accent-2 dg-line" />
          <Label x={358 + BOX_W / 2} y={r.y + BOX_H / 2 + 1} className="dg-text-small dg-text">
            {r.output}
          </Label>

          <Label x={358 + BOX_W / 2} y={r.y + BOX_H + 15} className="dg-text-small dg-text-muted">
            {r.note}
          </Label>
        </g>
      ))}

      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">
        Why translate at all? The processor executes machine code only
      </Label>
    </Svg>
  );
}

export default LanguageTranslatorsPipeline;
