import type { DiagramRegistry } from '../types';
import { AccuracyPrecision } from './accuracy-precision';
import { ErrorGraphs } from './error-graphs';
import { PrefixLadder } from './prefix-ladder';
import { VectorComponents } from './vector-components';
import { VectorTriangle } from './vector-triangle';

/** Diagrams for 9702 lessons. Keys are referenced from lesson YAML (`diagram: <key>`). */
export const diagrams: DiagramRegistry = {
  'phys-prefix-ladder': PrefixLadder,
  'phys-error-graphs': ErrorGraphs,
  'phys-accuracy-precision': AccuracyPrecision,
  'phys-vector-triangle': VectorTriangle,
  'phys-vector-components': VectorComponents,
};
