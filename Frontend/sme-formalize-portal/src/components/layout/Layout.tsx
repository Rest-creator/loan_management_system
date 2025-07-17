import { Outlet, useLocation } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { SidebarNav } from './SidebarNav';

export const Layout = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/login' || location.pathname === '/request-account';

  if (isPublicPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <div className="flex h-[calc(100vh-4rem)]">
        <SidebarNav />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};