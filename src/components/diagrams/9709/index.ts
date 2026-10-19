import type { DiagramRegistry } from '../types';
import DiscriminantCases from './discriminant-cases';
import LineCircleIntersection from './line-circle-intersection';
import LineCurvePivot from './line-curve-pivot';
import QuadraticInequality from './quadratic-inequality';
import QuadraticVertex from './quadratic-vertex';

/** Diagrams for 9709 lessons. Keys are referenced from lesson YAML (`diagram: <key>`). */
export const diagrams: DiagramRegistry = {
  'quadratic-vertex': QuadraticVertex,
  'discriminant-cases': DiscriminantCases,
  'quadratic-inequality': QuadraticInequality,
  'line-circle-intersection': LineCircleIntersection,
  'line-curve-pivot': LineCurvePivot,
};
