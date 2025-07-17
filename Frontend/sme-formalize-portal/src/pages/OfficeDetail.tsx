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
import { ApplicationCard } from "@/components/ApplicationCard";
import { ApplicationTable } from "@/components/ApplicationTable";
import { offices, applications, officers } from "@/data/mockData";
import { Building2, Users, FileText, Clock, TrendingUp } from "lucide-react";

export default function OfficeDetail() {
  const { officeId } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("all");

  const office = offices.find((o) => o.id === officeId);
  const officeApplications = applications.filter(
    (app) => app.officeId === officeId
  );
  const officeOfficers = officers.filter(
    (officer) => officer.officeId === officeId
  );

  // Filter applications by status if selected
  const filteredApplications = useMemo(() => {
    if (selectedStatus === "all") return officeApplications;
    return officeApplications.filter((app) => app.status === selectedStatus);
  }, [officeApplications, selectedStatus]);

  if (!office) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Office not found</p>
      </div>
    );
  }

  const pendingCount = officeApplications.filter(
    (app) => app.status === "pending"
  ).length;
  const approvedCount = officeApplications.filter(
    (app) => app.status === "approved"
  ).length;
  const avgProcessingTime = "2.5 days"; // Mock calculation

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-0 bg-primary/10 rounded-lg">
          <img src={office.logo} className="h-20"/>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {office.fullName}
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
            <div className="text-2xl font-bold">
              {officeApplications.length}
            </div>
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
            <div className="text-2xl font-bold">{officeOfficers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Applications for {office.fullName}</CardTitle>
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
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications found for the selected criteria
            </div>
          ) : (
            <ApplicationTable applications={filteredApplications} />
          )}
        </CardContent>
      </Card>

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
              {officeOfficers.map((officer) => (
                <div
                  key={officer.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{officer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {officer.email}
                    </p>
                  </div>
                  <Badge variant="outline">{officer.role}</Badge>
                </div>
              ))}
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
                <div className="text-3xl font-bold text-primary">2.5 days</div>
                <p className="text-sm text-muted-foreground">
                  Average Processing Time
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">
                  {Math.round(
                    (approvedCount / officeApplications.length) * 100
                  )}
                  %
                </div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-info">
                  {Math.round(
                    officeApplications.length / officeOfficers.length
                  )}
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
