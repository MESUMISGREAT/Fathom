import type { ComponentType } from 'react';

/**
 * A diagram is a prop-less React component that renders a single <svg>.
 * The lesson supplies the accessible description (alt) and caption, so the
 * svg itself should be aria-hidden. Use the dg-* classes (see globals.css) for
 * strokes and fills so diagrams follow light and dark mode automatically.
 */
export type Diagram = ComponentType;
export type DiagramRegistry = Record<string, Diagram>;
