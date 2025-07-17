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

export const offices: Office[] = [
  {
    id: "zimra",
    name: "ZIMRA",
    logo: zimra_logo,
    fullName: "Zimbabwe Revenue Authority",
    description: "Tax registration and compliance",
  },
  {
    id: "chitungwiza_municipal",
    name: "Chitungwiza Municipal",
    logo: company_reg_logo,
    fullName: "Chitungwiza Municipal",
    description: "Local business licensing",
  },
  {
    id: "harare_council",
    name: "Harare Council",
    fullName: "City of Harare",
    logo: harare_city_logo,
    description: "Local business licensing",
  },
  {
    id: "ministry_smes",
    name: "Ministry SMEs",
    fullName: "Ministry of Women Affairs, Community, Small and Medium Enterprises Development",
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

export const applications: Application[] = [
  {
    id: "APP-2024-001",
    applicantName: "Tendai Mapfumo",
    businessName: "Tendai General Store",
    whatsappNumber: "+263712345678",
    dateSubmitted: "2024-01-15",
    status: "pending",
    assignedOfficer: "John Mukamuri",
    officeId: "zimra",
    businessType: "Retail",
    location: "Warren Park, Harare",
    description: "General goods store selling groceries and household items",
    documents: [
      {
        id: "d1",
        name: "National ID",
        type: "identity",
        url: "/docs/id_001.pdf",
        verified: true,
      },
      {
        id: "d2",
        name: "Proof of Address",
        type: "address",
        url: "/docs/address_001.pdf",
        verified: false,
      },
      {
        id: "d3",
        name: "Business Photos",
        type: "business_proof",
        url: "/docs/photos_001.pdf",
        verified: true,
      },
    ],
  },
  {
    id: "APP-2024-002",
    applicantName: "Mary Chinembiri",
    businessName: "Mary's Hair Salon",
    whatsappNumber: "+263723456789",
    dateSubmitted: "2024-01-14",
    status: "approved",
    assignedOfficer: "Sarah Chikwava",
    officeId: "companies_registry",
    businessType: "Services",
    location: "Mbare, Harare",
    description: "Hair styling and beauty services",
    documents: [
      {
        id: "d4",
        name: "National ID",
        type: "identity",
        url: "/docs/id_002.pdf",
        verified: true,
      },
      {
        id: "d5",
        name: "Lease Agreement",
        type: "address",
        url: "/docs/lease_002.pdf",
        verified: true,
      },
      {
        id: "d6",
        name: "Equipment Photos",
        type: "business_proof",
        url: "/docs/equipment_002.pdf",
        verified: true,
      },
    ],
  },
  {
    id: "APP-2024-003",
    applicantName: "James Sibanda",
    businessName: "Sibanda Carpentry Works",
    whatsappNumber: "+263734567890",
    dateSubmitted: "2024-01-13",
    status: "needs_clarification",
    assignedOfficer: "Michael Tembo",
    officeId: "harare_council",
    businessType: "Manufacturing",
    location: "Chitungwiza",
    description: "Custom furniture making and repair services",
    documents: [
      {
        id: "d7",
        name: "National ID",
        type: "identity",
        url: "/docs/id_003.pdf",
        verified: true,
      },
      {
        id: "d8",
        name: "Workshop Photos",
        type: "business_proof",
        url: "/docs/workshop_003.pdf",
        verified: false,
      },
    ],
  },
  {
    id: "APP-2024-004",
    applicantName: "Ruth Mashonganyika",
    businessName: "Ruth's Vegetables",
    whatsappNumber: "+263745678901",
    dateSubmitted: "2024-01-12",
    status: "pending",
    assignedOfficer: "Grace Ndebele",
    officeId: "nssa",
    businessType: "Agriculture",
    location: "Epworth, Harare",
    description: "Fresh vegetable sales and distribution",
    documents: [
      {
        id: "d9",
        name: "National ID",
        type: "identity",
        url: "/docs/id_004.pdf",
        verified: true,
      },
      {
        id: "d10",
        name: "Market Stall Photo",
        type: "business_proof",
        url: "/docs/stall_004.pdf",
        verified: true,
      },
    ],
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
