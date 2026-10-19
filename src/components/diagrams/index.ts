import type { DiagramRegistry } from './types';
import { diagrams as maths } from './9709';
import { diagrams as computing } from './9618';
import { diagrams as physics } from './9702';
import { diagrams as chemistry } from './9701';

export const diagrams: DiagramRegistry = { ...maths, ...computing, ...physics, ...chemistry };
