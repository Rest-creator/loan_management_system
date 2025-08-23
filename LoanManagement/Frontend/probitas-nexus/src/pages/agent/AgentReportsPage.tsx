import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Users, DollarSign, Target, Calendar, Download, BarChart3, PieChart } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

const AgentReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // Mock agent performance data with Zimbabwe context
  const agentStats = {
    totalClients: 89,
    activeLoans: 67,
    completedLoans: 22,
    totalLoanValue: 45600000, // ZWL
    commissionEarned: 2280000, // ZWL
    approvalRate: 82.5,
    recoveryRate: 94.2,
    averageLoanSize: 680000
  };

  const monthlyPerformance = [
    { month: "Jul 2024", clients: 8, loans: 12, value: 8200000, commission: 410000, recovery: 96.5 },
    { month: "Aug 2024", clients: 11, loans: 15, value: 10300000, commission: 515000, recovery: 94.8 },
    { month: "Sep 2024", clients: 9, loans: 13, value: 8900000, commission: 445000, recovery: 92.1 },
    { month: "Oct 2024", clients: 12, loans: 16, value: 11200000, commission: 560000, recovery: 95.3 },
    { month: "Nov 2024", clients: 10, loans: 14, value: 9600000, commission: 480000, recovery: 97.2 },
    { month: "Dec 2024", clients: 15, loans: 18, value: 12400000, commission: 620000, recovery: 93.8 }
  ];

  const clientPortfolio = [
    { sector: "Agriculture", count: 23, amount: 15600000, risk: "Medium", recovery: 96.8 },
    { sector: "Retail Trade", count: 18, amount: 10800000, risk: "Low", recovery: 98.2 },
    { sector: "Manufacturing", count: 12, amount: 8400000, risk: "Medium", recovery: 91.5 },
    { sector: "Services", count: 15, amount: 6300000, risk: "Low", recovery: 97.4 },
    { sector: "Mining", count: 8, amount: 5200000, risk: "High", recovery: 87.9 },
    { sector: "Education", count: 13, amount: 4100000, risk: "Low", recovery: 99.1 }
  ];

  const recentAchievements = [
    { title: "Top Performer", description: "Highest collection rate in November 2024", date: "Nov 2024", type: "performance" },
    { title: "100% Recovery", description: "Perfect recovery rate for Q3 2024", date: "Sep 2024", type: "recovery" },
    { title: "Client Champion", description: "Onboarded 15 new clients in December", date: "Dec 2024", type: "clients" },
    { title: "Quality Leader", description: "Zero defaults in managed portfolio", date: "Oct 2024", type: "quality" }
  ];

  const formatCurrency = (amount: number, currency = "ZWL") => {
    if (currency === "ZWL") {
      return `ZWL ${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 38500 / 1000).toFixed(1)}K`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Performance Reports</h1>
              <p className="text-muted-foreground">Personal portfolio analytics and achievements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{agentStats.totalClients}</div>
              <div className="flex items-center space-x-2 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{formatCurrency(agentStats.totalLoanValue)}</div>
              <p className="text-xs text-muted-foreground">{formatCurrency(agentStats.totalLoanValue, "USD")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{agentStats.recoveryRate}%</div>
              <Progress value={agentStats.recoveryRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{formatCurrency(agentStats.commissionEarned)}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Awards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Portfolio by Sector</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientPortfolio.map((sector) => (
                    <div key={sector.sector} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold">{sector.sector}</h4>
                          <p className="text-sm text-muted-foreground">{sector.count} clients</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(sector.amount)}</div>
                          <div className="text-sm text-muted-foreground">{sector.recovery}% recovery</div>
                        </div>
                        <Badge variant={sector.risk === "Low" ? "default" : sector.risk === "Medium" ? "secondary" : "destructive"}>
                          {sector.risk}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Approval Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={agentStats.approvalRate} className="w-20 h-2" />
                      <span className="text-sm font-medium">{agentStats.approvalRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Recovery Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={agentStats.recoveryRate} className="w-20 h-2" />
                      <span className="text-sm font-medium">{agentStats.recoveryRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Client Retention</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={91.3} className="w-20 h-2" />
                      <span className="text-sm font-medium">91.3%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Target Achievement</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={104.7} className="w-20 h-2" />
                      <span className="text-sm font-medium">104.7%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ranking & Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">#3</div>
                    <p className="text-sm text-muted-foreground">Overall agent ranking</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">vs Branch Average</span>
                      <Badge variant="default">+15.2%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">vs Company Average</span>
                      <Badge variant="default">+8.7%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">vs Last Quarter</span>
                      <Badge variant="secondary">+22.1%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyPerformance.map((month) => (
                    <div key={month.month} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                      <div className="font-semibold mb-2 sm:mb-0">{month.month}</div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{month.clients}</div>
                          <div className="text-muted-foreground">Clients</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{month.loans}</div>
                          <div className="text-muted-foreground">Loans</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{formatCurrency(month.value)}</div>
                          <div className="text-muted-foreground">Value</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{formatCurrency(month.commission)}</div>
                          <div className="text-muted-foreground">Commission</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{month.recovery}%</div>
                          <div className="text-muted-foreground">Recovery</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{achievement.date}</Badge>
                          <Badge variant={achievement.type === "performance" ? "default" : achievement.type === "recovery" ? "secondary" : "outline"}>
                            {achievement.type}
                          </Badge>
                        </div>
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

export default AgentReportsPage;