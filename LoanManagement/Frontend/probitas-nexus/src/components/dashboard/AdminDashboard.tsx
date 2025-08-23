import { useState } from "react";
import { FileText, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import KPICard from "./KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const kpiData = [
  {
    title: "Pending Applications",
    value: "24",
    icon: FileText,
    iconColor: "text-warning",
  },
  {
    title: "Active Loans",
    value: "142",
    icon: DollarSign,
    iconColor: "text-success",
  },
  {
    title: "Overdue Payments",
    value: "8",
    icon: AlertTriangle,
    iconColor: "text-destructive",
  },
  {
    title: "Total Revenue",
    value: "$42,560",
    icon: TrendingUp,
    iconColor: "text-primary",
  },
];

const loanApplications = [
  {
    id: "1",
    client: "John Banda",
    email: "john@example.com",
    amount: "$15,000",
    date: "2023-06-15",
    status: "pending",
  },
  {
    id: "2",
    client: "Robson Kawa",
    email: "robson@example.com",
    amount: "$8,500",
    date: "2023-06-14",
    status: "approved",
  },
  {
    id: "3",
    client: "Michael Shumba",
    email: "michael@example.com",
    amount: "$22,000",
    date: "2023-06-12",
    status: "rejected",
  },
];

const recentActivity = [
  {
    id: "1",
    title: "Loan Application Approved",
    description: "Application #1245 for $15,000 was approved",
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "New Client Registered",
    description: "Robson Kawa joined the platform",
    time: "3 hours ago",
  },
  {
    id: "3",
    title: "Repayment Received",
    description: "$500 repayment received from John Banda",
    time: "Yesterday",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-warning text-warning-foreground";
    case "approved":
      return "bg-success text-success-foreground";
    case "rejected":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const AdminDashboard = () => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | null;
    applicationId: string | null;
  }>({ open: false, type: null, applicationId: null });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleKPIClick = (type: string) => {
    switch (type) {
      case 'pending':
        navigate('/admin/loan-applications?filter=pending');
        break;
      case 'active':
        navigate('/admin/loan-applications?filter=active');
        break;
      case 'overdue':
        navigate('/admin/repayments?filter=overdue');
        break;
      case 'revenue':
        navigate('/admin/reports?view=revenue');
        break;
    }
  };

  const handleApplicationAction = (type: 'approve' | 'reject', applicationId: string) => {
    setActionDialog({ open: true, type, applicationId });
  };

  const confirmAction = () => {
    if (actionDialog.type && actionDialog.applicationId) {
      toast({
        title: `Application ${actionDialog.type}d`,
        description: `Loan application has been ${actionDialog.type}d successfully.`,
      });
      setActionDialog({ open: false, type: null, applicationId: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Manage loan applications and track performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Pending Applications"
          value="24"
          icon={FileText}
          iconColor="text-warning"
          onClick={() => handleKPIClick('pending')}
        />
        <KPICard
          title="Active Loans"
          value="142"
          icon={DollarSign}
          iconColor="text-success"
          onClick={() => handleKPIClick('active')}
        />
        <KPICard
          title="Overdue Payments"
          value="8"
          icon={AlertTriangle}
          iconColor="text-destructive"
          onClick={() => handleKPIClick('overdue')}
        />
        <KPICard
          title="Total Revenue"
          value="$42,560"
          icon={TrendingUp}
          iconColor="text-primary"
          onClick={() => handleKPIClick('revenue')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Applications */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Loan Applications</CardTitle>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => navigate('/admin/loan-applications')}
            >
              Review All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.client}</p>
                        <p className="text-sm text-muted-foreground">{application.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{application.amount}</TableCell>
                    <TableCell>{application.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {application.status === "pending" && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleApplicationAction('approve', application.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleApplicationAction('reject', application.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/loan-applications/${application.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Charts Placeholders */}
        <Card>
          <CardHeader>
            <CardTitle>Repayment Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Performance Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Distribution Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'approve' ? 'Approve' : 'Reject'} Loan Application
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to {actionDialog.type} this loan application? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialog({ open: false, type: null, applicationId: null })}
            >
              Cancel
            </Button>
            <Button 
              variant={actionDialog.type === 'approve' ? 'default' : 'destructive'}
              onClick={confirmAction}
            >
              {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;