import { AppShell } from '@/components/shell/AppShell';
import { getSessionUser } from '@/server/auth/session';
import { countDue } from '@/server/queries/review';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const dueCount = user ? await countDue(user.id) : 0;
  return (
    <AppShell user={user} dueCount={dueCount}>
      {children}
    </AppShell>
  );
}
