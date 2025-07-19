import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { offices } from '@/data/mockData'; // Assuming 'offices' array is still needed for the dropdown
import { User, Bell, Shield, Save, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import { useAuth } from '../components/constants/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

export default function Settings() {
  const { user, isLoading: isAuthLoading } = useAuth(); // Get user and authentication loading state
  const navigate = useNavigate();

  // Initialize state based on user data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    office: '',
    role: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyReports: true,
    applicationUpdates: true
  });

  // --- Effect to initialize profile state when user data is available ---
  useEffect(() => {
    if (!isAuthLoading && user) {
      setProfile({
        // Assuming your user object has these properties
        name: user.full_name || user.first_name + ' ' + user.last_name || '',
        email: user.email || '',
        office: user.office_id || '', // Use office_id for consistency with data
        role: user.role || ''
      });
      // You might also fetch saved notification preferences here
    }
  }, [user, isAuthLoading]); // Re-run when user or auth loading state changes

  // --- Effect to redirect if user is not authenticated ---
  useEffect(() => {
    if (!isAuthLoading && user === null) {
      console.log("User is null and not loading, navigating to /");
      navigate('/');
    }
  }, [user, isAuthLoading, navigate]);

  const handleSaveProfile = () => {
    console.log('Saving profile:', profile);
    // TODO: Implement API call to update user profile
    alert('Profile saved! (This is a mock action)');
  };

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications);
    // TODO: Implement API call to update notification preferences
    alert('Notification preferences saved! (This is a mock action)');
  };

  // --- Render loading state or redirect message ---
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin h-8 w-8 mr-2" /> Loading User Data...
      </div>
    );
  }

  if (user === null) {
    // This case should primarily be handled by the useEffect redirect.
    // This fallback ensures nothing breaks if the redirect is delayed or fails.
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        You are not logged in. Redirecting...
      </div>
    );
  }

  // At this point, 'user' is guaranteed to be an object.
  const userRole = user.role;
  const userFullName = user.full_name || user.first_name + ' ' + user.last_name;
  const avatarFallbackText = userFullName.split(' ').map(n => n[0]).join('') || user.email[0]?.toUpperCase() || 'U';


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and notification preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {avatarFallbackText}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                readOnly // Email is often not editable
              />
            </div>

            {/* Office field only editable if role is admin for flexibility, otherwise display as read-only text */}
            <div className="space-y-2">
              <Label htmlFor="office">Office</Label>
              {userRole === 'admin' ? (
                <Select value={profile.office} onValueChange={(value) => setProfile({ ...profile, office: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an office" />
                  </SelectTrigger>
                  <SelectContent>
                    {offices.map((office) => (
                      <SelectItem key={office.id} value={office.id}>
                        {office.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                // Display current office name if not admin, map ID to full name
                <Input
                  id="office-display"
                  value={offices.find(o => o.id === profile.office)?.fullName || "N/A"}
                  readOnly
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              {userRole === 'admin' ? (
                <Select value={profile.role} onValueChange={(value) => setProfile({ ...profile, role: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="officer">Officer</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                // Display current role as read-only text if not admin
                <Input
                  id="role-display"
                  value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} // Capitalize first letter
                  readOnly
                />
              )}
            </div>

            <Button onClick={handleSaveProfile} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications in your browser
                </p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, pushNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summary reports
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, weeklyReports: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Application Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications when applications are updated
                </p>
              </div>
              <Switch
                checked={notifications.applicationUpdates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, applicationUpdates: checked })
                }
              />
            </div>

            <Button onClick={handleSaveNotifications} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>

            <Button variant="outline" className="w-full">
              Change Password
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">
                Last login: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
              <Button variant="outline" size="sm">
                View Login History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Settings (Admin Only) */}
        {userRole === 'admin' && ( // Use userRole from the context
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Processing Time Target (days)</Label>
                <Input type="number" defaultValue="3" />
              </div>

              <div className="space-y-2">
                <Label>Auto-assignment Rules</Label>
                <Select defaultValue="round_robin">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round_robin">Round Robin</SelectItem>
                    <SelectItem value="workload_based">Workload Based</SelectItem>
                    <SelectItem value="manual">Manual Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full">
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}