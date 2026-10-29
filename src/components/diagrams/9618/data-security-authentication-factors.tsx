/**
 * The three factors of authentication (9618 6.1.3). Something you know, something you have and
 * something you are, each with three examples. Multi-factor authentication needs two factors from
 * different columns, which the band at the bottom shows.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-security-authentication-factors';

const W = 640;
const H = 286;
const CARD_W = 196;
const GAP = 14;
const LEFT = 12;
const TOP = 14;
const CARD_H = 196;

type Card = { title: string; examples: string[] };

const cards: Card[] = [
  { title: 'Something you know', examples: ['password', 'PIN', 'security question'] },
  { title: 'Something you have', examples: ['phone + one-time code', 'smart card', 'hardware token'] },
  { title: 'Something you are', examples: ['fingerprint', 'iris scan', 'face recognition'] },
];

export function AuthenticationFactorsDiagram() {
  return (
    <Svg width={W} height={H}>
      {cards.map((card, i) => {
        const x0 = LEFT + i * (CARD_W + GAP);
        const cx = x0 + CARD_W / 2;
        return (
          <g key={card.title}>
            <rect x={x0} y={TOP} width={CARD_W} height={CARD_H} rx={6} className="dg-fill-surface dg-thin" />
            <rect x={x0} y={TOP} width={CARD_W} height={30} rx={6} className="dg-fill-accent dg-thin" />
            <Label x={cx} y={TOP + 15} className="dg-text dg-bold">
              {card.title}
            </Label>
            {card.examples.map((ex, ei) => (
              <Label key={ex} x={cx} y={TOP + 62 + ei * 38} className="dg-text-small">
                {ex}
              </Label>
            ))}
            <Arrow x1={cx} y1={TOP + CARD_H + 2} x2={cx} y2={TOP + CARD_H + 18} head={7} />
          </g>
        );
      })}
      <rect x={LEFT} y={TOP + CARD_H + 22} width={W - 2 * LEFT} height={44} rx={6} className="dg-fill-accent-2 dg-thin" />
      <Label x={W / 2} y={TOP + CARD_H + 36} className="dg-text dg-bold">
        multi-factor authentication
      </Label>
      <Label x={W / 2} y={TOP + CARD_H + 54} className="dg-text-small">
        any two factors from different columns, such as a password plus a phone code
      </Label>
    </Svg>
  );
}

export default AuthenticationFactorsDiagram;
