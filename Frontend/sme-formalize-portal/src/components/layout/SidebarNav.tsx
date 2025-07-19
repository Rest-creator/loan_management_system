import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Award,
  Users,
  Settings,
  Building2,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../constants/AuthContext"; // Import useAuth hook
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock user role - in real app this would come from auth context
const currentUser = {
  role: "admin",
  office: "zimra",
};

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/applications", icon: FileText, label: "Applications" },
  { to: "/issued-documents", icon: Award, label: "Issued Documents" },
  { to: "/officers", icon: Users, label: "Officers" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const adminItems = [
  { to: "/admin/officer-requests", icon: UserCheck, label: "Officer Requests" },
];

const officeItems = [
  { to: "/offices/zimra", label: "ZIMRA" },
  { to: "/offices/chitungwiza_municipal", label: "Chitungwiza Municipal" },
  { to: "/offices/harare_council", label: "Harare Council" },
];

export const SidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth(); // Get user and isLoading from AuthContext

  console.log(user);

  useEffect(() => {
    // Only navigate if authentication is NOT loading AND user is null
    if (!isLoading && user === null) {
      console.log("User is null and not loading, navigating to /");
      navigate("/");
    }
  }, [user, isLoading, navigate]); // Add user, isLoading, and navigate to dependency array

   if (isLoading || user === null) {
        return null; // Or return a loading skeleton for the sidebar if desired
    }

  const userRole = user?.role || null; // Assuming your user object has a 'role' field
  const userOffice = user?.office || null; // Assuming your user object has an 'office' field

  // Filter navigation items based on role
  const filteredNavItems = navItems.filter((item) => {
    // Hide 'Applications' and 'Issued Documents' if the user is an admin
    if (
      userRole === "admin" &&
      (item.to === "/applications" || item.to === "/issued-documents")
    ) {
      return false; // Exclude these items for admin
    }
    return true; // Include all other items for all roles, or if not an admin
  });

  return (
    <nav className="bg-card border-r border-border w-64 h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Navigation
        </h2>

        <div className="space-y-2">
          {filteredNavItems.map((item) => (
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

        {user.role === "admin" && (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
};
