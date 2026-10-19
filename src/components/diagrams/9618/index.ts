import type { DiagramRegistry } from '../types';
import { BcdVsBinary } from './bcd-vs-binary';
import { BinaryPlaceValue } from './binary-place-value';
import { HexNibbles } from './hex-nibbles';
import { PrefixGap } from './prefix-gap';
import { TwosComplementWeights } from './twos-complement-weights';
import { TwosComplementWheel } from './twos-complement-wheel';

/** Diagrams for 9618 lessons. Keys are referenced from lesson YAML (`diagram: <key>`). */
export const diagrams: DiagramRegistry = {
  'cs-binary-place-value': BinaryPlaceValue,
  'cs-prefix-gap': PrefixGap,
  'cs-hex-nibbles': HexNibbles,
  'cs-bcd-vs-binary': BcdVsBinary,
  'cs-twos-complement-weights': TwosComplementWeights,
  'cs-twos-complement-wheel': TwosComplementWheel,
};
