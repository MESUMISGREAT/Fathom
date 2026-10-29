/**
 * The parts of an IDE window: an editor with a breakpoint and an error marker,
 * a suggestions panel, a watch panel, and a report window.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-language-translators-ide-layout';

const W = 580;
const H = 330;

const LINES = [
  'DECLARE Count : INTEGER',
  'Count <- 0',
  'FOR i <- 1 TO 3',
  '  Count <- Count + i',
  'NEXT',
];

export function LanguageTranslatorsIdeLayout() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        One window, four kinds of feature
      </Label>

      <rect x={20} y={42} width={540} height={254} rx={8} className="dg-fill-muted dg-line" />

      <rect x={32} y={54} width={332} height={158} rx={5} className="dg-fill-accent dg-thin" />
      <Label x={40} y={70} anchor="start" className="dg-text-small dg-text-muted">
        editor
      </Label>

      {LINES.map((line, i) => (
        <g key={i}>
          <Label x={44} y={92 + i * 22} anchor="start" className="dg-text-small dg-text-muted">
            {i + 1}
          </Label>
          <Label x={68} y={92 + i * 22} anchor="start" className="dg-text-small dg-text">
            {line}
          </Label>
        </g>
      ))}

      <circle cx={60} cy={92 + 2 * 22} r={4} className="dg-dot-accent" />
      <Label x={352} y={92 + 2 * 22} anchor="end" className="dg-text-small dg-text-accent">
        breakpoint
      </Label>
      <circle cx={60} cy={92 + 4 * 22} r={4} className="dg-dot-accent-2" />
      <Label x={352} y={92 + 4 * 22} anchor="end" className="dg-text-small dg-text-accent-2">
        error marker on NEXT
      </Label>

      <rect x={374} y={54} width={174} height={74} rx={5} className="dg-fill-accent-2 dg-thin" />
      <Label x={382} y={70} anchor="start" className="dg-text-small dg-text-muted">
        suggestions
      </Label>
      <Label x={382} y={90} anchor="start" className="dg-text-small dg-text">
        Count
      </Label>
      <Label x={382} y={108} anchor="start" className="dg-text-small dg-text">
        CountTotal
      </Label>

      <rect x={374} y={138} width={174} height={74} rx={5} className="dg-fill-accent-2 dg-thin" />
      <Label x={382} y={154} anchor="start" className="dg-text-small dg-text-muted">
        watch
      </Label>
      <Label x={382} y={174} anchor="start" className="dg-text-small dg-text">
        Count = 3
      </Label>
      <Label x={382} y={192} anchor="start" className="dg-text-small dg-text">
        i = 2
      </Label>

      <rect x={32} y={220} width={516} height={66} rx={5} className="dg-fill-muted dg-thin" />
      <Label x={40} y={236} anchor="start" className="dg-text-small dg-text-muted">
        report window
      </Label>
      <Label x={40} y={256} anchor="start" className="dg-text-small dg-text">
        Program paused at line 3
      </Label>
      <Label x={40} y={274} anchor="start" className="dg-text-small dg-text-muted">
        step: next line, or continue to the next breakpoint
      </Label>
    </Svg>
  );
}

export default LanguageTranslatorsIdeLayout;
