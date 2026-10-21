'use client';
import { useEffect } from 'react';
import { setTimeZone } from '@/server/actions/settings';

let sent = false;

/**
 * XP and days studied count towards the student's local day, so the server
 * needs their time zone. Sends the browser's zone once, only when it differs
 * from the one stored.
 */
export function TimeZoneSync({ stored }: { stored: string }) {
  useEffect(() => {
    if (sent) return;
    let zone = '';
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    } catch {
      return;
    }
    if (!zone || zone === stored) return;
    sent = true;
    void setTimeZone(zone);
  }, [stored]);
  return null;
}
