import { useState } from "react";
import { Calendar, List, CheckCircle, AlertTriangle, Clock, Filter, Search, Download, ArrowLeft } from "lucide-react";
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

// Zimbabwe-specific mock repayment data
const repaymentData = [
  {
    id: "1",
    clientName: "Tendai Mukamuri",
    loanId: "L001",
    amount: 10500, // ZWL (~$15 USD)
    dueDate: "2024-01-15",
    paidDate: "2024-01-14",
    status: "paid",
    method: "EcoCash",
    agent: "Sharon Chidziva"
  },
  {
    id: "2",
    clientName: "Chipo Moyo",
    loanId: "L002",
    amount: 7000, // ZWL (~$10 USD)
    dueDate: "2024-01-16",
    paidDate: null,
    status: "pending",
    method: "OneMoney",
    agent: "Peter Mutasa"
  },
  {
    id: "3",
    clientName: "Blessing Chikwanha",
    loanId: "L003",
    amount: 14000, // ZWL (~$20 USD)
    dueDate: "2024-01-10",
    paidDate: null,
    status: "overdue",
    method: "Cash",
    agent: "Faith Nyoni"
  },
  {
    id: "4",
    clientName: "Tapiwa Mujuru",
    loanId: "L004",
    amount: 8400, // ZWL (~$12 USD)
    dueDate: "2024-01-18",
    paidDate: null,
    status: "pending",
    method: "CBZ Bank Transfer",
    agent: "David Mukucha"
  },
  {
    id: "5",
    clientName: "Memory Sibanda",
    loanId: "L005",
    amount: 17500, // ZWL (~$25 USD)
    dueDate: "2024-01-12",
    paidDate: "2024-01-12",
    status: "paid",
    method: "EcoCash",
    agent: "Sarah Tsvangirayi"
  },
  {
    id: "6",
    clientName: "Ngonidzashe Mapfumo",
    loanId: "L006",
    amount: 21000, // ZWL (~$30 USD)
    dueDate: "2024-01-20",
    paidDate: null,
    status: "pending",
    method: "Steward Bank",
    agent: "Sharon Chidziva"
  },
  {
    id: "7",
    clientName: "Priscilla Dube",
    loanId: "L007",
    amount: 5600, // ZWL (~$8 USD)
    dueDate: "2024-01-08",
    paidDate: "2024-01-08",
    status: "paid",
    method: "NMB Bank",
    agent: "Peter Mutasa"
  },
  {
    id: "8",
    clientName: "Wellington Chiware",
    loanId: "L008",
    amount: 31500, // ZWL (~$45 USD)
    dueDate: "2024-01-25",
    paidDate: null,
    status: "overdue",
    method: "CABS",
    agent: "Faith Nyoni"
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

const RepaymentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();

  const filteredPayments = repaymentData.filter(payment => {
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
      description: `Payment of $${selectedPayment?.amount} has been marked as paid.`,
    });
    setShowPaymentDialog(false);
    setSelectedPayment(null);
  };

  const totalPaid = repaymentData.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = repaymentData.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = repaymentData.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0);

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
              <h1 className="text-3xl font-bold text-foreground">Repayment Management</h1>
              <p className="text-muted-foreground">Track loan repayments and overdue accounts</p>
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
                <CardTitle>Repayment History</CardTitle>
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
                      <TableHead>Agent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.clientName}</TableCell>
                        <TableCell>{payment.loanId}</TableCell>
                        <TableCell className="font-bold">
                          <div>
                            <p>${(payment.amount * 0.0014).toFixed(0)} USD</p>
                            <p className="text-xs text-muted-foreground">ZWL {payment.amount.toLocaleString()}</p>
                          </div>
                        </TableCell>
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
                        <TableCell className="text-sm text-muted-foreground">{payment.agent}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {payment.status !== "paid" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMarkAsPaid(payment)}
                              >
                                Mark as Paid
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
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
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Repayment Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Interactive calendar with repayment schedules
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
              <DialogTitle>Confirm Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Mark this repayment as paid?</p>
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
                    <span className="font-bold">${(selectedPayment.amount * 0.0014).toFixed(0)} USD (ZWL {selectedPayment.amount.toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Due Date:</span>
                    <span>{selectedPayment.dueDate}</span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmPayment}>
                Confirm Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RepaymentsPage;