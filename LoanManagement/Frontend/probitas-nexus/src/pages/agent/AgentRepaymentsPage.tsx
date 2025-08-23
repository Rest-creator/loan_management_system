import { useState } from "react";
import { Calendar, List, CheckCircle, AlertTriangle, Clock, Search, Download, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Zimbabwe-specific mock repayment data for agent's clients
const agentRepaymentData = [
  {
    id: "1",
    clientName: "Tendai Mukamuri",
    loanId: "L001",
    amount: 10500, // ZWL (~$15 USD)
    dueDate: "2024-01-15",
    paidDate: "2024-01-14",
    status: "paid",
    method: "EcoCash"
  },
  {
    id: "2",
    clientName: "Chipo Moyo",
    loanId: "L002",
    amount: 7000, // ZWL (~$10 USD)
    dueDate: "2024-01-16",
    paidDate: null,
    status: "pending",
    method: "OneMoney"
  },
  {
    id: "3",
    clientName: "Tapiwa Mujuru",
    loanId: "L004",
    amount: 8400, // ZWL (~$12 USD)
    dueDate: "2024-01-18",
    paidDate: null,
    status: "pending",
    method: "CBZ Bank Transfer"
  },
  {
    id: "4",
    clientName: "Memory Sibanda",
    loanId: "L005",
    amount: 17500, // ZWL (~$25 USD)
    dueDate: "2024-01-12",
    paidDate: "2024-01-12",
    status: "paid",
    method: "EcoCash"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-success text-success-foreground";
    case "pending":
      return "bg-warning text-warning-foreground";
    case "overdue":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "overdue":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const AgentRepaymentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();

  const filteredPayments = agentRepaymentData.filter(payment => {
    const matchesSearch = payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.loanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsPaid = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentDialog(true);
  };

  const confirmPayment = () => {
    toast({
      title: "Payment Recorded",
      description: `Payment of $${selectedPayment?.amount} has been recorded and will be reviewed.`,
    });
    setShowPaymentDialog(false);
    setSelectedPayment(null);
  };

  const totalPaid = agentRepaymentData.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = agentRepaymentData.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = agentRepaymentData.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0);

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
              <h1 className="text-3xl font-bold text-foreground">My Clients' Repayments</h1>
              <p className="text-muted-foreground">Track repayments from your clients</p>
            </div>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-success">${totalPaid.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">${totalPending.toLocaleString()}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-destructive">${totalOverdue.toLocaleString()}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>List View</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Calendar View</span>
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by client or loan ID..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Repayments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.clientName}</TableCell>
                        <TableCell>{payment.loanId}</TableCell>
                        <TableCell className="font-bold">${payment.amount}</TableCell>
                        <TableCell>{payment.dueDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(payment.status)}
                              <span>{payment.status}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {payment.status !== "paid" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMarkAsPaid(payment)}
                              >
                                Record Payment
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              Contact Client
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Repayment Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Interactive calendar with your clients' repayment schedules
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Confirmation Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Record this repayment as received?</p>
              {selectedPayment && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Client:</span>
                    <span>{selectedPayment.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Loan ID:</span>
                    <span>{selectedPayment.loanId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="font-bold">${selectedPayment.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Due Date:</span>
                    <span>{selectedPayment.dueDate}</span>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                This payment will be recorded and submitted for admin verification.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmPayment}>
                Record Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AgentRepaymentsPage;