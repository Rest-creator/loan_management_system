export interface Application {
  id: string;
  applicantName: string;
  businessName: string;
  whatsappNumber: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'needs_clarification' | 'rejected';
  assignedOfficer: string;
  officeId: string;
  documents: Document[];
  businessType: string;
  location: string;
  description: string;
  tin: string;
  comments: [];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  verified: boolean;
}

export interface Office {
  id: string;
  name: string;
  fullName: string;
  description: string;
  logo : string;
}

export interface Officer {
  id: string;
  name: string;
  email: string;
  officeId: string;
  role: 'officer' | 'supervisor' | 'admin';
}

export interface IssuedDocument {
  id: string;
  type: 'business_registration' | 'tax_clearance' | 'business_license' | 'nssa_compliance';
  applicationId: string;
  applicantName: string;
  businessName: string;
  issuedDate: string;
  issuedBy: string;
  certificateNumber: string;
}

export interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  approvedToday: number;
  avgProcessingTime: string;
}