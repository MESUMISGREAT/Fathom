/**
 * Oxidation and reduction side by side: the species that loses electrons is oxidised and acts as
 * the reducing agent; the species that gains them is reduced and acts as the oxidising agent.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-redox-electron-transfer';

const W = 600;
const H = 380;
const PANEL_W = 230;
const PANEL_H = 170;

export function RedoxElectronTransfer() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Electron transfer: two halves of one reaction
      </Label>

      {/* oxidation panel */}
      <rect
        x={18}
        y={64}
        width={PANEL_W}
        height={PANEL_H}
        rx={10}
        className="dg-fill-accent-2"
        opacity={0.75}
      />
      <Label x={18 + PANEL_W / 2} y={90} className="dg-text-accent-2">
        OXIDATION
      </Label>
      <Label x={18 + PANEL_W / 2} y={116} className="dg-text-small">
        loses electrons
      </Label>
      <Label x={18 + PANEL_W / 2} y={138} className="dg-text-small">
        oxidation number increases
      </Label>
      <Label x={18 + PANEL_W / 2} y={160} className="dg-text-small">
        substance is the
      </Label>
      <Label x={18 + PANEL_W / 2} y={180} className="dg-text-accent-2">
        reducing agent
      </Label>
      <MathLabel
        x={18 + PANEL_W / 2}
        y={212}
        tex="\text{Zn} \rightarrow \text{Zn}^{2+} + 2e^-"
        w={210}
        h={28}
        size="small"
        tone="accent-2"
      />

      {/* reduction panel */}
      <rect
        x={W - 18 - PANEL_W}
        y={64}
        width={PANEL_W}
        height={PANEL_H}
        rx={10}
        className="dg-fill-accent"
        opacity={0.75}
      />
      <Label x={W - 18 - PANEL_W / 2} y={90} className="dg-text-accent">
        REDUCTION
      </Label>
      <Label x={W - 18 - PANEL_W / 2} y={116} className="dg-text-small">
        gains electrons
      </Label>
      <Label x={W - 18 - PANEL_W / 2} y={138} className="dg-text-small">
        oxidation number decreases
      </Label>
      <Label x={W - 18 - PANEL_W / 2} y={160} className="dg-text-small">
        substance is the
      </Label>
      <Label x={W - 18 - PANEL_W / 2} y={180} className="dg-text-accent">
        oxidising agent
      </Label>
      <MathLabel
        x={W - 18 - PANEL_W / 2}
        y={212}
        tex="\text{Cu}^{2+} + 2e^- \rightarrow \text{Cu}"
        w={210}
        h={28}
        size="small"
        tone="accent"
      />

      {/* electron arrow */}
      <Arrow x1={18 + PANEL_W + 8} y1={150} x2={W - 18 - PANEL_W - 8} y2={150} />
      <MathLabel x={W / 2} y={118} tex="2e^-" w={60} h={26} size="small" tone="muted" />
      <Label x={W / 2} y={270} className="dg-text-small dg-text-muted">
        The two changes always happen together: that is a redox reaction.
      </Label>
      <MathLabel
        x={W / 2}
        y={310}
        tex="\text{Zn} + \text{Cu}^{2+} \rightarrow \text{Zn}^{2+} + \text{Cu}"
        w={340}
        h={30}
        size="small"
      />
    </Svg>
  );
}

export default RedoxElectronTransfer;
