import type { Metadata } from 'next';
import Link from 'next/link';
import { Planned } from '@/components/Planned';

export const metadata: Metadata = { title: 'Exam practice' };

export default function PracticePage() {
  return (
    <Planned
      title="Exam practice"
      phase="Phase 2"
      lede="Cambridge-style, multi-part questions with mark schemes, timed practice and full-paper simulations."
      planned={[
        'A question bank of original, clearly labelled Cambridge-style questions, tagged by syllabus objective, difficulty, marks and skills.',
        'Multi-part questions (a), (b), (c) with method and accuracy marks, and examiner-style explanations of how marks are awarded.',
        'Subject-specific answers: maths working, units and significant figures, chemical equations, pseudocode and trace tables.',
        'Optional timed practice and full-paper simulations. Timers only appear when you start one.',
        'Past-paper questions only where Cambridge has given permission, labelled as such.',
      ]}
      meanwhile={
        <p>
          Every lesson has quick checks that are marked instantly, and anything you&rsquo;ve answered comes back in <Link href="/review">Review</Link>{' '}
          at spaced intervals.
        </p>
      }
    />
  );
}
