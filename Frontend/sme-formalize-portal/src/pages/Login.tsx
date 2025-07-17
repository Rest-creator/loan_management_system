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
import { offices } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import coat_of_arms from "../../assets/coat_of_arms.png";
import API_ENDPOINTS from "@/components/constants/apiEndpoints";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: email,
      password: password,
    };


    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
console.log(response);

      // If login failed
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "An unexpected error occurred. Please try again.";
        console.log(errorData);
        

        if (typeof errorData === "object") {
          errorMessage = Object.values(errorData).flat().join(" ");
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });

        return;
      }

      // If login succeeded
      const responseData = await response.json();
      console.log(responseData);
      
      localStorage.setItem("access_token", responseData.access);
      localStorage.setItem("refresh_token", responseData.refresh);

      toast({
        title: "Login Successful",
        description: "Redirecting you to your dashboard...",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Network or unexpected error during login:", error);
      toast({
        title: "Network Error",
        description:
          "Could not connect to the server. Please check your internet connection or try again later.",
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
            {/* <Building2 className="h-10 w-10 text-primary" /> */}
            <img src={coat_of_arms} />
            {/* <img src={smepulse_logo}/> */}
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
                    <Loader2 className="animate-spin" />{" "}
                  </>
                ) : (
                  <p>Sign In</p>
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
