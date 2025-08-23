import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BarChart3, PieChart, Map, Download, TrendingUp, Users, DollarSign, Calendar, ArrowLeft, FileText } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ReportsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedBranch, setSelectedBranch] = useState("all");

  // Check if navigated from revenue KPI card
  const activeTab = searchParams.get('view') === 'revenue' ? 'portfolio' : 'portfolio';

  // Mock data with Zimbabwe context
  const portfolioData = {
    totalLoans: 1247,
    totalValue: 850000000, // ZWL
    activeLoans: 956,
    completedLoans: 231,
    overdueLoans: 60,
    avgLoanSize: 680000,
    interestEarned: 127500000,
    defaultRate: 4.8
  };

  const riskAnalysis = {
    lowRisk: { count: 634, percentage: 66.3, amount: 430000000 },
    mediumRisk: { count: 245, percentage: 25.6, amount: 290000000 },
    highRisk: { count: 77, percentage: 8.1, amount: 130000000 }
  };

  const geographicData = [
    { province: "Harare", loans: 345, amount: 234000000, percentage: 27.5 },
    { province: "Bulawayo", loans: 189, amount: 165000000, percentage: 19.4 },
    { province: "Manicaland", loans: 156, amount: 128000000, percentage: 15.1 },
    { province: "Mashonaland Central", loans: 134, amount: 98000000, percentage: 11.5 },
    { province: "Masvingo", loans: 123, amount: 87000000, percentage: 10.2 },
    { province: "Others", loans: 300, amount: 138000000, percentage: 16.3 }
  ];

  const monthlyTrends = [
    { month: "Jul 2024", applications: 98, approved: 78, value: 53000000, revenue: 7950000 },
    { month: "Aug 2024", applications: 112, approved: 89, value: 61000000, revenue: 9150000 },
    { month: "Sep 2024", applications: 105, approved: 84, value: 58000000, revenue: 8700000 },
    { month: "Oct 2024", applications: 118, approved: 92, value: 64000000, revenue: 9600000 },
    { month: "Nov 2024", applications: 124, approved: 98, value: 68000000, revenue: 10200000 },
    { month: "Dec 2024", applications: 135, approved: 108, value: 75000000, revenue: 11250000 }
  ];

  const sectorAnalysis = [
    { sector: "Agriculture", count: 298, amount: 201000000, avgSize: 675000, risk: "Medium" },
    { sector: "Mining", count: 187, amount: 168000000, avgSize: 898000, risk: "High" },
    { sector: "Retail Trade", count: 245, amount: 147000000, avgSize: 600000, risk: "Low" },
    { sector: "Manufacturing", count: 134, amount: 121000000, avgSize: 903000, risk: "Medium" },
    { sector: "Services", count: 189, amount: 98000000, avgSize: 518000, risk: "Low" },
    { sector: "Education", count: 194, amount: 115000000, avgSize: 593000, risk: "Low" }
  ];

  const formatCurrency = (amount: number, currency = "ZWL") => {
    if (currency === "ZWL") {
      return `ZWL ${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 38500 / 1000).toFixed(1)}K`; // Rough ZWL to USD conversion
  };

  const exportReport = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} report...`);
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground">Comprehensive business intelligence and performance insights</p>
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
            <Button variant="outline" onClick={() => exportReport('complete')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue={activeTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="geographic" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Geographic</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{portfolioData.totalLoans.toLocaleString()}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+8.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{formatCurrency(portfolioData.totalValue)}</div>
                  <p className="text-xs text-muted-foreground">{formatCurrency(portfolioData.totalValue, "USD")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{portfolioData.activeLoans}</div>
                  <p className="text-xs text-muted-foreground">{((portfolioData.activeLoans / portfolioData.totalLoans) * 100).toFixed(1)}% of total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{portfolioData.defaultRate}%</div>
                  <Progress value={portfolioData.defaultRate} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Sector Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sectorAnalysis.map((sector) => (
                    <div key={sector.sector} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold">{sector.sector}</h4>
                          <p className="text-sm text-muted-foreground">{sector.count} loans</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(sector.amount)}</div>
                          <div className="text-sm text-muted-foreground">Avg: {formatCurrency(sector.avgSize)}</div>
                        </div>
                        <Badge variant={sector.risk === "Low" ? "default" : sector.risk === "Medium" ? "secondary" : "destructive"}>
                          {sector.risk} Risk
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-success">Low Risk Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{riskAnalysis.lowRisk.count}</div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Amount:</span>
                      <span className="font-medium">{formatCurrency(riskAnalysis.lowRisk.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Percentage:</span>
                      <span className="font-medium">{riskAnalysis.lowRisk.percentage}%</span>
                    </div>
                    <Progress value={riskAnalysis.lowRisk.percentage} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-warning">Medium Risk Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{riskAnalysis.mediumRisk.count}</div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Amount:</span>
                      <span className="font-medium">{formatCurrency(riskAnalysis.mediumRisk.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Percentage:</span>
                      <span className="font-medium">{riskAnalysis.mediumRisk.percentage}%</span>
                    </div>
                    <Progress value={riskAnalysis.mediumRisk.percentage} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">High Risk Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{riskAnalysis.highRisk.count}</div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Amount:</span>
                      <span className="font-medium">{formatCurrency(riskAnalysis.highRisk.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Percentage:</span>
                      <span className="font-medium">{riskAnalysis.highRisk.percentage}%</span>
                    </div>
                    <Progress value={riskAnalysis.highRisk.percentage} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factors Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { factor: "Credit History", score: 78, impact: "High" },
                    { factor: "Income Stability", score: 65, impact: "Medium" },
                    { factor: "Collateral Value", score: 89, impact: "High" },
                    { factor: "Debt-to-Income Ratio", score: 82, impact: "Medium" },
                    { factor: "Employment Duration", score: 71, impact: "Low" },
                    { factor: "Geographic Location", score: 74, impact: "Medium" }
                  ].map((factor) => (
                    <div key={factor.factor} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{factor.factor}</span>
                        <Badge variant={factor.impact === "High" ? "destructive" : factor.impact === "Medium" ? "secondary" : "outline"}>
                          {factor.impact} Impact
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <Progress value={factor.score} className="w-24 h-2" />
                        <span className="text-sm font-medium w-12">{factor.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Provincial Distribution</CardTitle>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    <SelectItem value="harare">Harare</SelectItem>
                    <SelectItem value="bulawayo">Bulawayo</SelectItem>
                    <SelectItem value="manicaland">Manicaland</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {geographicData.map((location) => (
                    <div key={location.province} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{location.province}</h4>
                        <p className="text-sm text-muted-foreground">{location.loans} loans</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-medium">{formatCurrency(location.amount)}</div>
                        <div className="flex items-center space-x-2">
                          <Progress value={location.percentage} className="w-16 h-2" />
                          <span className="text-xs">{location.percentage}%</span>
                        </div>
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
                    <div key={trend.month} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                      <div className="font-semibold mb-2 sm:mb-0">{trend.month}</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{trend.applications}</div>
                          <div className="text-muted-foreground">Applications</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{trend.approved}</div>
                          <div className="text-muted-foreground">Approved</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{formatCurrency(trend.value)}</div>
                          <div className="text-muted-foreground">Loan Value</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{formatCurrency(trend.revenue)}</div>
                          <div className="text-muted-foreground">Revenue</div>
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

export default ReportsPage;