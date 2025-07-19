// src/components/TopHeader.jsx
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import coat_of_arms from "../../../assets/coat_of_arms.png";
import { useAuth } from "../constants/AuthContext"; // Adjust path
import { useNavigate } from "react-router-dom";

export const TopHeader = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // No need for currentOffice state or useEffect with mockOffices
  // The 'user' object from the backend now contains 'office_display'
  // which is the human-readable name of the office.

  if (isLoading) {
    return (
      <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src={coat_of_arms} className="h-14" />
            <div>
              <h1 className="text-xl font-bold text-primary">SMEPULSE</h1>
              <p className="text-xs text-muted-foreground">Government Portal</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">Loading user data...</p>
        </div>
      </header>
    );
  }

  if (!user) {
    navigate("/");
  }

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const officerName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email;

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src={coat_of_arms} className="h-14" />
          <div>
            <h1 className="text-xl font-bold text-primary">SMEPULSE</h1>
            <p className="text-xs text-muted-foreground">Government Portal</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{officerName}</p>
          {/* Directly use user.office_display from the backend */}
          <p className="text-xs text-muted-foreground">
            {user.office_display || "N/A"}
          </p>
        </div>

        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(officerName)}
          </AvatarFallback>
        </Avatar>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};
