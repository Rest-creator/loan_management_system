import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Application } from '@/types';
import { Eye, Phone, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApplicationCardProps {
  application: Application;
}

export const ApplicationCard = ({ application }: ApplicationCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-foreground">{application.businessName}</h3>
            <p className="text-sm text-muted-foreground">{application.applicantName}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            {application.whatsappNumber}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {application.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(application.dateSubmitted).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-muted-foreground">ID: </span>
            <span className="text-xs font-mono">{application.id}</span>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to={`/applications/${application.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};