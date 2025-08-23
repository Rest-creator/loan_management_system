import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Users, Settings, Bell, Shield, Database, Mail, ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // System configuration state
  const [systemConfig, setSystemConfig] = useState({
    maxLoanAmount: "500000",
    defaultInterestRate: "15.5",
    processingFee: "2.0",
    maxLoanTerm: "36",
    autoApprovalLimit: "10000",
    currencyPrimary: "ZWL",
    currencySecondary: "USD",
    workingDays: "monday-friday",
    businessHours: "08:00-17:00"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    systemAlerts: true,
    lowBalanceAlert: true,
    overduePaymentAlert: true,
    newApplicationAlert: true
  });

  // Mock users data with Zimbabwe context
  const [users, setUsers] = useState([
    { id: 1, name: "Tinashe Mukamuri", email: "tmukamuri@probitas.co.zw", role: "Admin", status: "Active", branch: "Harare Central", lastLogin: "2024-01-15 14:30" },
    { id: 2, name: "Chipo Manyika", email: "cmanyika@probitas.co.zw", role: "Agent", status: "Active", branch: "Bulawayo", lastLogin: "2024-01-15 16:45" },
    { id: 3, name: "Kudakwashe Sithole", email: "ksithole@probitas.co.zw", role: "Agent", status: "Active", branch: "Mutare", lastLogin: "2024-01-15 11:20" },
    { id: 4, name: "Nyaradzo Nhongo", email: "nnhongo@probitas.co.zw", role: "Auditor", status: "Inactive", branch: "Gweru", lastLogin: "2024-01-10 09:15" },
  ]);

  const handleSaveSystemConfig = () => {
    toast({
      title: "System Configuration Updated",
      description: "All system settings have been saved successfully.",
    });
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setDeleteDialogOpen(false);
    toast({
      title: "User Deleted",
      description: `${selectedUser.name} has been removed from the system.`,
    });
  };

  const handleSaveUser = () => {
    setUserDialogOpen(false);
    toast({
      title: selectedUser ? "User Updated" : "User Created",
      description: selectedUser ? "User information has been updated." : "New user has been created successfully.",
    });
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">System configuration and user management</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="system" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Loan Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Maximum Loan Amount (ZWL)</Label>
                      <Input 
                        value={systemConfig.maxLoanAmount}
                        onChange={(e) => setSystemConfig(prev => ({...prev, maxLoanAmount: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Interest Rate (%)</Label>
                      <Input 
                        value={systemConfig.defaultInterestRate}
                        onChange={(e) => setSystemConfig(prev => ({...prev, defaultInterestRate: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Processing Fee (%)</Label>
                      <Input 
                        value={systemConfig.processingFee}
                        onChange={(e) => setSystemConfig(prev => ({...prev, processingFee: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maximum Loan Term (months)</Label>
                      <Input 
                        value={systemConfig.maxLoanTerm}
                        onChange={(e) => setSystemConfig(prev => ({...prev, maxLoanTerm: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Auto-Approval Limit (ZWL)</Label>
                    <Input 
                      value={systemConfig.autoApprovalLimit}
                      onChange={(e) => setSystemConfig(prev => ({...prev, autoApprovalLimit: e.target.value}))}
                    />
                  </div>
                  <Button onClick={handleSaveSystemConfig} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Regional Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Currency</Label>
                      <Select value={systemConfig.currencyPrimary} onValueChange={(value) => setSystemConfig(prev => ({...prev, currencyPrimary: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ZWL">Zimbabwe Dollar (ZWL)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Currency</Label>
                      <Select value={systemConfig.currencySecondary} onValueChange={(value) => setSystemConfig(prev => ({...prev, currencySecondary: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="ZWL">Zimbabwe Dollar (ZWL)</SelectItem>
                          <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Working Days</Label>
                      <Select value={systemConfig.workingDays} onValueChange={(value) => setSystemConfig(prev => ({...prev, workingDays: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday-friday">Monday - Friday</SelectItem>
                          <SelectItem value="monday-saturday">Monday - Saturday</SelectItem>
                          <SelectItem value="all-days">All Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Business Hours</Label>
                      <Select value={systemConfig.businessHours} onValueChange={(value) => setSystemConfig(prev => ({...prev, businessHours: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00-17:00">08:00 - 17:00</SelectItem>
                          <SelectItem value="09:00-18:00">09:00 - 18:00</SelectItem>
                          <SelectItem value="24/7">24/7 Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <Button onClick={handleCreateUser} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden md:table-cell">Branch</TableHead>
                        <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "Admin" ? "default" : user.role === "Agent" ? "secondary" : "outline"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{user.branch}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">General Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Email Notifications</Label>
                        <Switch 
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, emailNotifications: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>SMS Notifications</Label>
                        <Switch 
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, smsNotifications: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>System Alerts</Label>
                        <Switch 
                          checked={notificationSettings.systemAlerts}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, systemAlerts: checked}))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Automated Alerts</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Low Balance Alert</Label>
                        <Switch 
                          checked={notificationSettings.lowBalanceAlert}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, lowBalanceAlert: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Overdue Payment Alert</Label>
                        <Switch 
                          checked={notificationSettings.overduePaymentAlert}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, overduePaymentAlert: checked}))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>New Application Alert</Label>
                        <Switch 
                          checked={notificationSettings.newApplicationAlert}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, newApplicationAlert: checked}))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Password Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Password Length</Label>
                    <Input defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password Expiry (days)</Label>
                    <Input defaultValue="90" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Require Uppercase</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require Numbers</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require Special Characters</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Input defaultValue="3" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Two-Factor Authentication</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>IP Whitelist</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Audit Logging</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Dialog */}
        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedUser ? "Edit User" : "Create New User"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={selectedUser?.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={selectedUser?.email} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue={selectedUser?.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select defaultValue={selectedUser?.branch}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Harare Central">Harare Central</SelectItem>
                    <SelectItem value="Bulawayo">Bulawayo</SelectItem>
                    <SelectItem value="Mutare">Mutare</SelectItem>
                    <SelectItem value="Gweru">Gweru</SelectItem>
                    <SelectItem value="Masvingo">Masvingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>
                {selectedUser ? "Update" : "Create"} User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteUser}>
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;