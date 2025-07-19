import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle,
  Timer,
  Bell,
  TrendingUp,
  Users,
  Calendar,
  BarChart,
  Building,
  Loader2,
  Building2, // Added Building2 for consistency if office.logo is null
} from "lucide-react";
import { dashboardStats, applications } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "../components/constants/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { offices as staticOffices } from "../data/mockData";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Mock data for admin analytics (would be replaced by API calls)
  const officeAnalyticsData = [
    { office: "ZIMRA", totalApplications: 1200, pending: 80, approved: 1050 },
    {
      office: "Harare City Council",
      totalApplications: 850,
      pending: 45,
      approved: 780,
    },
    {
      office: "Chitungwiza Municipal",
      totalApplications: 520,
      pending: 30,
      approved: 480,
    },
  ];

  // --- Hook for navigation based on authentication status ---
  useEffect(() => {
    // Navigate to '/' if authentication is *not* loading and user is null
    if (!isAuthLoading && user === null) {
      console.log("User is null and not loading, navigating to /");
      navigate("/");
    }
  }, [user, isAuthLoading, navigate]); // Depend on user, isAuthLoading, and navigate


  // --- UseMemo for `office` must be at the top level and handle null user ---
  // Ensure 'office' is calculated only if 'user' exists and has an 'office' property
  const office = useMemo(() => {
    // If user is null or doesn't have an office property, return null for office
    if (!user || !user.office) {
      return null;
    }
    // Otherwise, find the office
    return staticOffices.find((o) => o.id === user.office);
  }, [user]); // Depend only on 'user' as 'user.office' is a property of 'user'

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      if (user) {
        if (user.role === "admin") {
          setStats({
            totalApplications: 2870,
            pendingReview: 170,
            approvedToday: 150,
            avgProcessingTime: "3.5 days",
            totalOfficers: 45,
          });
          setNotifications([
            "Monthly performance report generated.",
            "New officer account requests pending review.",
            "System update scheduled for 2 AM tomorrow.",
          ]);
        } else {
          setStats(dashboardStats);
          setRecentApplications(applications.slice(0, 5));
          setNotifications([
            "3 new applications received today",
            "Application APP-2024-001 requires document verification",
            "Tax clearance certificate issued for Mary's Hair Salon",
          ]);
        }
      }
      setDashboardLoading(false);
    };

    if (!isAuthLoading && user) {
      fetchDashboardData();
    } else if (!isAuthLoading && user === null) {
      // If not logged in, ensure dashboard isn't stuck loading
      setDashboardLoading(false);
    }
  }, [user, isAuthLoading]);

  // --- Loading/Error State Handling at the top ---
  // This needs to be *before* any access to user.role or user.office beyond the useMemo
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin h-8 w-8 mr-2" /> Loading authentication...
      </div>
    );
  }

  // If user is null AFTER loading, it means they are not authenticated.
  // The useEffect above should handle redirection, but this is a fail-safe for rendering.
  if (user === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        Please log in to view the dashboard. Redirecting...
      </div>
    );
  }

  // Now that 'user' is guaranteed not null, we can safely derive userRole
  const userRole = user.role;

  // Now check for dashboard data loading
  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin h-8 w-8 mr-2" /> Loading Dashboard Data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {userRole === "admin" ? (
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            {"Overall system analytics and administration overview"}
          </p>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="py-1 bg-primary/10 rounded-lg">
            {/* Ensure office exists and has a logo, otherwise use fallback icon */}
            {office?.logo ? (
              <img
                src={office.logo}
                alt={`${office.fullName} logo`}
                className="h-20"
              />
            ) : (
              <Building2 className="h-20 w-20 text-primary-foreground p-4" />
            )}
          </div>
          <div>
            {/* Ensure office exists before accessing its properties */}
            <h1 className="text-3xl font-bold text-foreground">
              {office?.name || office?.fullName || "Office Dashboard"}
            </h1>
            <p className="text-muted-foreground">{office?.description || "Welcome to your office dashboard."}</p>
          </div>
        </div>
      )}

      {/* Stats Cards - Shared for both roles, but numbers would come from different API endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {userRole === "admin" ? "+12% overall" : "+12% from last month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats.pendingReview}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting officer review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats.approvedToday}
            </div>
            <p className="text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 inline mr-1" />
              {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {userRole === "admin" ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Officers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOfficers}</div>
              <p className="text-xs text-muted-foreground">
                Active system users
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Processing Time
              </CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgProcessingTime}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Improved by 0.8 days
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {userRole === "admin" ? (
          <>
            {/* Office Analytics Section for Admin */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Office Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {officeAnalyticsData.map((data, index) => (
                    <div
                      key={index}
                      className="p-3 border border-border rounded-lg grid grid-cols-3 gap-4 items-center"
                    >
                      <div className="font-medium text-lg">{data.office}</div>
                      <div className="text-sm">
                        <span className="font-bold">
                          {data.totalApplications}
                        </span>{" "}
                        Total Apps
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-warning">
                          {data.pending}
                        </span>{" "}
                        Pending |{" "}
                        <span className="font-bold text-success">
                          {data.approved}
                        </span>{" "}
                        Approved
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground mt-4">
                    Detailed reports available in the Analytics section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Recent Applications for Officer */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.length > 0 ? (
                    recentApplications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{app.businessName}</div>
                          <div className="text-sm text-muted-foreground">
                            {app.applicantName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {app.id}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <StatusBadge status={app.status} />
                          <div className="text-xs text-muted-foreground">
                            {new Date(app.dateSubmitted).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No recent applications to display.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Notifications - Shared for both roles but content changes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Today's Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="p-3 bg-accent rounded-lg">
                    <p className="text-sm">{notification}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No new notifications today.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}