import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface RequestAccountSuccessProps {
  navigate: (path: string) => void;
}

export default function RequestAccountSuccess({ navigate }: RequestAccountSuccessProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-accent-foreground" />
        </div>
        <CardTitle className="text-xl">Request Submitted</CardTitle>
        <CardDescription>
          Your account request has been submitted successfully. You will be notified via email once your request is reviewed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => navigate('/login')}
          className="w-full"
        >
          Return to Login
        </Button>
      </CardContent>
    </Card>
  );
}