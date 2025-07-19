import {
  Application,
  Office,
  Officer,
  IssuedDocument,
  DashboardStats,
} from "../types";
import zimra_logo from "../../assets/zimra.png";
import company_reg_logo from "../../assets/company_reg.png";
import harare_city_logo from "../../assets/harare_city.png";
import chitungwiza from "../../assets/chitungwiza_municipal.png";

export const offices: Office[] = [
  {
    id: "zimra",
    name: "ZIMRA",
    logo: zimra_logo,
    fullName: "Zimbabwe Revenue Authority",
    description: "Tax registration and compliance",
  },

  {
    id: "harare_council",
    name: "Harare Council",
    fullName: "City of Harare",
    logo: harare_city_logo,
    description: "Local business licensing",
  },
  {
    id: "chitungwiza_municipal",
    name: "Chitungwiza Municipal",
    logo: chitungwiza,
    fullName: "Chitungwiza Municipal",
    description: "Local business licensing",
  },
  {
    id: "ministry_smes",
    name: "Ministry SMEs",
    fullName:
      "Ministry of Women Affairs, Community, Small and Medium Enterprises Development",
    description: "SME development and support",
    logo: zimra_logo,
  },
];

export const officers: Officer[] = [
  {
    id: "1",
    name: "John Mukamuri",
    email: "j.mukamuri@zimra.gov.zw",
    officeId: "zimra",
    role: "officer",
  },
  {
    id: "2",
    name: "Sarah Chikwava",
    email: "s.chikwava@companies.gov.zw",
    officeId: "companies_registry",
    role: "supervisor",
  },
  {
    id: "3",
    name: "Michael Tembo",
    email: "m.tembo@harare.gov.zw",
    officeId: "harare_council",
    role: "officer",
  },
  {
    id: "4",
    name: "Grace Ndebele",
    email: "g.ndebele@nssa.gov.zw",
    officeId: "nssa",
    role: "officer",
  },
  {
    id: "5",
    name: "David Moyo",
    email: "d.moyo@smes.gov.zw",
    officeId: "ministry_smes",
    role: "admin",
  },
];

export const applications = [
  {
    id: 'APP001',
    applicantName: 'Jane Doe',
    businessName: 'Doe Solutions Pvt Ltd',
    businessType: 'Private Limited Company',
    whatsappNumber: '+263771234567',
    email: 'jane.doe@example.com',
    dateSubmitted: '2025-07-01T10:00:00Z',
    status: 'pending',
    assignedOfficer: 'Officer A',
    documents: [
      { name: 'Certificate of Incorporation', url: '/docs/app001_coi.pdf', type: 'incorporation' },
      { name: 'Memorandum & Articles of Association', url: '/docs/app001_memo.pdf', type: 'memorandum' },
      { name: 'CR14', url: '/docs/app001_cr14.pdf', type: 'cr14' },
      { name: 'Proof of Address', url: '/docs/app001_poa.pdf', type: 'proof_of_address' },
    ],
    notes: 'Awaiting ZIMRA verification.',
    // Add TIN field - this would be populated once approved by ZIMRA
    tin: null, // Initially null, will be assigned a value upon ZIMRA approval
  },
  {
    id: 'APP002',
    applicantName: 'John Smith',
    businessName: 'Smith Enterprises',
    businessType: 'Sole Proprietorship',
    whatsappNumber: '+263712345678',
    email: 'john.smith@example.com',
    dateSubmitted: '2025-06-28T14:30:00Z',
    status: 'approved',
    assignedOfficer: 'Officer B',
    documents: [
      { name: 'National ID Copy', url: '/docs/app002_id.pdf', type: 'national_id' },
      { name: 'Proof of Residence', url: '/docs/app002_poa.pdf', type: 'proof_of_address' },
    ],
    notes: 'Approved. TIN assigned: 100000001',
    tin: '100000001', // Example TIN
  },
  {
    id: 'APP003',
    applicantName: 'Sarah Johnson',
    businessName: 'Johnson Consultancy',
    businessType: 'Partnership',
    whatsappNumber: '+263788765432',
    email: 'sarah.j@example.com',
    dateSubmitted: '2025-07-05T09:15:00Z',
    status: 'needs_clarification',
    assignedOfficer: 'Officer C',
    documents: [
      { name: 'Partnership Agreement', url: '/docs/app003_pa.pdf', type: 'partnership_agreement' },
      { name: 'Partner IDs', url: '/docs/app003_pids.pdf', type: 'partner_ids' },
    ],
    notes: 'Missing partner ID for Mark Davis.',
    tin: null,
  },
  {
    id: 'APP004',
    applicantName: 'Michael Brown',
    businessName: 'Brown Tech Solutions',
    businessType: 'Private Limited Company',
    whatsappNumber: '+263777654321',
    email: 'michael.b@example.com',
    dateSubmitted: '2025-06-20T11:45:00Z',
    status: 'rejected',
    assignedOfficer: 'Officer A',
    documents: [],
    notes: 'Application incomplete, missing required documents.',
    tin: null,
  },
  {
    id: 'APP005',
    applicantName: 'Emily White',
    businessName: 'White Marketing Agency',
    businessType: 'Sole Proprietorship',
    whatsappNumber: '+263711223344',
    email: 'emily.w@example.com',
    dateSubmitted: '2025-07-08T16:00:00Z',
    status: 'pending',
    assignedOfficer: 'Officer B',
    documents: [
      { name: 'National ID Copy', url: '/docs/app005_id.pdf', type: 'national_id' },
    ],
    notes: 'Pending initial review.',
    tin: null,
  },
  {
    id: 'APP006',
    applicantName: 'David Green',
    businessName: 'Green Logistics',
    businessType: 'Private Limited Company',
    whatsappNumber: '+263778901234',
    email: 'david.g@example.com',
    dateSubmitted: '2025-07-02T08:00:00Z',
    status: 'approved',
    assignedOfficer: 'Officer C',
    documents: [
        { name: 'Certificate of Incorporation', url: '/docs/app006_coi.pdf', type: 'incorporation' },
    ],
    notes: 'Approved. TIN assigned: 100000002',
    tin: '100000002',
  },
];


export const issuedDocuments: IssuedDocument[] = [
  {
    id: "DOC-2024-001",
    type: "business_registration",
    applicationId: "APP-2024-002",
    applicantName: "Mary Chinembiri",
    businessName: "Mary's Hair Salon",
    issuedDate: "2024-01-16",
    issuedBy: "Sarah Chikwava",
    certificateNumber: "BR-2024-0001",
  },
  {
    id: "DOC-2024-002",
    type: "tax_clearance",
    applicationId: "APP-2024-002",
    applicantName: "Mary Chinembiri",
    businessName: "Mary's Hair Salon",
    issuedDate: "2024-01-16",
    issuedBy: "John Mukamuri",
    certificateNumber: "TC-2024-0001",
  },
];

export const dashboardStats: DashboardStats = {
  totalApplications: 247,
  pendingReview: 23,
  approvedToday: 8,
  avgProcessingTime: "3.2 days",
};

// Mock current officer
export const currentOfficer: Officer = officers[0];
