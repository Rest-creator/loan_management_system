import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplicationTable } from "@/components/ApplicationTable";
import {
  Building2,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Loader2,
  SearchX,
  AlertTriangle,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/constants/AuthContext";
import API_ENDPOINTS from "@/components/constants/apiEndpoints";

// --- IMPORT YOUR STATIC OFFICES DATA HERE ---
import { offices as staticOffices } from "../data/mockData"; // Adjust this path if 'offices' is not in '../../data/offices.ts'

export default function OfficeDetail() {
  const { officeId } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { authAxios, user, isLoading: authLoading } = useAuth();

  const office = useMemo(() => {
    if (!officeId) return null;
    return staticOffices.find((o) => o.id === officeId);
  }, [officeId]);

  // --- Fetch Office Applications ---
  const {
    data: officeApplications,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    error: applicationsError,
  } = useQuery({
    queryKey: ["officeApplications", officeId],
    queryFn: async () => {
      if (!authAxios || !officeId) return [];
      // Assuming your backend expects 'office_id' to match the static office's ID (e.g., "zimra")
      const response = await authAxios.get(API_ENDPOINTS.APPLICATIONS.LIST, {
        params: { office_id: officeId }, // Filter by static office ID
      });
      return response.data;
    },
    enabled: !!authAxios && !!officeId, // Only fetch if authAxios and officeId are available
    refetchOnWindowFocus: false,
  });

  // --- Fetch Office Officers ---
  const {
    data: officeOfficers,
    isLoading: isOfficersLoading,
    isError: isOfficersError,
    error: officersError,
  } = useQuery({
    queryKey: ["officeOfficers", officeId],
    queryFn: async () => {
      if (!authAxios || !officeId) return [];
      // Assuming your backend expects 'office_id' to match the static office's ID (e.g., "zimra")
      const response = await authAxios.get(API_ENDPOINTS.OFFICERS.LIST, {
        params: { office_id: officeId }, // Filter by static office ID
      });
      console.log(response);

      return response.data;
    },
    enabled: !!authAxios && !!officeId,
    refetchOnWindowFocus: false,
  });

  // Combined loading state: only dependent on dynamic fetches and auth loading
  const isLoading = authLoading || isApplicationsLoading || isOfficersLoading;
  // Error state now focuses on issues with applications/officers fetches
  const isError = isApplicationsError || isOfficersError;

  // Filter applications by status if selected
  const filteredApplications = useMemo(() => {
    if (!officeApplications) return [];
    if (selectedStatus === "all") return officeApplications;
    return officeApplications.filter((app) => app.status === selectedStatus);
  }, [officeApplications, selectedStatus]);

  // Derived statistics
  const pendingCount =
    officeApplications?.filter((app) => app.status === "pending").length || 0;
  const approvedCount =
    officeApplications?.filter((app) => app.status === "approved").length || 0;
  const totalApplications = officeApplications?.length || 0;
  const totalOfficers =
    officeOfficers?.filter((officer) => officer.office_id === office.id)
      .length || 0;

  const avgProcessingTime = "Calculated on Backend"; // This would need actual data for dynamic calculation.

  // --- Handle Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <p className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          Loading details...
        </p>
      </div>
    );
  }

  // --- Handle Office Not Found (from static data) ---
  // This happens if the officeId from the URL doesn't match any static office.
  if (!office) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">
              Office Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              We couldn't find an office matching the ID/Name: **{officeId}**.
              Please check the URL or try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Handle API Fetch Errors (for applications/officers) ---
  // This is distinct from the office not found error
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-destructive">
              There was an issue fetching the dynamic data (applications or
              officers) for **{office.name || office.fullName}**.
            </p>
            {applicationsError && (
              <p className="text-sm text-muted-foreground">
                Applications Error: {applicationsError.message}
              </p>
            )}
            {officersError && (
              <p className="text-sm text-muted-foreground">
                Officers Error: {officersError.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine if the current user is an admin
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="py-1 bg-primary/10 rounded-lg">
          {office.logo ? (
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
          <h1 className="text-3xl font-bold text-foreground">
            {office.name || office.fullName}
          </h1>
          <p className="text-muted-foreground">{office.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {approvedCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Officers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOfficers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table or Analytics (Conditional based on role) */}
      {!isAdmin ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Applications for {office.name || office.fullName}
            </CardTitle>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="needs_clarification">
                  Needs Clarification
                </SelectItem>
                {/* Add other statuses if applicable */}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No applications found for the selected criteria.
              </div>
            ) : (
              <ApplicationTable applications={filteredApplications} />
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Admin-specific Analytics or different view for applications */}
          {/* <Card>
                        <CardHeader>
                            <CardTitle>Office Performance Overview (Admin View)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-lg font-medium">
                                    Detailed analytics for {office.name || office.fullName}:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>**Total Applications:** {totalApplications}</li>
                                    <li>**Pending Applications:** {pendingCount}</li>
                                    <li>**Approved Applications:** {approvedCount}</li>
                                    <li>
                                        **Rejected Applications:**{" "}
                                        {officeApplications?.filter(
                                            (app) => app.status === "rejected"
                                        ).length || 0}
                                    </li>
                                    <li>
                                        **Needs Clarification:**{" "}
                                        {officeApplications?.filter(
                                            (app) => app.status === "needs_clarification"
                                        ).length || 0}
                                    </li>
                                    <li>**Total Officers:** {totalOfficers}</li>
                                    <li>**Average Processing Time:** {avgProcessingTime}</li>
                                    <li>
                                        **Approval Rate:**{" "}
                                        {totalApplications > 0
                                            ? `${Math.round(
                                                (approvedCount / totalApplications) * 100
                                            )}%`
                                            : "N/A"}
                                    </li>
                                    <li>
                                        **Applications per Officer:**{" "}
                                        {totalOfficers > 0
                                            ? Math.round(totalApplications / totalOfficers)
                                            : "N/A"}
                                    </li>
                                </ul>
                                <p className="text-sm text-muted-foreground mt-4">
                                    Admins see an aggregated view of office performance and can
                                    analyze trends.
                                </p>
                            </div>
                        </CardContent>
                    </Card> */}
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Officers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Officers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {officeOfficers && officeOfficers.length > 0 ? (
                officeOfficers.map(
                  (officer) =>
                    officer.office_id === office.id && (
                      <div
                        key={officer.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{officer.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {officer.email}
                          </p>
                        </div>
                         {" "}
                        <div className="flex items-center gap-2">
                          {" "}
                          <Badge variant="outline">{officer.role}</Badge> 
                          <Badge
                            variant={
                              // Dynamically set badge variant based on status
                              officer.status === "approved"
                                ? "success" // Assuming you have a 'success' variant
                                : officer.status === "pending"
                                ? "warning" // Assuming you have a 'warning' variant
                                : officer.status === "rejected"
                                ? "destructive" // Assuming you have a 'destructive' variant
                                : "secondary" // Default variant for other statuses or if not defined
                            }
                          >
                            {officer.status_display || officer.status}
                          </Badge>
                        </div>
                      </div>
                    )
                )
              ) : (
                <div className="text-center text-muted-foreground">
                  No officers found for this office.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {avgProcessingTime}
                </div>
                <p className="text-sm text-muted-foreground">
                  Average Processing Time
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">
                  {totalApplications > 0
                    ? `${Math.round(
                        (approvedCount / totalApplications) * 100
                      )}%`
                    : "N/A"}
                </div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-info">
                  {totalOfficers > 0
                    ? Math.round(totalApplications / totalOfficers)
                    : "N/A"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Apps per Officer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
