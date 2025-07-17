import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Award, 
  Users, 
  Settings, 
  Building2,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock user role - in real app this would come from auth context
const currentUser = {
  role: 'admin', // or 'officer'
  office: 'zimra'
};

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/applications', icon: FileText, label: 'Applications' },
  { to: '/issued-documents', icon: Award, label: 'Issued Documents' },
  { to: '/officers', icon: Users, label: 'Officers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const adminItems = [
  { to: '/admin/officer-requests', icon: UserCheck, label: 'Officer Requests' },
];

const officeItems = [
  { to: '/offices/zimra', label: 'ZIMRA' },
  { to: '/offices/companies_registry', label: 'Chitungwiza Municipal' },
  { to: '/offices/harare_council', label: 'Harare Council' },
  { to: '/offices/nssa', label: 'NSSA' },
  { to: '/offices/ministry_smes', label: 'Ministry SMEs' },
];

export const SidebarNav = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-r border-border w-64 h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Navigation</h2>
        
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {currentUser.role === 'admin' && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Administration
            </h3>
            <div className="space-y-2">
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Offices
          </h3>
          <div className="space-y-1">
            {officeItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "block px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};