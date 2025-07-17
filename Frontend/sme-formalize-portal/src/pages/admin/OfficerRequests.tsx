import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCheck, UserX, Clock, Mail, Phone, Building, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import API_ENDPOINTS from '../../components/constants/apiEndpoints';

interface OfficerRequest {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    office: string;
    reason: string;
    date_joined: string;
    status: 'pending' | 'approved' | 'rejected';
}

export default function OfficerRequests() {
    const [requests, setRequests] = useState<OfficerRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Function to fetch pending requests
    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Get the access token from local storage
            const accessToken = localStorage.getItem('access_token');

            if (!accessToken) {
                // Handle case where token is missing (e.g., redirect to login)
                throw new Error("No access token found. Please log in again.");
            }

            const response = await fetch(API_ENDPOINTS.USERS.PENDING_APPROVALS, {
                method: 'GET', // Or 'POST'/'PUT' depending on your Django view
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // <--- ADD THIS LINE
                },
            });

            
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.detail || 'Failed to fetch requests');
            }
            
            const data: OfficerRequest[] = await response.json();
            console.log(data);
            setRequests(data);
        } catch (err: any) {
            console.error("Error fetching requests:", err);
            setError(err.message || 'An error occurred while fetching requests.');
            toast({
                title: "Error",
                description: err.message || "Failed to load officer requests.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Fetch requests on component mount
    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const updateRequestStatus = async (requestId: number, newStatus: 'approved' | 'rejected') => {
        let url = '';
        let successTitle = '';
        let successDescription = '';
        let errorDescription = '';

        if (newStatus === 'approved') {
            url = API_ENDPOINTS.USERS.APPROVE_USER(requestId);
            successTitle = "Request Approved";
            successDescription = "Officer account has been created and activated.";
            errorDescription = "Failed to approve request.";
        } else {
            url = API_ENDPOINTS.USERS.REJECT_USER(requestId);
            successTitle = "Request Rejected";
            successDescription = "Officer request has been rejected.";
            errorDescription = "Failed to reject request.";
        }

        try {
            // Get the access token from local storage
            const accessToken = localStorage.getItem('access_token');

            if (!accessToken) {
                throw new Error("No access token found. Please log in again.");
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // <--- ADD THIS LINE
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Failed to ${newStatus} request`);
            }

            await fetchRequests(); // Re-fetch all requests to get the latest status

            toast({
                title: successTitle,
                description: successDescription,
                variant: newStatus === 'approved' ? "default" : "destructive",
            });

        } catch (err: any) {
            console.error(`Error ${newStatus}ing request:`, err);
            toast({
                title: "Error",
                description: err.message || errorDescription,
                variant: "destructive",
            });
        }
    };

    const handleApprove = (requestId: number) => {
        updateRequestStatus(requestId, 'approved');
    };

    const handleReject = (requestId: number) => {
        updateRequestStatus(requestId, 'rejected');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-warning text-warning-foreground"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'approved':
                return <Badge variant="default" className="bg-success text-success-foreground"><UserCheck className="w-3 h-3 mr-1" />Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive"><UserX className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return null;
        }
    };

    const pendingCount = requests.filter(req => req.status === 'pending').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Officer Requests</h1>
                    <p className="text-muted-foreground">
                        Manage account requests from government officers
                    </p>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-2">
                    {pendingCount} Pending
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-2 text-muted-foreground">Loading requests...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center text-destructive p-4">
                            <p>Error: {error}</p>
                            <Button onClick={fetchRequests} className="mt-2">Try Again</Button>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center text-muted-foreground p-4">
                            <p>No officer requests to display.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Officer Details</TableHead>
                                    <TableHead>Office</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Request Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{request.first_name} {request.last_name}</div>
                                                <div className="text-sm text-muted-foreground">{request.email}</div>
                                                <div className="text-sm text-muted-foreground mt-1 max-w-xs">
                                                    {request.reason}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                                                {request.office}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm">
                                                    <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                                                    {request.email}
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                                                    {request.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(request.date_joined).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(request.status)}
                                        </TableCell>
                                        <TableCell>
                                            {request.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(request.id)}
                                                        className="bg-success hover:bg-success/90 text-success-foreground"
                                                    >
                                                        <UserCheck className="w-3 h-3 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleReject(request.id)}
                                                    >
                                                        <UserX className="w-3 h-3 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}