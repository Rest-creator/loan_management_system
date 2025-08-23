import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientRegistrationForm from "@/components/ClientRegistrationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminRegisterPage = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Register New Client</h1>
              <p className="text-muted-foreground">Complete client registration form</p>
            </div>
          </div>
          <ClientRegistrationForm 
            onSubmit={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Registration</h1>
          <p className="text-muted-foreground">Register new clients for loan applications</p>
        </div>
        
        <div className="max-w-md">
          <Button onClick={() => setShowForm(true)} size="lg" className="w-full">
            Start Client Registration
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminRegisterPage;