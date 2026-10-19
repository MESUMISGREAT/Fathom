'use client';
import { createContext } from 'react';
import type { Outcome } from '@/domain/answers/check';

/** Lets questions inside a lesson tell the player they've been answered. */
export const LessonCheckContext = createContext<{ report: (questionId: string, outcome: Outcome) => void } | null>(null);
