import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Import Select components

interface StepOneFormProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string; // This will now be the combined number when passed down/up
  };
  // Adjusted setFormData to explicitly define expected updates if you prefer strict typing
  setFormData: React.Dispatch<React.SetStateAction<{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    office: string; // Assuming office is part of the form data in the parent
    reason: string; // Assuming reason is part of the form data in the parent
  }>>;
  onNextStep: () => void;
  navigate: (path: string) => void;
}

// Define the country codes
const PHONE_CODES = [
  { label: 'ZW', value: '+263' },
  { label: 'SA', value: '+27' },
  { label: 'BS', value: '+267' },
  { label: 'MZ', value: '+258' },
  { label: 'ZA', value: '+260' },
];

export default function StepOneForm({ formData, setFormData, onNextStep, navigate }: StepOneFormProps) {
  // Local state for the phone code and number part
  // Initialize with values from formData.phone if available, otherwise defaults
  const initialPhoneCode = formData.phone ? PHONE_CODES.find(pc => formData.phone.startsWith(pc.value))?.value || '+263' : '+263';
  const initialPhoneNumber = formData.phone ? formData.phone.replace(initialPhoneCode, '') : '';

  const [selectedPhoneCode, setSelectedPhoneCode] = useState<string>(initialPhoneCode);
  const [localPhoneNumber, setLocalPhoneNumber] = useState<string>(initialPhoneNumber);


  // Function to handle changes in the local phone number input
  const handleLocalPhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocalNumber = e.target.value;
    setLocalPhoneNumber(newLocalNumber);
    // Combine the code and local number to update the parent formData
    setFormData(prev => ({ ...prev, phone: `${selectedPhoneCode}${newLocalNumber}` }));
  };

  // Function to handle changes in the phone code dropdown
  const handlePhoneCodeChange = (value: string) => {
    setSelectedPhoneCode(value);
    // Combine the new code and current local number to update the parent formData
    setFormData(prev => ({ ...prev, phone: `${value}${localPhoneNumber}` }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Official Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
      </div>

      {/* --- Phone Number with Dropdown --- */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2"> {/* Use flex to put dropdown and input side-by-side */}
          <Select onValueChange={handlePhoneCodeChange} value={selectedPhoneCode}>
            <SelectTrigger className="w-[120px]"> {/* Adjust width as needed */}
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {PHONE_CODES.map((code) => (
                <SelectItem key={code.value} value={code.value}>
                  {code.value} ({code.label})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            value={localPhoneNumber} // Bind to local state for input
            onChange={handleLocalPhoneNumberChange} // Use local handler
            required
            placeholder="e.g., 771234567"
          />
        </div>
      </div>
      {/* --- End Phone Number with Dropdown --- */}

      <Button type="button" onClick={onNextStep} className="w-full">
        Next Step
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}