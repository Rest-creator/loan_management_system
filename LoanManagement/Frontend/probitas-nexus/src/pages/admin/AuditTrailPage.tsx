import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Filter, Download, Eye, User, FileText, Settings, DollarSign } from "lucide-react";

const AuditTrailPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUser, setFilterUser] = useState("all");

  // Mock audit trail data
  const auditLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 10:30:45",
      userId: "admin001",
      userName: "John Admin",
      action: "LOGIN",
      resource: "System",
      details: "User logged into admin dashboard",
      ipAddress: "192.168.1.100",
      status: "SUCCESS",
      riskLevel: "LOW"
    },
    {
      id: 2,
      timestamp: "2024-01-15 10:35:12",
      userId: "agent002",
      userName: "Mary Agent",
      action: "CREATE",
      resource: "Loan Application",
      details: "Created new loan application for client ID: CL-2024-001 (Blessing Mukamuri)",
      ipAddress: "192.168.1.101",
      status: "SUCCESS",
      riskLevel: "MEDIUM"
    },
    {
      id: 3,
      timestamp: "2024-01-15 11:15:33",
      userId: "admin001",
      userName: "John Admin",
      action: "APPROVE",
      resource: "Loan Application",
      details: "Approved loan application LA-2024-005 for USD 500",
      ipAddress: "192.168.1.100",
      status: "SUCCESS",
      riskLevel: "HIGH"
    },
    {
      id: 4,
      timestamp: "2024-01-15 11:45:21",
      userId: "agent003",
      userName: "Peter Agent",
      action: "UPDATE",
      resource: "Client Profile",
      details: "Updated client information for CL-2024-002",
      ipAddress: "192.168.1.102",
      status: "SUCCESS",
      riskLevel: "LOW"
    },
    {
      id: 5,
      timestamp: "2024-01-15 12:10:44",
      userId: "unknown",
      userName: "Unknown User",
      action: "LOGIN_FAILED",
      resource: "System",
      details: "Failed login attempt with invalid credentials",
      ipAddress: "203.45.67.89",
      status: "FAILED",
      riskLevel: "HIGH"
    },
    {
      id: 6,
      timestamp: "2024-01-15 14:20:15",
      userId: "admin001",
      userName: "John Admin",
      action: "DELETE",
      resource: "User Account",
      details: "Deleted inactive agent account AG-2023-045",
      ipAddress: "192.168.1.100",
      status: "SUCCESS",
      riskLevel: "HIGH"
    },
    {
      id: 7,
      timestamp: "2024-01-15 15:30:22",
      userId: "agent002",
      userName: "Mary Agent",
      action: "EXPORT",
      resource: "Client Data",
      details: "Exported client list for regional analysis",
      ipAddress: "192.168.1.101",
      status: "SUCCESS",
      riskLevel: "MEDIUM"
    },
    {
      id: 8,
      timestamp: "2024-01-15 16:45:38",
      userId: "admin001",
      userName: "John Admin",
      action: "CONFIG_CHANGE",
      resource: "System Settings",
      details: "Modified loan approval threshold from USD 300 to USD 500",
      ipAddress: "192.168.1.100",
      status: "SUCCESS",
      riskLevel: "HIGH"
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
      case "LOGIN_FAILED":
        return <User className="h-4 w-4" />;
      case "CREATE":
      case "UPDATE":
      case "DELETE":
        return <FileText className="h-4 w-4" />;
      case "APPROVE":
      case "REJECT":
        return <DollarSign className="h-4 w-4" />;
      case "CONFIG_CHANGE":
        return <Settings className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "SUCCESS" ? "default" : "destructive"}>
        {status}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const variant = risk === "HIGH" ? "destructive" : risk === "MEDIUM" ? "secondary" : "outline";
    return <Badge variant={variant}>{risk}</Badge>;
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || log.action === filterType;
    const matchesUser = filterUser === "all" || log.userId === filterUser;
    
    return matchesSearch && matchesType && matchesUser;
  });

  const exportAuditLog = () => {
    // In a real app, this would export to CSV/PDF
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-trail-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Trails</h1>
            <p className="text-muted-foreground">Track all system activities and user actions</p>
          </div>
          <Button onClick={exportAuditLog} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Log</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions Today</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">3</div>
              <p className="text-xs text-muted-foreground">Security alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Actions</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">7</div>
              <p className="text-xs text-muted-foreground">Require review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Current users</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search actions, users, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="APPROVE">Approve</SelectItem>
                  <SelectItem value="EXPORT">Export</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin001">Tendai Admin</SelectItem>
                  <SelectItem value="agent002">Blessing Agent</SelectItem>
                  <SelectItem value="agent003">Grace Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audit Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead className="hidden lg:table-cell">Details</TableHead>
                    <TableHead className="hidden md:table-cell">IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-primary-foreground font-semibold">
                              {log.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{log.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <span className="text-sm">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{log.resource}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm max-w-xs truncate">
                        {log.details}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{log.ipAddress}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{getRiskBadge(log.riskLevel)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No audit logs found matching the current filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AuditTrailPage;