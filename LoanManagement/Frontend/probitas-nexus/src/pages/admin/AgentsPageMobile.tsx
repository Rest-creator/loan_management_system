import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Search, Edit, Trash2, Eye, UserPlus, Users, TrendingUp, Award, ArrowLeft, List, Grid3X3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const agentFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  role: z.enum(["agent", "admin"]),
  region: z.string().min(1, "Please select a region"),
  branch: z.string().min(1, "Please select a branch"),
  employeeId: z.string().min(1, "Employee ID is required"),
  notes: z.string().optional(),
});

type AgentFormData = z.infer<typeof agentFormSchema>;

const AgentsPageMobile = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock agents data with Zimbabwe context
  const [agents] = useState([
    {
      id: 1,
      firstName: "Tendai",
      lastName: "Mukamuri",
      email: "tendai.mukamuri@probitas.com",
      phone: "+263712345678",
      role: "agent" as const,
      region: "Harare",
      branch: "CBD",
      employeeId: "EMP001",
      status: "active" as const,
      joinDate: "2023-01-15",
      loansProcessed: 89,
      approvalRate: 82,
      revenue: 45000,
      rating: 4.8,
      lastActive: "2024-01-15 14:30",
      avatar: null
    },
    {
      id: 2,
      firstName: "Blessing",
      lastName: "Chigodora",
      email: "blessing.chigodora@probitas.com",
      phone: "+263723456789",
      role: "admin" as const,
      region: "Bulawayo",
      branch: "Nkulumane",
      employeeId: "EMP002",
      status: "active" as const,
      joinDate: "2022-11-20",
      loansProcessed: 156,
      approvalRate: 88,
      revenue: 78000,
      rating: 4.9,
      lastActive: "2024-01-15 15:45",
      avatar: null
    },
    {
      id: 3,
      firstName: "Grace",
      lastName: "Nyamundanda",
      email: "grace.nyamundanda@probitas.com",
      phone: "+263734567890",
      role: "agent" as const,
      region: "Mutare",
      branch: "Dangamvura",
      employeeId: "EMP003",
      status: "inactive" as const,
      joinDate: "2023-06-10",
      loansProcessed: 45,
      approvalRate: 75,
      revenue: 22500,
      rating: 4.3,
      lastActive: "2024-01-10 09:15",
      avatar: null
    },
    {
      id: 4,
      firstName: "Taurai",
      lastName: "Sibanda",
      email: "taurai.sibanda@probitas.com",
      phone: "+263745678901",
      role: "agent" as const,
      region: "Gweru",
      branch: "Mkoba",
      employeeId: "EMP004",
      status: "active" as const,
      joinDate: "2023-03-22",
      loansProcessed: 67,
      approvalRate: 80,
      revenue: 33500,
      rating: 4.6,
      lastActive: "2024-01-15 16:20",
      avatar: null
    }
  ]);

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "agent",
      region: "",
      branch: "",
      employeeId: "",
      notes: "",
    },
  });

  const onSubmit = (data: AgentFormData) => {
    console.log("Creating agent:", data);
    toast({
      title: "Agent Created",
      description: `${data.firstName} ${data.lastName} has been successfully added to the system.`,
    });
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === "" || 
      `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || agent.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={role === "admin" ? "destructive" : "outline"}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const handleViewAgent = (agentId: number) => {
    toast({
      title: "View Agent",
      description: `View details for agent ID: ${agentId}`,
    });
  };

  const handleEditAgent = (agentId: number) => {
    toast({
      title: "Edit Agent",
      description: `Edit functionality for agent ID: ${agentId}`,
    });
  };

  const handleDeleteAgent = (agentId: number, agentName: string) => {
    toast({
      title: "Delete Agent",
      description: `Delete confirmation for ${agentName}`,
      variant: "destructive",
    });
  };

  const AgentCard = ({ agent }: { agent: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={agent.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {agent.firstName[0]}{agent.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base">{agent.firstName} {agent.lastName}</h3>
              <p className="text-sm text-muted-foreground">{agent.employeeId}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            {getRoleBadge(agent.role)}
            {getStatusBadge(agent.status)}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span>{agent.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Region:</span>
            <span>{agent.region}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Branch:</span>
            <span>{agent.branch}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Performance:</span>
            <span className="font-medium">{agent.loansProcessed} loans ({agent.approvalRate}%)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rating:</span>
            <span className="font-medium">★ {agent.rating}</span>
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewAgent(agent.id)}
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditAgent(agent.id)}
            className="flex items-center space-x-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteAgent(agent.id, `${agent.firstName} ${agent.lastName}`)}
            className="flex items-center space-x-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Agents Management</h1>
            <p className="text-muted-foreground">Manage agents, admins, and track performance</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Agent</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Agent/Admin</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* ... keep existing form content ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+263712345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Agent</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.filter(a => a.role === "agent").length}</div>
              <p className="text-xs text-muted-foreground">Active field agents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.filter(a => a.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">Online this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">81%</div>
              <p className="text-xs text-muted-foreground">Approval rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">★ 4.9</div>
              <p className="text-xs text-muted-foreground">Blessing Chigodora</p>
            </CardContent>
          </Card>
        </div>

        {/* Agents Management */}
        <Card>
          <CardHeader>
            <CardTitle>All Agents & Admins</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or employee ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="flex items-center space-x-1"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Cards</span>
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="flex items-center space-x-1"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Table</span>
                </Button>
              </div>
            </div>

            {/* Agents Display */}
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={agent.avatar} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {agent.firstName[0]}{agent.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{agent.firstName} {agent.lastName}</div>
                              <div className="text-sm text-muted-foreground">{agent.employeeId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{agent.phone}</div>
                            <div className="text-muted-foreground">{agent.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(agent.role)}</TableCell>
                        <TableCell>{getStatusBadge(agent.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAgent(agent.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAgent(agent.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAgent(agent.id, `${agent.firstName} ${agent.lastName}`)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredAgents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No agents found matching the current filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPageMobile;
