import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";

interface StepTwoFormProps {
  formData: {
    office: string;
    reason: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
  offices: { id: string; name: string }[];
  onPreviousStep: () => void;
  loading: boolean;
}

export default function StepTwoForm({
  formData,
  setFormData,
  handleSubmit,
  offices,
  onPreviousStep,
  loading,
}: StepTwoFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="office">Select Office</Label>
        <Select
          value={formData.office}
          onValueChange={(value) => setFormData({ ...formData, office: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose your office" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {offices.map((office) => (
              <SelectItem key={office.id} value={office.id}>
                {office.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Access</Label>
        <Textarea
          id="reason"
          placeholder="Explain why you need access to this system..."
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
          rows={4}
        />
      </div>

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          onClick={onPreviousStep}
          variant="outline"
          className="w-full"
        >
          Previous
        </Button>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader className="animate-spin" />
            </>
          ) : (
            <p>Request Access</p>
          )}
        </Button>
      </div>
    </form>
  );
}
