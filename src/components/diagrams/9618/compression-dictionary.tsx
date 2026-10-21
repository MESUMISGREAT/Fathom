/**
 * Dictionary-based compression of the tongue twister "how much wood would a
 * woodchuck chuck if a woodchuck could chuck wood". Each word is a chip with
 * its dictionary index underneath; words that occur more than once (wood, a,
 * woodchuck, chuck) are highlighted. The dictionary on the right lists the nine
 * different words with indexes 1-9, and the encoded text at the bottom is
 * 1 2 3 4 5 6 7 8 5 6 9 7 3.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-dictionary';

const W = 620;
const H = 316;
const SENTENCE = 'how much wood would a woodchuck chuck if a woodchuck could chuck wood';
const CH = 8.4; // width of one 14px monospace character
const PAD = 12;
const GAP = 7;
const X0 = 16;

const words = SENTENCE.split(' ');
const dict: string[] = [];
for (const w of words) if (!dict.includes(w)) dict.push(w);
const count = (w: string) => words.filter((x) => x === w).length;

const LINES = [words.slice(0, 7), words.slice(7)];

export function CompressionDictionary() {
  const DX = 440;
  const DY = 58;
  const ROW = 21;
  let wordIndex = 0;
  return (
    <Svg width={W} height={H}>
      <Label x={X0} y={22} anchor="start" className="dg-text dg-bold">
        Original text (69 characters)
      </Label>
      {LINES.map((line, li) => {
        let x = X0;
        const y = 46 + li * 74;
        return (
          <g key={li}>
            {line.map((w) => {
              const wd = w.length * CH + PAD;
              const repeated = count(w) > 1;
              const el = (
                <g key={wordIndex}>
                  <rect
                    x={x}
                    y={y}
                    width={wd}
                    height={30}
                    rx={5}
                    className={repeated ? 'dg-fill-accent dg-accent' : 'dg-fill-muted dg-thin'}
                  />
                  <Label x={x + wd / 2} y={y + 15} className="dg-text dg-mono">
                    {w}
                  </Label>
                  <Label x={x + wd / 2} y={y + 44} className={repeated ? 'dg-text-accent dg-mono' : 'dg-text dg-mono'}>
                    {dict.indexOf(w) + 1}
                  </Label>
                </g>
              );
              x += wd + GAP;
              wordIndex++;
              return el;
            })}
          </g>
        );
      })}

      {/* dictionary */}
      <Label x={DX} y={22} anchor="start" className="dg-text dg-bold">
        Dictionary
      </Label>
      <rect x={DX} y={DY - 16} width={164} height={dict.length * ROW + 24} className="dg-fill-surface dg-thin" />
      <Label x={DX + 24} y={DY - 4} className="dg-text-small dg-text-muted">
        index
      </Label>
      <Label x={DX + 60} y={DY - 4} anchor="start" className="dg-text-small dg-text-muted">
        word
      </Label>
      <line x1={DX + 48} y1={DY - 16} x2={DX + 48} y2={DY + dict.length * ROW + 8} className="dg-grid" />
      {dict.map((w, i) => (
        <g key={w}>
          <Label x={DX + 24} y={DY + 16 + i * ROW} className={count(w) > 1 ? 'dg-text-accent dg-mono' : 'dg-text dg-mono'}>
            {i + 1}
          </Label>
          <Label x={DX + 60} y={DY + 16 + i * ROW} anchor="start" className="dg-text dg-mono">
            {w}
          </Label>
        </g>
      ))}

      {/* encoded result */}
      <Label x={X0} y={218} anchor="start" className="dg-text dg-bold">
        Encoded text (13 references)
      </Label>
      <Label x={X0} y={246} anchor="start" className="dg-text-accent dg-mono">
        {words.map((w) => dict.indexOf(w) + 1).join(' ')}
      </Label>
      <Label x={X0} y={284} anchor="start" className="dg-text-small dg-text-muted">
        highlighted words appear more than once: each repeat costs one index, not the whole word
      </Label>
    </Svg>
  );
}

export default CompressionDictionary;
