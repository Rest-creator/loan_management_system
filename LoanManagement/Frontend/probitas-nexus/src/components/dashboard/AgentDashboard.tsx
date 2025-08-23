import { useState } from "react";
import { FileText, CheckCircle, DollarSign, XCircle, Plus, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import KPICard from "./KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    title: "Approved Loans",
    value: "142",
    icon: CheckCircle,
    iconColor: "text-success",
  },
  {
    title: "Average Loan Size",
    value: "$15,800",
    icon: DollarSign,
    iconColor: "text-primary",
  },
  {
    title: "Total Declined",
    value: "10",
    icon: XCircle,
    iconColor: "text-destructive",
  },
];

const recentApplications = [
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
];

const myTasks = [
  { id: "1", text: "Review Matthew Nhanga's application", completed: false },
  { id: "2", text: "Follow up with Kevin Choga", completed: false },
  { id: "3", text: "Send rejection letter to Arcel Moyo", completed: false },
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

const AgentDashboard = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("2.5");
  const [termMonths, setTermMonths] = useState("36");
  const [calculatedPayment, setCalculatedPayment] = useState<string | null>(null);
  const [tasks, setTasks] = useState(myTasks);
  const [newTask, setNewTask] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);
  const navigate = useNavigate();

  const calculatePayment = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(termMonths);
    
    if (principal && monthlyRate && months) {
      const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                     (Math.pow(1 + monthlyRate, months) - 1);
      setCalculatedPayment(`$${payment.toFixed(2)}`);
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskItem = {
        id: Date.now().toString(),
        text: newTask,
        completed: false
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loan Agent Dashboard</h1>
          <p className="text-muted-foreground">Track your clients and loan performance</p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => navigate('/agent/register')}
        >
          <Plus className="h-4 w-4" />
          <span>New Application</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Pending Applications"
          value="24"
          icon={FileText}
          iconColor="text-warning"
          navigateTo="/agent/loan-applications"
          filter="pending"
        />
        <KPICard
          title="Approved Loans"
          value="142"
          icon={CheckCircle}
          iconColor="text-success"
          navigateTo="/agent/loan-applications"
          filter="approved"
        />
        <KPICard
          title="Average Loan Size"
          value="$15,800"
          icon={DollarSign}
          iconColor="text-primary"
          onClick={() => navigate('/agent/reports')}
        />
        <KPICard
          title="Total Declined"
          value="10"
          icon={XCircle}
          iconColor="text-destructive"
          navigateTo="/agent/loan-applications"
          filter="rejected"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Loan Applications */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Loan Applications</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/agent/loan-applications')}
            >
              View All
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
                {recentApplications.map((application) => (
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
                          <Button variant="default" size="sm">
                            Review
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          {application.status === "approved" ? "Details" : "Documents"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Loan Calculator */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <CardTitle>Loan Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <Input
                id="loanAmount"
                placeholder="$10,000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term (months)</Label>
              <Input
                id="term"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
              />
            </div>
            <Button onClick={calculatePayment} className="w-full">
              Calculate Payment
            </Button>
            {calculatedPayment && (
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-lg font-bold">{calculatedPayment}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
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

        {/* My Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Tasks</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={addTask}
            >
              + Add New Task
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <label
                    htmlFor={task.id}
                    className={`text-sm flex-1 ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {task.text}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;