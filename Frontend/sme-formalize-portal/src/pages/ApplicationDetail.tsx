import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/StatusBadge';
import { applications } from '@/data/mockData';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Download,
  Check,
  X,
  MessageSquare,
  Award
} from 'lucide-react';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  
  const application = applications.find(app => app.id === id);
  
  if (!application) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Application not found</p>
        <Button onClick={() => navigate('/applications')} className="mt-4">
          Back to Applications
        </Button>
      </div>
    );
  }

  const handleApprove = () => {
    // In a real app, this would update the application status
    console.log('Approving application:', application.id);
  };

  const handleReject = () => {
    // In a real app, this would update the application status
    console.log('Rejecting application:', application.id);
  };

  const handleRequestClarification = () => {
    // In a real app, this would update the application status and send a message
    console.log('Requesting clarification for:', application.id, 'Comment:', comment);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/applications')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{application.businessName}</h1>
            <p className="text-muted-foreground">Application ID: {application.id}</p>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applicant Name</label>
                  <p className="mt-1">{application.applicantName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <p className="mt-1">{application.businessName}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{application.whatsappNumber}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{application.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{new Date(application.dateSubmitted).toLocaleDateString()}</span>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                  <p className="mt-1">{application.businessType}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">Business Description</label>
                <p className="mt-1">{application.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={doc.verified} 
                          onChange={() => {}} 
                          id={`verify-${doc.id}`}
                        />
                        <label htmlFor={`verify-${doc.id}`} className="text-sm">
                          Verified
                        </label>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Officer Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add comments or request clarification..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleRequestClarification}>
                Request Clarification
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned Officer</label>
                  <p className="mt-1">{application.assignedOfficer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Office</label>
                  <p className="mt-1">{application.officeId.replace('_', ' ').toUpperCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleApprove} className="w-full bg-success hover:bg-success/90">
                <Check className="h-4 w-4 mr-2" />
                Approve Application
              </Button>
              
              <Button 
                onClick={() => setShowIssueModal(true)} 
                variant="outline" 
                className="w-full"
              >
                <Award className="h-4 w-4 mr-2" />
                Issue Document
              </Button>
              
              <Button onClick={handleReject} variant="destructive" className="w-full">
                <X className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </CardContent>
          </Card>

          {/* Processing Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-muted-foreground">{new Date(application.dateSubmitted).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium">Under Review</p>
                    <p className="text-muted-foreground">In progress</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium text-muted-foreground">Document Issuance</p>
                    <p className="text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}