import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RequestAccountForm from './RequestAccountForm';
import RequestAccountSuccess from './RequestAccountSuccess';
import coat_of_arms from "../../assets/coat_of_arms.png"; // Adjust path as needed
import API_ENDPOINTS from '@/components/constants/apiEndpoints';

const offices = [
  { id: 'zimra', name: 'ZIMRA' },
  { id: 'harare_council', name: 'Harare City Council' },
  { id: 'chitungwiza_minucipal', name: 'Chitungwiza Municipal' },
  { id: 'ministry_smes', name: 'Ministry of Women Affairs, Community, Small and Medium Enterprises Development' },
];

export default function RequestAccount() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1); // New state for steps
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    office: '',
    reason: '',
  });

  const handleNextStep = () => {
    // Basic validation before moving to the next step
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
        toast({
          title: "Validation Error",
          description: "Please fill in all personal details to proceed.",
          variant: "destructive",
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before actual submission
    if (!formData.office || !formData.reason) {
      toast({
        title: "Validation Error",
        description: "Please select your office and provide a reason for access.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true)

    const [firstName, ...lastNameParts] = formData.fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    const dataToSend = {
      email: formData.email,
      username: formData.email, // Common practice to use email as username
      password: formData.password,
      confirm_password: formData.confirmPassword,
      phone: formData.phone,
      office: formData.office,
      reason: formData.reason,
      first_name: firstName,
      last_name: lastName || '',
    };

    try {
      // Use the imported API_ENDPOINTS for the URL
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration error:", errorData);
        let errorMessage = "An unexpected error occurred. Please try again.";
        if (errorData) {
            if (typeof errorData === 'object') {
                errorMessage = Object.values(errorData).flat().join(' '); // Join all error messages
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            }
        }

        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const successData = await response.json();
      console.log("Registration successful:", successData);

      setIsSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your account request has been submitted for review. Please check your email for confirmation (if email is set up).",
      });

    } catch (error) {
      console.error("Network or unexpected error during registration:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please check your internet connection or try again later.",
        variant: "destructive",
      });
    }
    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Branding Header */}
      <div className="text-center mb-8">
       <div className="flex items-center justify-center space-x-2 mb-1">
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

      {isSubmitted ? (
        <RequestAccountSuccess navigate={navigate} />
      ) : (
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Request Officer Account</CardTitle>
            <CardDescription>
              Step {currentStep} of 2 - Apply for access to the SMEPulse government portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RequestAccountForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              offices={offices}
              navigate={navigate}
              loading={loading}
              currentStep={currentStep} // Pass current step
              onNextStep={handleNextStep} // Pass next step handler
              onPreviousStep={handlePreviousStep} // Pass previous step handler
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}