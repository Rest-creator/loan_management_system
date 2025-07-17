import React from 'react';
import { Button } from '@/components/ui/button';
import StepOneForm from './AccountSteps/StepOneForm'; // Import new step component
import StepTwoForm from './AccountSteps/StepTwoForm'; // Import new step component

interface RequestAccountFormProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    office: string;
    reason: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
  offices: { id: string; name: string }[];
  navigate: (path: string) => void;
  currentStep: number; // New prop for current step
  onNextStep: () => void; // New prop for next step handler
  onPreviousStep: () => void; // New prop for previous step handler
  loading: boolean;
}

export default function RequestAccountForm({
  formData,
  setFormData,
  handleSubmit,
  offices,
  navigate,
  currentStep,
  onNextStep,
  onPreviousStep,
  loading,
}: RequestAccountFormProps) {
  return (
    <>
      {currentStep === 1 && (
        <StepOneForm
          formData={formData}
          setFormData={setFormData}
          onNextStep={onNextStep}
          navigate={navigate} // Pass navigate to StepOneForm
        />
      )}
      {currentStep === 2 && (
        <StepTwoForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          offices={offices}
          loading={loading}
          onPreviousStep={onPreviousStep}
        />
      )}
    </>
  );
}