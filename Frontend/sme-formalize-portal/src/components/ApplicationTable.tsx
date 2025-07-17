import { Application } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';

interface ApplicationTableProps {
  applications: Application[];
}

export const ApplicationTable = ({ applications }: ApplicationTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 font-medium text-sm">Application ID</th>
            <th className="text-left p-3 font-medium text-sm">Applicant</th>
            <th className="text-left p-3 font-medium text-sm">Business Name</th>
            <th className="text-left p-3 font-medium text-sm">Date Submitted</th>
            <th className="text-left p-3 font-medium text-sm">Status</th>
            <th className="text-left p-3 font-medium text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id} className="border-b border-border hover:bg-muted/50">
              <td className="p-3 text-sm font-mono">{application.id}</td>
              <td className="p-3">
                <div>
                  <div className="font-medium text-sm">{application.applicantName}</div>
                  <div className="text-xs text-muted-foreground">{application.whatsappNumber}</div>
                </div>
              </td>
              <td className="p-3 text-sm">{application.businessName}</td>
              <td className="p-3 text-sm">{new Date(application.dateSubmitted).toLocaleDateString()}</td>
              <td className="p-3">
                <StatusBadge status={application.status} />
              </td>
              <td className="p-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/applications/${application.id}`)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};