'use client';
import { createContext } from 'react';
import type { Outcome } from '@/domain/answers/check';
import type { PointsResult } from '@/domain/points';

/** Lets questions inside a lesson tell the player they've been answered (and what the server awarded). */
export const LessonCheckContext = createContext<{ report: (questionId: string, outcome: Outcome, points: PointsResult | null) => void } | null>(null);
