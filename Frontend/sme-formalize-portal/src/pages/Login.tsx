// src/pages/Login.jsx (or wherever your Login component is located)
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed: import { offices } from "@/data/mockData"; // Not used in this version of Login
import { useNavigate } from "react-router-dom";
import coat_of_arms from "../../assets/coat_of_arms.png";
// Removed: import API_ENDPOINTS from "@/components/constants/apiEndpoints"; // Use AuthContext for API calls
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "../components/constants/AuthContext"; // Import useAuth hook

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOffice, setSelectedOffice] = useState(""); // Still present but not used for login payload
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: authLogin } = useAuth(); // Destructure 'login' from useAuth and rename it to 'authLogin' to avoid conflict

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the login function from AuthContext
      const success = await authLogin(email, password);

      if (success) {
        toast({
          title: "Login Successful",
          description: "Redirecting you to your dashboard...",
        });
        navigate("/dashboard");
      } else {
        // authLogin would typically throw an error if unsuccessful,
        // so this 'else' block might not be reached if the catch handles it.
        // However, if authLogin returns false on failure, this would trigger.
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) { // Use 'any' for now or define a more specific error type
      console.error("Login attempt failed:", error);
      // AuthContext's login function is designed to throw the error from the API call.
      // We can inspect the error to provide a more specific message.
      let errorMessage = "An unexpected error occurred. Please try again.";

      // Assuming API errors might be nested or have a 'detail' field
      if (error.response?.data) {
        if (typeof error.response.data === "object") {
          // Flatten error messages from DRF
          errorMessage = Object.values(error.response.data).flat().join(" ");
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <img src={coat_of_arms} className="h-24" alt="Coat of Arms" /> {/* Added alt text */}
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1 font-bold">
            Republic of Zimbabwe
          </p>
          <p className="text-muted-foreground ">
            <h1 className="font-bold text-primary">SMEPULSE</h1>Government
            Officer Portal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Officer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="officer@example.gov.zw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

            

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/request-account")}
                  className="text-primary hover:underline"
                >
                  Request officer access
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}