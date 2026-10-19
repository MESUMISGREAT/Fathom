import type { DiagramRegistry } from '../types';
import { BeamsInElectricField } from './beams-electric-field';
import { ElectronsInBoxes } from './electrons-in-boxes';
import { FirstIonisationEnergyTrend } from './first-ionisation-energy-trend';
import { OrbitalShapes } from './orbital-shapes';
import { SubshellEnergyLevels } from './subshell-energy-levels';
import { SuccessiveIonisationSodium } from './successive-ionisation-sodium';

/** Diagrams for 9701 lessons. Keys are referenced from lesson YAML (`diagram: <key>`). */
export const diagrams: DiagramRegistry = {
  'chem-beams-electric-field': BeamsInElectricField,
  'chem-subshell-energy-levels': SubshellEnergyLevels,
  'chem-orbital-shapes': OrbitalShapes,
  'chem-electrons-in-boxes': ElectronsInBoxes,
  'chem-first-ionisation-energy-trend': FirstIonisationEnergyTrend,
  'chem-successive-ionisation-sodium': SuccessiveIonisationSodium,
};
