import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  Home,
  DollarSign,
  TrendingUp,
  UserCheck,
  Calculator,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.png";
import icon from "../../assets/icon.png";

const adminItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  {
    title: "Loan Applications",
    url: "/admin/loan-applications",
    icon: FileText,
  },
  { title: "Clients", url: "/admin/clients", icon: Users },
  { title: "Agents", url: "/admin/agents", icon: Users },
  { title: "Repayments", url: "/admin/repayments", icon: DollarSign },
  {
    title: "Performance Tracking",
    url: "/admin/performance",
    icon: TrendingUp,
  },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Audit Trails", url: "/admin/audit", icon: UserCheck },
  { title: "Register Client", url: "/admin/register", icon: UserCheck },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const agentItems = [
  { title: "Dashboard", url: "/agent/dashboard", icon: Home },
  {
    title: "Loan Applications",
    url: "/agent/loan-applications",
    icon: FileText,
  },
  { title: "Clients", url: "/agent/clients", icon: Users },
  { title: "Repayments", url: "/agent/repayments", icon: DollarSign },
  { title: "Reports", url: "/agent/reports", icon: BarChart3 },
  { title: "Loan Calculator", url: "/agent/calculator", icon: Calculator },
  { title: "Register Client", url: "/agent/register", icon: UserCheck },
  { title: "Settings", url: "/agent/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const items = user?.role === "admin" ? adminItems : agentItems;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-accent text-foreground";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-1">
          {isCollapsed ? (
            <div className=" pr-4 items-center justify-center flex-shrink-0 ">
              <img src={icon} className="w-8 h-8 object-fit" />
            </div>
          ) : (
            <img src={logo} className="w-100 h-16 object-fit " />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed &&
              (user?.role === "admin" ? "Admin Panel" : "Agent Panel")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">{user?.name}</p>
              <p>{user?.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
