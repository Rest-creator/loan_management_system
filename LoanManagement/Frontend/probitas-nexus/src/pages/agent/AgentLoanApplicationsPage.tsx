import { useState, useEffect } from "react";
import { Search, Eye, Check, X, User, ArrowLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Zimbabwe-specific mock loan applications data for agents
const agentLoanApplicationsData = [
  {
    id: "1",
    clientName: "Tendai Mukamuri",
    email: "tendai.mukamuri@gmail.com",
    phone: "+263 77 123 4567",
    amount: 105000, // ZWL converted to USD (~$150)
    purpose: "Grocery Shop Expansion",
    status: "pending",
    submitDate: "2024-01-15",
    agent: "Sharon Chidziva",
    creditScore: 720,
    avatar: "/placeholder.svg"
  },
  {
    id: "2",
    clientName: "Chipo Moyo",
    email: "chipo.moyo@yahoo.com", 
    phone: "+263 78 234 5678",
    amount: 70000, // ZWL converted to USD (~$100)
    purpose: "Market Stall Stock",
    status: "approved",
    submitDate: "2024-01-14",
    agent: "Sharon Chidziva",
    creditScore: 680,
    avatar: "/placeholder.svg"
  },
  {
    id: "3",
    clientName: "Blessing Chikwanha",
    email: "blessing.chikwanha@gmail.com",
    phone: "+263 71 345 6789",
    amount: 140000, // ZWL converted to USD (~$200)
    purpose: "Farming Equipment",
    status: "rejected",
    submitDate: "2024-01-12",
    agent: "Sharon Chidziva",
    creditScore: 580,
    avatar: "/placeholder.svg"
  },
  {
    id: "4",
    clientName: "Tapiwa Mujuru",
    email: "tapiwa.mujuru@outlook.com",
    phone: "+263 77 456 7890",
    amount: 84000, // ZWL converted to USD (~$120)
    purpose: "Tailoring Business",
    status: "pending",
    submitDate: "2024-01-16",
    agent: "Sharon Chidziva",
    creditScore: 750,
    avatar: "/placeholder.svg"
  },
  {
    id: "5",
    clientName: "Memory Sibanda",
    email: "memory.sibanda@gmail.com",
    phone: "+263 78 567 8901",
    amount: 175000, // ZWL converted to USD (~$250)
    purpose: "Hair Salon Setup",
    status: "active",
    submitDate: "2024-01-10",
    agent: "Sharon Chidziva",
    creditScore: 700,
    avatar: "/placeholder.svg"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-warning text-warning-foreground";
    case "approved":
      return "bg-success text-success-foreground";
    case "rejected":
      return "bg-destructive text-destructive-foreground";
    case "active":
      return "bg-primary text-primary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const AgentLoanApplicationsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("filter") || "all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'view' | null;
    applicationId: string | null;
  }>({ open: false, type: null, applicationId: null });

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) {
      setStatusFilter(filter);
    }
  }, [searchParams]);

  const filteredApplications = agentLoanApplicationsData.filter(app => {
    const matchesSearch = app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (applicationId: string) => {
    navigate(`/client-profile/${applicationId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Loan Applications</h1>
              <p className="text-muted-foreground">Applications submitted by you</p>
            </div>
          </div>
          <Button onClick={() => navigate('/agent/register')}>
            New Application
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{agentLoanApplicationsData.filter(a => a.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{agentLoanApplicationsData.filter(a => a.status === 'approved').length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{agentLoanApplicationsData.filter(a => a.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{agentLoanApplicationsData.filter(a => a.status === 'rejected').length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by client name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={application.avatar} alt={application.clientName} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm truncate">{application.clientName}</h3>
                      <Badge className={`${getStatusColor(application.status)} text-xs`}>
                        {application.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{application.email}</p>
                    <p className="text-xs text-muted-foreground">{application.phone}</p>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-primary">
                        ${(application.amount * 0.0014).toFixed(0)} USD
                      </p>
                      <p className="text-xs text-muted-foreground">ZWL {application.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground truncate">{application.purpose}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Score: {application.creditScore}</span>
                      <span className="text-muted-foreground">{application.submitDate}</span>
                    </div>
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewDetails(application.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-semibold">No applications found</p>
                <p className="text-sm">Try adjusting your search criteria or add a new application.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentLoanApplicationsPage;