import type { MgbosRole } from '@mgbos/auth';
import { requireAuth } from '@/lib/session.server';
import {
  AppHeader,
  AppSidebar,
  NAVIGATION_GROUPS,
  filterNavGroupsForSession,
} from '@/components/app-shell';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  const visibleNavGroups = filterNavGroupsForSession(
    NAVIGATION_GROUPS,
    session.role.code as MgbosRole,
    session.activeBrand.code,
  );

  return (
    <div className="shell-wrapper">
      <AppHeader session={session} />
      <div className="shell-body">
        <AppSidebar groups={visibleNavGroups} />
        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}
