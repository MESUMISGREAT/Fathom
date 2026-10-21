import { AppShell } from '@/components/shell/AppShell';
import { getSessionUser } from '@/server/auth/session';
import { countDue } from '@/server/queries/review';
import { getPointsSummary } from '@/server/queries/points';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const [dueCount, summary] = user
    ? await Promise.all([countDue(user.id), user.showPoints !== false ? getPointsSummary(user.id) : null])
    : [0, null];
  return (
    <AppShell user={user} dueCount={dueCount} summary={summary}>
      {children}
    </AppShell>
  );
}
