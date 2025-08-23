import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Award } from "lucide-react";

const PerformancePage = () => {
  // Mock performance data
  const performanceMetrics = {
    totalLoansProcessed: 1247,
    approvalRate: 78.5,
    averageProcessingTime: 2.3,
    portfolioValue: 2850000,
    defaultRate: 3.2,
    customerSatisfaction: 4.6
  };

  const agentPerformance = [
    { id: 1, name: "John Kamau", loansProcessed: 89, approvalRate: 82, revenue: 450000, rating: 4.8 },
    { id: 2, name: "Mary Wanjiku", loansProcessed: 76, approvalRate: 78, revenue: 380000, rating: 4.6 },
    { id: 3, name: "Peter Ochieng", loansProcessed: 65, approvalRate: 85, revenue: 325000, rating: 4.9 },
    { id: 4, name: "Grace Muthoni", loansProcessed: 58, approvalRate: 80, revenue: 290000, rating: 4.5 },
  ];

  const monthlyTrends = [
    { month: "Jan", loans: 98, revenue: 489000 },
    { month: "Feb", loans: 112, revenue: 558000 },
    { month: "Mar", loans: 105, revenue: 523000 },
    { month: "Apr", loans: 118, revenue: 590000 },
    { month: "May", loans: 124, revenue: 620000 },
    { month: "Jun", loans: 135, revenue: 675000 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
          <p className="text-muted-foreground">Track system performance and business metrics</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loans Processed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.totalLoansProcessed.toLocaleString()}</div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-xs text-success">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.approvalRate}%</div>
              <Progress value={performanceMetrics.approvalRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {(performanceMetrics.portfolioValue / 1000000).toFixed(1)}M</div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-xs text-success">+8% growth</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.defaultRate}%</div>
              <Progress value={performanceMetrics.defaultRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Below 5% target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.averageProcessingTime} days</div>
              <p className="text-xs text-muted-foreground">Target: 3 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.customerSatisfaction}/5.0</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`h-4 w-4 rounded-full mr-1 ${
                      star <= performanceMetrics.customerSatisfaction ? 'bg-yellow-400' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="agents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="geography">Geographic Distribution</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentPerformance.map((agent, index) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {agent.loansProcessed} loans processed
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{agent.approvalRate}% approval</Badge>
                          <Badge variant="outline">★ {agent.rating}</Badge>
                        </div>
                        <p className="text-sm font-medium">KSh {agent.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrends.map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between p-3 border rounded">
                      <div className="font-medium">{trend.month} 2024</div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{trend.loans} loans</p>
                          <p className="text-xs text-muted-foreground">Applications</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">KSh {(trend.revenue / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { region: "Nairobi", loans: 345, percentage: 28 },
                    { region: "Mombasa", loans: 234, percentage: 19 },
                    { region: "Kisumu", loans: 189, percentage: 15 },
                    { region: "Nakuru", loans: 156, percentage: 13 },
                    { region: "Eldoret", loans: 134, percentage: 11 },
                    { region: "Others", loans: 189, percentage: 14 },
                  ].map((region) => (
                    <div key={region.region} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{region.region}</h4>
                        <p className="text-sm text-muted-foreground">{region.loans} loans</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{region.percentage}%</div>
                        <Progress value={region.percentage} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-destructive">High Risk</h4>
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-sm text-muted-foreground">Active loans</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-warning">Medium Risk</h4>
                    <p className="text-2xl font-bold">67</p>
                    <p className="text-sm text-muted-foreground">Active loans</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-success">Low Risk</h4>
                    <p className="text-2xl font-bold">456</p>
                    <p className="text-sm text-muted-foreground">Active loans</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Risk Factors Analysis</h4>
                  <div className="space-y-3">
                    {[
                      { factor: "Credit History", score: 85, status: "Good" },
                      { factor: "Income Stability", score: 78, status: "Moderate" },
                      { factor: "Debt-to-Income Ratio", score: 92, status: "Excellent" },
                      { factor: "Employment Duration", score: 74, status: "Moderate" },
                    ].map((factor) => (
                      <div key={factor.factor} className="flex items-center justify-between">
                        <span className="text-sm">{factor.factor}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={factor.score} className="w-24 h-2" />
                          <Badge variant={factor.status === "Excellent" ? "default" : factor.status === "Good" ? "secondary" : "outline"}>
                            {factor.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PerformancePage;