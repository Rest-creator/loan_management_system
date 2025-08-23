import { useState } from "react";
import { Search, Edit, Trash2, Eye, User, Phone, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock clients data
const clientsData = [
  {
    id: "1",
    name: "John Banda",
    email: "john@example.com",
    phone: "+260 97 1234567",
    address: "Lusaka, Zambia",
    joinDate: "2023-06-15",
    status: "active",
    totalLoans: 3,
    activeLoans: 1,
    creditScore: 720,
    avatar: "/placeholder.svg",
    agent: "Mary Agent"
  },
  {
    id: "2",
    name: "Robson Kawa",
    email: "robson@example.com",
    phone: "+260 97 2345678",
    address: "Ndola, Zambia",
    joinDate: "2023-05-20",
    status: "active",
    totalLoans: 2,
    activeLoans: 0,
    creditScore: 680,
    avatar: "/placeholder.svg",
    agent: "Peter Agent"
  },
  {
    id: "3",
    name: "Michael Shumba",
    email: "michael@example.com",
    phone: "+260 97 3456789",
    address: "Kitwe, Zambia",
    joinDate: "2023-04-10",
    status: "inactive",
    totalLoans: 1,
    activeLoans: 0,
    creditScore: 580,
    avatar: "/placeholder.svg",
    agent: "Jane Agent"
  },
  {
    id: "4",
    name: "Grace Mulenga",
    email: "grace@example.com",
    phone: "+260 97 4567890",
    address: "Livingstone, Zambia",
    joinDate: "2023-07-22",
    status: "active",
    totalLoans: 2,
    activeLoans: 2,
    creditScore: 750,
    avatar: "/placeholder.svg",
    agent: "David Agent"
  },
  {
    id: "5",
    name: "James Musonda",
    email: "james@example.com",
    phone: "+260 97 5678901",
    address: "Chipata, Zambia",
    joinDate: "2023-03-15",
    status: "active",
    totalLoans: 4,
    activeLoans: 1,
    creditScore: 700,
    avatar: "/placeholder.svg",
    agent: "Sarah Agent"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success text-success-foreground";
    case "inactive":
      return "bg-muted text-muted-foreground";
    case "suspended":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const ClientsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    clientId: string | null;
    clientName: string;
  }>({ open: false, clientId: null, clientName: "" });

  const filteredClients = clientsData.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (clientId: string) => {
    navigate(`/admin/clients/${clientId}/edit`);
  };

  const handleDelete = (clientId: string, clientName: string) => {
    setDeleteDialog({ open: true, clientId, clientName });
  };

  const confirmDelete = () => {
    if (deleteDialog.clientId) {
      toast({
        title: "Client Deleted",
        description: `${deleteDialog.clientName} has been removed from the system.`,
        variant: "destructive",
      });
      setDeleteDialog({ open: false, clientId: null, clientName: "" });
    }
  };

  const handleViewProfile = (clientId: string) => {
    navigate(`/admin/clients/${clientId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
            <p className="text-muted-foreground">Manage all registered clients</p>
          </div>
          <Button onClick={() => navigate('/admin/register')}>
            Add New Client
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{clientsData.length}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{clientsData.filter(c => c.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{clientsData.reduce((sum, c) => sum + c.activeLoans, 0)}</p>
                <p className="text-sm text-muted-foreground">Active Loans</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{Math.round(clientsData.reduce((sum, c) => sum + c.creditScore, 0) / clientsData.length)}</p>
                <p className="text-sm text-muted-foreground">Avg Credit Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
          </div>
        </div>

        {/* Clients Display */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{client.address}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Total Loans</p>
                          <p className="text-muted-foreground">{client.totalLoans}</p>
                        </div>
                        <div>
                          <p className="font-medium">Active Loans</p>
                          <p className="text-muted-foreground">{client.activeLoans}</p>
                        </div>
                        <div>
                          <p className="font-medium">Credit Score</p>
                          <p className="text-muted-foreground">{client.creditScore}</p>
                        </div>
                        <div>
                          <p className="font-medium">Join Date</p>
                          <p className="text-muted-foreground">{client.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewProfile(client.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEdit(client.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(client.id, client.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Loans</TableHead>
                    <TableHead>Credit Score</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={client.avatar} alt={client.name} />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.address}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{client.email}</p>
                          <p className="text-sm text-muted-foreground">{client.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">Total: {client.totalLoans}</p>
                          <p className="text-sm text-muted-foreground">Active: {client.activeLoans}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{client.creditScore}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{client.agent}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
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
                            onClick={() => handleDelete(client.id, client.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Client</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete <strong>{deleteDialog.clientName}</strong>? 
              This action cannot be undone and will remove all associated data.
            </p>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialog({ open: false, clientId: null, clientName: "" })}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;