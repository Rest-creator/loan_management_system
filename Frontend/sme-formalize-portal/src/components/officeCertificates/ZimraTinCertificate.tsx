// src/components/ZimraTinCertificate.tsx
import React from "react";
import {
  Award,
  Building,
  Calendar,
  Hash,
  MapPin,
  Printer,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import zimra_logo from "../../../assets/zimra.png"; // Ensure this path is correct for your project

interface ZimraTinCertificateProps {
  application: {
    tin: string;
    businessName: string;
    businessType: string;
    applicantName: string;
    location: string;
    dateSubmitted: string; // Used as Registration Date
  };
  onPrint: () => void;
}

const ZimraTinCertificate: React.FC<ZimraTinCertificateProps> = ({
  application,
  onPrint,
}) => {
  const issuanceDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  // You might generate a unique certificate number here in a real application
  // Using current year, application ID, and a simple hash for mock purposes
  const certificateNumber = `ZIMRA/TIN/${
    application.tin || "XXXXXXX"
  }/${new Date().getFullYear()}`;
  const tinNumber = application.tin || "N/A";
  const registrationDate = new Date(
    application.dateSubmitted
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-1 py-1 bg-white shadow-2xl  w-[794px] mx-auto font-sans relative overflow-hidden print:shadow-none print:border-0 print:py-0 print:m-0">
      {/* Optional Background watermark/pattern */}
      {/* This ensures the watermark doesn't print by default */}
      <div className="absolute inset-0 bg-[url('/path-to-subtle-watermark.png')] opacity-10 pointer-events-none z-0 print:hidden"></div>

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center mb-10 pb-8 border-b-2 border-blue-400">
        <img src={zimra_logo} alt="ZIMRA Logo" className="h-24 w-auto mb-6" />{" "}
        {/* Increased logo size */}
        <h1 className="text-xl font-extrabold text-blue-900 text-center uppercase tracking-wider leading-tight">
          Zimbabwe Revenue Authority
        </h1>
        <h2 className="text-xl font-bold text-blue-700 text-center mt-4">
          TAXPAYER IDENTIFICATION NUMBER (TIN) CERTIFICATE
        </h2>
        <p className="text-md text-gray-600 mt-3">
          Issued under the Revenue Authority Act (Chapter 23:11)
        </p>
      </div>

      {/* Certificate Body */}
      <div className="relative z-10 text-center mb-10">
        <p className="text-md text-gray-800 font-semibold mb-6">
          This is to certify that
        </p>
        <p className="text-xl font-black text-blue-900 mt-2 tracking-wide uppercase leading-tight">
          {application.businessName || "N/A"}
        </p>
        <p className="text-md text-gray-800 font-semibold mt-6">
          has been duly registered for tax purposes with the
        </p>
        <p className="text-md text-blue-800 font-bold mt-2">
          Zimbabwe Revenue Authority (ZIMRA)
        </p>
      </div>

      {/* Key Details Section */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-16 text-gray-800 text-md mb-1 px-4">
        <div className="flex items-center">
          <span className="font-bold">TIN:</span>{" "}
          <span className="ml-4 font-mono text-md text-blue-900 tracking-wider">
            {tinNumber}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-bold">Business Type:</span>{" "}
          <span className="ml-4 capitalize">
            {application.businessType || "N/A"}
          </span>
        </div>
        <div className="flex items-start">
          <div className="flex flex-col">
            <span className="font-bold">Registered Entity:</span>
            <span className="ml-0 mt-2">
              {application.businessName || "N/A"}
            </span>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex flex-col">
            <span className="font-bold">Registered Address:</span>
            <span className="ml-0 mt-2">{application.location || "N/A"}</span>
          </div>
        </div>
        <div className="flex items-center">
         
          <span className="font-bold">Registration Date:</span>{" "}
          <span className="ml-4">{registrationDate}</span>
        </div>
        <div className="flex items-center">
         
          <span className="font-bold">Date of Issuance:</span>{" "}
          <span className="ml-4">{issuanceDate}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold">Applicant / Representative:</span>{" "}
          <span className="ml-4">{application.applicantName || "N/A"}</span>
        </div>
        <div className="flex items-center">
          <Hash className="h-8 w-8 mr-4 text-blue-600 invisible" />{" "}
          {/* Invisible icon for alignment */}
          <span className="font-bold">Certificate No.:</span>{" "}
          <span className="ml-4 font-mono">{certificateNumber}</span>
        </div>
      </div>

      {/* Footer / Verification Section */}
      <div className="relative z-10 flex justify-between items-end mt-4 p-4 border-t-2 border-blue-400">
        <div className="text-left text-base text-gray-700">
          <p className="font-semibold">Zimbabwe Revenue Authority (ZIMRA)</p>
          <p>For official use only.</p>
          <p className="mt-3 italic">
            This digital certificate is valid without a manual signature.
          </p>
          <p className="italic">
            Verify authenticity using the provided TIN and certificate number.
          </p>
        </div>
        <div className="flex flex-col items-center text-gray-700">
          {/* Placeholder for QR Code */}
          <QrCode className="h-28 w-28 text-blue-700 mb-2 border border-gray-300 p-2" />{" "}
          {/* Increased QR size */}
          <p className="text-sm">Scan for online verification</p>
        </div>
        {/* Placeholder for Official Seal/Stamp (could be an image) */}
        {/* <img src="/path-to-zimra-seal.png" alt="Official Seal" className="h-24 w-auto opacity-70" /> */}
      </div>

      {/* Print Button - hide during print */}
      <div className="flex justify-center mt-12 relative z-10 print:hidden">
        <Button
          onClick={onPrint}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-10 py-4 text-xl rounded-lg shadow-md"
        >
          Issue Certificate
        </Button>
      </div>
    </div>
  );
};

export default ZimraTinCertificate;
