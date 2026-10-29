/**
 * Diagram for 9618 9.2 Algorithms: Structure chart (hierarchy chart).
 * Shows top-down decomposition of a problem into modules.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-algorithms-structure-chart';

const W = 760;
const H = 500;

function ModuleBox({
  x,
  y,
  w,
  h,
  title,
  subtitle,
  colorClass = 'dg-fill-accent',
  textClass = 'dg-text-accent',
  isLibrary = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  colorClass?: string;
  textClass?: string;
  isLibrary?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className={colorClass} />
      {isLibrary && <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={4} className="dg-fill-muted dg-thin" />}
      <Label x={x + w / 2} y={y + 20} anchor="middle" className={textClass}>{title}</Label>
      {subtitle && <Label x={x + w / 2} y={y + 40} anchor="middle" className="dg-text-small dg-muted">{subtitle}</Label>}
    </g>
  );
}

function ArrowDown({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) {
  return (
    <g>
      <Arrow x1={x1} y1={y1} x2={x2} y2={y2} head={8} className="dg-line" />
      {label && <Label x={(x1 + x2) / 2 + 10} y={(y1 + y2) / 2} anchor="start" className="dg-text-small dg-bold dg-accent">{label}</Label>}
    </g>
  );
}

export function AlgorithmsStructureChart() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={25} className="dg-text dg-bold" anchor="middle">
        Structure Chart: Process Student Grades
      </Label>

      {/* Level 0: Main module */}
      <ModuleBox x={300} y={50} w={160} h={50} title="processGrades()" subtitle="Main control module" colorClass="dg-fill-muted" textClass="dg-text" />

      {/* Level 1: Three main sub-modules */}
      <ArrowDown x1={380} y1={100} x2={160} y2={150} label="calls" />
      <ArrowDown x1={380} y1={100} x2={380} y2={150} />
      <ArrowDown x1={380} y1={100} x2={600} y2={150} label="calls" />

      <ModuleBox x={40} y={150} w={240} h={50} title="inputStudentData()" subtitle="Read name, ID, 5 marks" />
      <ModuleBox x={260} y={150} w={240} h={50} title="calculateResults()" subtitle="Avg, grade, pass/fail" colorClass="dg-fill-accent-2" textClass="dg-text-accent-2" />
      <ModuleBox x={520} y={150} w={200} h={50} title="outputReport()" subtitle="Display/print results" />

      {/* Level 2: calculateResults breakdown */}
      <ArrowDown x1={380} y1={200} x2={300} y2={260} />
      <ArrowDown x1={380} y1={200} x2={380} y2={260} />
      <ArrowDown x1={380} y1={200} x2={460} y2={260} />

      <ModuleBox x={200} y={260} w={200} h={50} title="computeAverage()" subtitle="Sum marks ÷ 5" colorClass="dg-fill-accent-2" textClass="dg-text-accent-2" />
      <ModuleBox x={280} y={260} w={200} h={50} title="determineGrade()" subtitle="A*/A/B/C/D/E/U" colorClass="dg-fill-accent-2" textClass="dg-text-accent-2" />
      <ModuleBox x={360} y={260} w={200} h={50} title="checkPassFail()" subtitle="Average ≥ 50?" colorClass="dg-fill-accent-2" textClass="dg-text-accent-2" />

      {/* Level 3: determineGrade breakdown */}
      <ArrowDown x1={380} y1={310} x2={300} y2={370} />
      <ArrowDown x1={380} y1={310} x2={460} y2={370} />

      <ModuleBox x={200} y={370} w={200} h={50} title="lookupBoundaries()" subtitle="Grade boundary table" isLibrary={true} colorClass="dg-fill-muted" textClass="dg-text" />
      <ModuleBox x={360} y={370} w={200} h={50} title="compareToBoundaries()" subtitle="Binary search / linear" colorClass="dg-fill-accent" textClass="dg-text-accent" />

      {/* Level 2: inputStudentData breakdown */}
      <ArrowDown x1={160} y1={200} x2={160} y2={260} />
      <ArrowDown x1={160} y1={200} x2={40} y2={260} />

      <ModuleBox x={-20} y={260} w={200} h={50} title="validateMarks()" subtitle="Each 0–100" colorClass="dg-fill-accent" textClass="dg-text-accent" />
      <ModuleBox x={60} y={260} w={200} h={50} title="readStudentInfo()" subtitle="Name, ID" />

      {/* Level 2: outputReport breakdown */}
      <ArrowDown x1={620} y1={200} x2={540} y2={260} />
      <ArrowDown x1={620} y1={200} x2={620} y2={260} />

      <ModuleBox x={440} y={260} w={200} h={50} title="formatScreenOutput()" subtitle="Formatted display" />
      <ModuleBox x={520} y={260} w={200} h={50} title="writeToFile()" subtitle="CSV / text export" isLibrary={true} colorClass="dg-fill-muted" textClass="dg-text" />

      {/* Legend / annotations */}
      <g transform="translate(20, 440)">
        <Label x={0} y={0} className="dg-text dg-bold">Key</Label>
        <rect x={0} y={20} width={20} height={20} rx={4} className="dg-fill-muted dg-thin" />
        <Label x={30} y={35} anchor="start" className="dg-text-small">Main / control module</Label>
        <rect x={0} y={50} width={20} height={20} rx={4} className="dg-fill-accent dg-accent" />
        <Label x={30} y={65} anchor="start" className="dg-text-small">Processing module</Label>
        <rect x={0} y={80} width={20} height={20} rx={4} className="dg-fill-accent-2 dg-accent-2" />
        <Label x={30} y={95} anchor="start" className="dg-text-small">Calculation module</Label>
        <rect x={200} y={20} width={20} height={20} rx={4} className="dg-fill-muted dg-thin" />
        <rect x={204} y={24} width={12} height={12} rx={2} className="dg-fill-muted dg-thin" />
        <Label x={230} y={35} anchor="start" className="dg-text-small">Library / predefined module</Label>
        <Arrow x1={450} y1={30} x2={520} y2={30} head={8} className="dg-line" />
        <Label x={530} y={35} anchor="start" className="dg-text-small">Call / data flow (arrow)</Label>
      </g>

      {/* Level labels */}
      <Label x={20} y={75} anchor="end" className="dg-text-small dg-muted">Level 0</Label>
      <Label x={20} y={175} anchor="end" className="dg-text-small dg-muted">Level 1</Label>
      <Label x={20} y={285} anchor="end" className="dg-text-small dg-muted">Level 2</Label>
      <Label x={20} y={395} anchor="end" className="dg-text-small dg-muted">Level 3</Label>
    </Svg>
  );
}

export default AlgorithmsStructureChart;