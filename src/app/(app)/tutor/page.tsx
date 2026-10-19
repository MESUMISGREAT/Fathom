import type { Metadata } from 'next';
import Link from 'next/link';
import { Planned } from '@/components/Planned';

export const metadata: Metadata = { title: 'AI tutor' };

export default function TutorPage() {
  return (
    <Planned
      title="AI tutor"
      phase="Phase 3"
      lede="Ask questions, get hints, and upload a photo of your working for structured feedback."
      planned={[
        'Hints first: the tutor guides you through a problem rather than handing over the full solution, unless you ask for it.',
        'Photo feedback: you check and correct a transcript of your handwriting before anything is marked, so nothing unreadable gets guessed.',
        'Marks are estimates against an authorised mark scheme or a checked model answer, with the reasoning shown. They are never presented as an official Cambridge decision.',
        'Images are only processed after you agree, can be deleted at any time, and are never used to train AI models without your explicit permission.',
      ]}
      meanwhile={
        <p>
          Use <Link href="/search">Search</Link> to find the lesson for any syllabus objective, and the worked examples inside lessons to see methods
          step by step.
        </p>
      }
    />
  );
}
