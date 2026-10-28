/**
 * Validation versus verification (9618 6.2.1). The top row is the path data takes: source
 * document, typed into the system, stored. The two cards below separate the guards: validation
 * checks the value against rules without needing the source, verification compares the stored
 * value with the source. Two worked examples sit underneath.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-integrity-validation-vs-verification';

const W = 640;
const H = 328;
const BOX_Y = 40;
const BOX_H = 48;

export function ValidationVsVerificationDiagram() {
  return (
    <Svg width={W} height={H}>
      <rect x={14} y={BOX_Y} width={150} height={BOX_H} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={89} y={BOX_Y + 16} className="dg-text-small dg-bold">
        source document
      </Label>
      <Label x={89} y={BOX_Y + 33} className="dg-text-small">
        paper form
      </Label>

      <Arrow x1={168} y1={BOX_Y + BOX_H / 2} x2={214} y2={BOX_Y + BOX_H / 2} head={8} />
      <rect x={218} y={BOX_Y} width={166} height={BOX_H} rx={6} className="dg-fill-accent dg-thin" />
      <Label x={301} y={BOX_Y + 16} className="dg-text-small dg-bold">
        typed into the system
      </Label>
      <Label x={301} y={BOX_Y + 33} className="dg-text-small">
        one keystroke at a time
      </Label>

      <Arrow x1={388} y1={BOX_Y + BOX_H / 2} x2={434} y2={BOX_Y + BOX_H / 2} head={8} />
      <rect x={438} y={BOX_Y} width={188} height={BOX_H} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={532} y={BOX_Y + 16} className="dg-text-small dg-bold">
        stored record
      </Label>
      <Label x={532} y={BOX_Y + 33} className="dg-text-small">
        the database
      </Label>

      <rect x={14} y={110} width={296} height={104} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={162} y={128} className="dg-text dg-bold">
        validation
      </Label>
      <Label x={162} y={148} className="dg-text-small">
        is the value acceptable?
      </Label>
      <Label x={162} y={170} className="dg-text-small dg-text-muted">
        rules only: range, length, format,
      </Label>
      <Label x={162} y={186} className="dg-text-small dg-text-muted">
        presence, existence, limit, check digit
      </Label>
      <Label x={162} y={204} className="dg-text-small dg-text-accent">
        needs no source document
      </Label>

      <rect x={330} y={110} width={296} height={104} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={478} y={128} className="dg-text dg-bold">
        verification
      </Label>
      <Label x={478} y={148} className="dg-text-small">
        is it what the source said?
      </Label>
      <Label x={478} y={170} className="dg-text-small dg-text-muted">
        visual check, double entry,
      </Label>
      <Label x={478} y={186} className="dg-text-small dg-text-muted">
        parity and checksums after transfer
      </Label>
      <Label x={478} y={204} className="dg-text-small dg-text-accent-2">
        compares with the source
      </Label>

      <rect x={14} y={232} width={612} height={78} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={26} y={250} anchor="start" className="dg-text-small dg-bold">
        31/02/2000
      </Label>
      <Label x={118} y={250} anchor="start" className="dg-text-small">
        impossible date — validation rejects it before storage
      </Label>
      <Label x={26} y={278} anchor="start" className="dg-text-small dg-bold">
        04/03 for 03/04
      </Label>
      <Label x={176} y={278} anchor="start" className="dg-text-small">
        a real date, so validation passes — only verification catches it
      </Label>
      <Label x={26} y={300} anchor="start" className="dg-text-small dg-text-muted">
        neither guard can tell you that a faithfully copied value is true
      </Label>
    </Svg>
  );
}

export default ValidationVsVerificationDiagram;
