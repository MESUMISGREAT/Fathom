'use client';
import { useState, useTransition } from 'react';
import { toggleBookmark } from '@/server/actions/study';
import { BookmarkFilledIcon, BookmarkIcon } from '@/components/icons';

export function BookmarkButton({ kind, targetId, initial, label }: { kind: 'lesson' | 'question'; targetId: string; initial: boolean; label: string }) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={on}
      aria-label={on ? `${label} (saved)` : label}
      title={on ? 'Saved. Click to remove' : label}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setOn((v) => !v); // optimistic
          const r = await toggleBookmark({ kind, targetId });
          setOn(r.bookmarked);
        })
      }
    >
      {on ? <BookmarkFilledIcon /> : <BookmarkIcon />}
    </button>
  );
}
