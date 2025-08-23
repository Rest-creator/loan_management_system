import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Eye, Edit, Trash2, ArrowLeft, List, Grid3X3, UserPlus, Users, TrendingUp, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AgentClientsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Mock clients data for agent with Zimbabwe context
  const [clients] = useState([
    {
      id: 1,
      firstName: "Blessing",
      lastName: "Mukamuri",
      email: "blessing.mukamuri@gmail.com",
      phone: "+263712345678",
      location: "Harare, Highfield",
      status: "active",
      loanAmount: 500,
      creditScore: 750,
      joinDate: "2024-01-15",
      lastActivity: "2024-01-20",
      occupation: "Small Trader",
      avatar: null
    },
    {
      id: 2,
      firstName: "Taurai",
      lastName: "Chigodora", 
      email: "taurai.chigodora@gmail.com",
      phone: "+263723456789",
      location: "Bulawayo, Nkulumane",
      status: "pending",
      loanAmount: 750,
      creditScore: 680,
      joinDate: "2024-01-18",
      lastActivity: "2024-01-22",
      occupation: "Mechanic",
      avatar: null
    },
    {
      id: 3,
      firstName: "Grace",
      lastName: "Nyamundanda",
      email: "grace.nyamundanda@gmail.com", 
      phone: "+263734567890",
      location: "Mutare, Dangamvura",
      status: "active",
      loanAmount: 300,
      creditScore: 720,
      joinDate: "2024-01-10",
      lastActivity: "2024-01-21",
      occupation: "Hairdresser",
      avatar: null
    },
    {
      id: 4,
      firstName: "Tendai",
      lastName: "Sibanda",
      email: "tendai.sibanda@gmail.com",
      phone: "+263745678901",
      location: "Gweru, Mkoba",
      status: "inactive",
      loanAmount: 600,
      creditScore: 650,
      joinDate: "2023-12-05",
      lastActivity: "2024-01-10",
      occupation: "Farmer",
      avatar: null
    }
  ]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === "" || 
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "destructive" | "secondary" | "outline" } = {
      active: "default",
      pending: "secondary", 
      inactive: "outline"
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleViewProfile = (clientId: number) => {
    navigate(`/client-profile/${clientId}`);
  };

  const handleEdit = (clientId: number) => {
    toast({
      title: "Edit Client",
      description: `Edit functionality for client ID: ${clientId}`,
    });
  };

  const handleDelete = (clientId: number, clientName: string) => {
    toast({
      title: "Delete Client",
      description: `Delete confirmation for ${clientName}`,
      variant: "destructive",
    });
  };

  const ClientCard = ({ client }: { client: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {client.firstName[0]}{client.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base">{client.firstName} {client.lastName}</h3>
              <p className="text-sm text-muted-foreground">{client.occupation}</p>
            </div>
          </div>
          {getStatusBadge(client.status)}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span>{client.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span>{client.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Loan Amount:</span>
            <span className="font-medium">USD {client.loanAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Credit Score:</span>
            <span className={`font-medium ${client.creditScore >= 700 ? 'text-success' : client.creditScore >= 600 ? 'text-warning' : 'text-destructive'}`}>
              {client.creditScore}
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewProfile(client.id)}
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(client.id)}
            className="flex items-center space-x-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(client.id, `${client.firstName} ${client.lastName}`)}
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Clients</h1>
            <p className="text-muted-foreground">Clients onboarded by you</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">Registered clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.filter(c => c.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">USD {clients.reduce((sum, client) => sum + client.loanAmount, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Combined loan value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.filter(c => new Date(c.joinDate).getMonth() === new Date().getMonth()).length}</div>
              <p className="text-xs text-muted-foreground">Recent additions</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients Management */}
        <Card>
          <CardHeader>
            <CardTitle>Client Management</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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

            {/* Clients Display */}
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Loan Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={client.avatar} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {client.firstName[0]}{client.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.firstName} {client.lastName}</div>
                              <div className="text-sm text-muted-foreground">{client.occupation}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{client.phone}</div>
                            <div className="text-muted-foreground">{client.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{client.location}</TableCell>
                        <TableCell className="font-medium">USD {client.loanAmount}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewProfile(client.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(client.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(client.id, `${client.firstName} ${client.lastName}`)}
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

            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No clients found matching the current filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgentClientsPage;