import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calculator, PieChart, TrendingUp, DollarSign, Calendar, Percent, ArrowLeft, Zap } from "lucide-react";

const LoanCalculatorPage = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [termUnit, setTermUnit] = useState<string>("months");
  const [loanType, setLoanType] = useState<string>("reducing");
  const [processingFee, setProcessingFee] = useState<string>("2");
  const [insuranceFee, setInsuranceFee] = useState<string>("1");
  const [gracePeriod, setGracePeriod] = useState<string>("0");
  const [penaltyRate, setPenaltyRate] = useState<string>("5");

  const [calculationResult, setCalculationResult] = useState<any>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const term = parseFloat(loanTerm);
    const processing = parseFloat(processingFee) / 100;
    const insurance = parseFloat(insuranceFee) / 100;

    if (!principal || !rate || !term) {
      alert("Please fill in all required fields");
      return;
    }

    let monthlyRate: number;
    let numberOfPayments: number;

    if (termUnit === "years") {
      monthlyRate = rate / 12;
      numberOfPayments = term * 12;
    } else {
      monthlyRate = rate / 12;
      numberOfPayments = term;
    }

    let monthlyPayment: number;
    let totalPayment: number;
    let totalInterest: number;

    if (loanType === "reducing") {
      // Reducing balance (compound interest)
      if (monthlyRate === 0) {
        monthlyPayment = principal / numberOfPayments;
      } else {
        monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
      totalPayment = monthlyPayment * numberOfPayments;
      totalInterest = totalPayment - principal;
    } else {
      // Flat rate (simple interest)
      totalInterest = principal * rate * (termUnit === "years" ? term : term / 12);
      totalPayment = principal + totalInterest;
      monthlyPayment = totalPayment / numberOfPayments;
    }

    const processingAmount = principal * processing;
    const insuranceAmount = principal * insurance;
    const totalFees = processingAmount + insuranceAmount;
    const netAmount = principal - totalFees;

    // Generate payment schedule
    const schedule = [];
    let remainingBalance = principal;

    for (let i = 1; i <= numberOfPayments; i++) {
      let interestPayment: number;
      let principalPayment: number;

      if (loanType === "reducing") {
        interestPayment = remainingBalance * monthlyRate;
        principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
      } else {
        interestPayment = totalInterest / numberOfPayments;
        principalPayment = principal / numberOfPayments;
        remainingBalance -= principalPayment;
      }

      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(remainingBalance, 0)
      });
    }

    setCalculationResult({
      loanAmount: principal,
      monthlyPayment,
      totalPayment,
      totalInterest,
      processingAmount,
      insuranceAmount,
      totalFees,
      netAmount,
      numberOfPayments,
      loanType,
      schedule: schedule.slice(0, 12) // Show first 12 months
    });
  };

  const resetCalculator = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
    setTermUnit("months");
    setLoanType("reducing");
    setProcessingFee("2");
    setInsuranceFee("1");
    setCalculationResult(null);
  };

  const formatCurrency = (amount: number, currency = "ZWL") => {
    if (currency === "ZWL") {
      return new Intl.NumberFormat('en-ZW', {
        style: 'currency',
        currency: 'ZWL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      // USD conversion (approximate rate)
      const usdAmount = amount / 38500;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(usdAmount);
    }
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Advanced Loan Calculator</h1>
              <p className="text-muted-foreground">Sophisticated loan calculations with Zimbabwe market rates</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Loan Parameters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <div className="relative">
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="pr-20"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Badge variant="outline">ZWL</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  USD equivalent: {loanAmount ? formatCurrency(parseFloat(loanAmount), "USD") : "$0"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="15.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Loan Term</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    placeholder="12"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termUnit">Unit</Label>
                  <Select value={termUnit} onValueChange={setTermUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanType">Interest Calculation Method</Label>
                <Select value={loanType} onValueChange={setLoanType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reducing">Reducing Balance</SelectItem>
                    <SelectItem value="flat">Flat Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="processingFee">Processing Fee (%)</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    step="0.1"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceFee">Insurance Fee (%)</Label>
                  <Input
                    id="insuranceFee"
                    type="number"
                    step="0.1"
                    value={insuranceFee}
                    onChange={(e) => setInsuranceFee(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="gracePeriod">Grace Period (months)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="penaltyRate">Penalty Rate (%)</Label>
                  <Input
                    id="penaltyRate"
                    type="number"
                    step="0.1"
                    value={penaltyRate}
                    onChange={(e) => setPenaltyRate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={calculateLoan} className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Payment
                </Button>
                <Button variant="outline" onClick={resetCalculator}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Loan Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Personal Loan", amount: "50000", rate: "15.5", term: "12", type: "reducing", description: "Standard personal financing" },
                { name: "Business Loan", amount: "200000", rate: "12.0", term: "24", type: "reducing", description: "SME expansion capital" },
                { name: "Emergency Loan", amount: "25000", rate: "18.0", term: "6", type: "flat", description: "Quick cash assistance" },
                { name: "Agricultural Loan", amount: "75000", rate: "13.5", term: "18", type: "reducing", description: "Farming & livestock" },
                { name: "Education Loan", amount: "40000", rate: "11.0", term: "36", type: "reducing", description: "School & university fees" },
                { name: "Asset Financing", amount: "300000", rate: "14.0", term: "48", type: "reducing", description: "Equipment & machinery" },
              ].map((template) => (
                <div key={template.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{template.name}</h4>
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-xs">ZWL {parseInt(template.amount).toLocaleString()}</Badge>
                    <Badge variant="outline" className="text-xs">{template.rate}%</Badge>
                    <Badge variant="outline" className="text-xs">{template.term}mo</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setLoanAmount(template.amount);
                      setInterestRate(template.rate);
                      setLoanTerm(template.term);
                      setLoanType(template.type);
                      setTermUnit("months");
                    }}
                  >
                    <Calculator className="h-3 w-3 mr-2" />
                    Use Template
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {calculationResult && (
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Payment Summary</TabsTrigger>
              <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
              <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
              <TabsTrigger value="comparison">Loan Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(calculationResult.monthlyPayment)}
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {calculationResult.loanType === "reducing" ? "Reducing Balance" : "Flat Rate"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Payment</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(calculationResult.totalPayment)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Over {calculationResult.numberOfPayments} payments
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Interest</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(calculationResult.totalInterest)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((calculationResult.totalInterest / calculationResult.loanAmount) * 100).toFixed(1)}% of principal
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(calculationResult.netAmount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      After fees: {formatCurrency(calculationResult.totalFees)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Cost Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">Principal Amount</span>
                      <span className="font-bold">{formatCurrency(calculationResult.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Total Interest</span>
                      <span>{formatCurrency(calculationResult.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Processing Fee</span>
                      <span>{formatCurrency(calculationResult.processingAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Insurance Fee</span>
                      <span>{formatCurrency(calculationResult.insuranceAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
                      <span className="font-bold">Total Cost</span>
                      <span className="font-bold text-lg">{formatCurrency(calculationResult.totalPayment)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Schedule (First 12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Month</th>
                          <th className="text-right p-2">Payment</th>
                          <th className="text-right p-2">Principal</th>
                          <th className="text-right p-2">Interest</th>
                          <th className="text-right p-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculationResult.schedule.map((payment: any) => (
                          <tr key={payment.month} className="border-b">
                            <td className="p-2">{payment.month}</td>
                            <td className="text-right p-2">{formatCurrency(payment.payment)}</td>
                            <td className="text-right p-2">{formatCurrency(payment.principal)}</td>
                            <td className="text-right p-2">{formatCurrency(payment.interest)}</td>
                            <td className="text-right p-2">{formatCurrency(payment.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {calculationResult.numberOfPayments > 12 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Showing first 12 payments of {calculationResult.numberOfPayments} total payments
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Comparison Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Different Terms Comparison</h4>
                      <div className="space-y-3">
                        {[6, 12, 18, 24].map((months) => {
                          const rate = parseFloat(interestRate) / 100 / 12;
                          const principal = parseFloat(loanAmount);
                          const payment = rate === 0 ? principal / months : 
                            (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
                          const total = payment * months;
                          
                          return (
                            <div key={months} className="flex justify-between items-center p-2 border rounded">
                              <span>{months} months</span>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(payment)}/month</p>
                                <p className="text-xs text-muted-foreground">Total: {formatCurrency(total)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Interest Rate Impact</h4>
                      <div className="space-y-3">
                        {[10, 12.5, 15, 17.5, 20].map((rate) => {
                          const monthlyRate = rate / 100 / 12;
                          const principal = parseFloat(loanAmount);
                          const term = parseFloat(loanTerm);
                          const payment = monthlyRate === 0 ? principal / term : 
                            (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
                          
                          return (
                            <div key={rate} className="flex justify-between items-center p-2 border rounded">
                              <span>{rate}% interest</span>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(payment)}/month</p>
                                <p className="text-xs text-muted-foreground">
                                  {rate === parseFloat(interestRate) ? "Current" : 
                                   rate > parseFloat(interestRate) ? "Higher" : "Lower"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LoanCalculatorPage;