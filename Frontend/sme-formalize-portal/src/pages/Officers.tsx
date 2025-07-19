import { useEffect, useState } from 'react'; // Import useEffect and useState
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { officers, offices } from '@/data/mockData'; // Remove mock data imports
import { Users, Mail, Building2, Shield, Loader2 } from 'lucide-react'; // Add Loader2
import { useAuth } from '../components/constants/AuthContext'; // Import useAuth
import API_ENDPOINTS from '@/components/constants/apiEndpoints'; // Assuming you have this

export default function Officers() {
  const { authAxios } = useAuth(); // Get authAxios from AuthContext
  const [officers, setOfficers] = useState([]);
  const [offices, setOffices] = useState([]); // State for offices (if fetching dynamically)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get role badge color (remains the same)
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'officer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchOfficersAndOffices = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch officers
        const officersResponse = await authAxios.get(API_ENDPOINTS.OFFICERS.LIST); 
        setOfficers(officersResponse.data);
        const officesResponse = await authAxios.get(API_ENDPOINTS.OFFICES.LIST); // Assuming API_ENDPOINTS.OFFICES.LIST points to /api/offices/
        setOffices(officesResponse.data);

      } catch (err) {
        console.error("Failed to fetch officers or offices:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficersAndOffices();
  }, [authAxios]); // Rerun effect if authAxios (which depends on authToken) changes

  // Helper to find office details from the fetched offices array
  const getOfficeDetails = (officeId: string) => {
    // This will now use the offices fetched from the backend
    return offices.find(office => office.id === officeId);
  };

  // Calculate stats dynamically from fetched officers
  const totalOfficers = officers.length;
  const totalOffices = offices.length; // Or just offices.length if only displaying unique ones
  const totalAdmins = officers.filter(o => o.role === 'admin').length;


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin h-8 w-8 mr-2" /> Loading Officers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-destructive">
        <p className="text-lg mb-2">Error: {error}</p>
        <p className="text-sm">Please ensure you have the necessary permissions and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Officers</h1>
        <p className="text-muted-foreground">Manage government officers and their roles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Officers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOfficers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offices</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOffices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdmins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officers.map(officer => {
          // Now use officer.office_name directly from backend, or lookup via office_id
          // Since your frontend expects `office.name` and `office.fullName` on the office object,
          // and the backend now provides `office_name` and `office_id`, we can adjust.
          // Option 1: Use `officer.office_name` directly for the main display
          // Option 2: If you fetched `offices` dynamically, find the full details:
          const officeData = getOfficeDetails(officer.office_id); // Find full office object if fetched

          return (
            <Card key={officer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {/* Ensure officer.first_name and officer.last_name are available */}
                      {officer.first_name?.[0]}{officer.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{officer.full_name}</h3>
                    <Badge
                      variant="secondary"
                      className={getRoleBadgeColor(officer.role)}
                    >
                      {officer.role.charAt(0).toUpperCase() + officer.role.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {officer.email}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    {/* Use office_name from the backend */}
                    {officer.office_name || 'N/A'} 
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      {/* If you need 'fullName' for offices, your Django Office model or serializer
                          would need to provide it (e.g., officeData?.description or a dedicated field).
                          For now, it will be blank if not provided by backend. */}
                      {officeData?.fullName || officer.office_name} {/* Fallback for full name if not in officeData */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Officers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Officer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Officer</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Office</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {officers.map(officer => {
                  const officeData = getOfficeDetails(officer.office_id); // Find full office object if fetched
                  return (
                    <tr key={officer.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-sm">
                              {officer.first_name?.[0]}{officer.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{officer.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {officer.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{officer.office_name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">
                             {officeData?.fullName || ''} {/* Leave blank if no full name from backend */}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={getRoleBadgeColor(officer.role)}
                        >
                          {officer.role.charAt(0).toUpperCase() + officer.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {/* Use officer.status_display from the backend */}
                        <Badge variant="outline" className={officer.status === 'approved' ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                          {officer.status_display || 'N/A'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}