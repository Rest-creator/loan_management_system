import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, FileText, DollarSign, Calendar, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Zimbabwe-specific mock client data
const clientsData = {
  "1": {
    id: "1",
    name: "Tendai Mukamuri",
    email: "tendai.mukamuri@gmail.com",
    phone: "+263 77 123 4567",
    nationalId: "63-123456-K-47",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    maritalStatus: "Married",
    address: "123 Robert Mugabe Road, Harare",
    city: "Harare",
    province: "Harare Metropolitan",
    occupation: "Small Business Owner",
    employer: "Self-Employed",
    monthlyIncome: 2500,
    bankAccount: "CBZ Bank - 12345678",
    nextOfKin: "Grace Mukamuri (Wife)",
    nextOfKinPhone: "+263 77 987 6543",
    avatar: "/placeholder.svg",
    riskScore: 720,
    creditRating: "Good",
    dateJoined: "2023-06-15",
    agent: "Sharon Chidziva",
    status: "Active"
  },
  "2": {
    id: "2",
    name: "Chipo Moyo",
    email: "chipo.moyo@yahoo.com",
    phone: "+263 78 234 5678",
    nationalId: "63-234567-L-82",
    dateOfBirth: "1990-07-22",
    gender: "Female",
    maritalStatus: "Single",
    address: "45 Second Street, Bulawayo",
    city: "Bulawayo",
    province: "Bulawayo Metropolitan",
    occupation: "Market Vendor",
    employer: "Self-Employed",
    monthlyIncome: 800,
    bankAccount: "CABS - 87654321",
    nextOfKin: "Moses Moyo (Brother)",
    nextOfKinPhone: "+263 78 456 7890",
    avatar: "/placeholder.svg",
    riskScore: 680,
    creditRating: "Fair",
    dateJoined: "2023-08-10",
    agent: "Peter Mutasa",
    status: "Active"
  }
};

const loanHistory = [
  {
    id: "L001",
    amount: 150000,
    purpose: "Business Expansion - Grocery Shop",
    status: "Active",
    disbursedDate: "2024-01-10",
    dueDate: "2024-12-10",
    monthlyPayment: 15000,
    remainingBalance: 120000,
    interestRate: 15.5
  },
  {
    id: "L002",
    amount: 75000,
    purpose: "Stock Purchase",
    status: "Completed",
    disbursedDate: "2023-06-15",
    dueDate: "2024-06-15",
    monthlyPayment: 7500,
    remainingBalance: 0,
    interestRate: 14.0
  }
];

const repaymentHistory = [
  { date: "2024-01-15", amount: 15000, status: "Paid", method: "EcoCash" },
  { date: "2024-02-15", amount: 15000, status: "Paid", method: "Bank Transfer" },
  { date: "2024-03-15", amount: 15000, status: "Paid", method: "EcoCash" },
  { date: "2024-04-15", amount: 15000, status: "Pending", method: "EcoCash" }
];

const ClientProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const client = clientsData[id as keyof typeof clientsData];

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Client Not Found</h2>
            <p className="text-muted-foreground">The client profile you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Client Profile</h1>
              <p className="text-muted-foreground">Complete KYC and loan details</p>
            </div>
          </div>
          <Badge 
            className={client.status === "Active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}
          >
            {client.status}
          </Badge>
        </div>

        {/* Client Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{client.name}</h2>
                    <p className="text-muted-foreground">Client ID: {client.id}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end space-y-1">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      Credit Score: {client.riskScore}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{client.creditRating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.city}, {client.province}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kyc">KYC Details</TabsTrigger>
            <TabsTrigger value="loans">Loan History</TabsTrigger>
            <TabsTrigger value="repayments">Repayments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">${(client.monthlyIncome * 0.7).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Monthly Income (USD)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">{loanHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Total Loans</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {Math.round((new Date().getTime() - new Date(client.dateJoined).getTime()) / (1000 * 60 * 60 * 24 / 30))}
                  </p>
                  <p className="text-sm text-muted-foreground">Months as Client</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Briefcase className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold">95%</p>
                  <p className="text-sm text-muted-foreground">Repayment Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Credit Score</span>
                    <span>{client.riskScore}/850</span>
                  </div>
                  <Progress value={(client.riskScore / 850) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Payment History</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Debt-to-Income Ratio</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="font-semibold">{client.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">National ID</label>
                      <p className="font-semibold">{client.nationalId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="font-semibold">{client.dateOfBirth}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="font-semibold">{client.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                      <p className="font-semibold">{client.maritalStatus}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Agent</label>
                      <p className="font-semibold">{client.agent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="font-semibold">{client.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="font-semibold">{client.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Physical Address</label>
                    <p className="font-semibold">{client.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">City</label>
                      <p className="font-semibold">{client.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Province</label>
                      <p className="font-semibold">{client.province}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employment & Income</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                      <p className="font-semibold">{client.occupation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Employer</label>
                      <p className="font-semibold">{client.employer}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Monthly Income</label>
                    <p className="font-semibold text-lg text-primary">
                      ${(client.monthlyIncome * 0.7).toLocaleString()} USD
                    </p>
                    <p className="text-sm text-muted-foreground">
                      (ZWL ${client.monthlyIncome.toLocaleString()})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bank Account</label>
                    <p className="font-semibold">{client.bankAccount}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next of Kin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-semibold">{client.nextOfKin}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="font-semibold">{client.nextOfKinPhone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <div className="space-y-4">
              {loanHistory.map((loan) => (
                <Card key={loan.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">Loan {loan.id}</h3>
                          <Badge className={loan.status === "Active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{loan.purpose}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <p className="font-semibold">${loan.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Monthly Payment:</span>
                            <p className="font-semibold">${loan.monthlyPayment.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Interest Rate:</span>
                            <p className="font-semibold">{loan.interestRate}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Remaining:</span>
                            <p className="font-semibold">${loan.remainingBalance.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {loan.status === "Active" && (
                          <Button variant="outline" size="sm">Payment Schedule</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="repayments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Repayments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repaymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge className={payment.status === "Paid" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                          {payment.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{payment.method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClientProfilePage;