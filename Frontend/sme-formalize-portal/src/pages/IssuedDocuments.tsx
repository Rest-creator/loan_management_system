import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { issuedDocuments } from '@/data/mockData';
import { Search, Download, FileText, Calendar, User, Award } from 'lucide-react';

export default function IssuedDocuments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredDocuments = issuedDocuments.filter(doc => {
    const matchesSearch = 
      doc.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'business_registration':
        return 'Business Registration Certificate';
      case 'tax_clearance':
        return 'Tax Clearance Certificate';
      case 'business_license':
        return 'City Council Business License';
      case 'nssa_compliance':
        return 'NSSA Compliance Letter';
      default:
        return type;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'business_registration':
        return 'bg-blue-100 text-blue-800';
      case 'tax_clearance':
        return 'bg-green-100 text-green-800';
      case 'business_license':
        return 'bg-purple-100 text-purple-800';
      case 'nssa_compliance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Issued Documents</h1>
        <p className="text-muted-foreground">View and manage all issued formalization documents</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by applicant name, business, or certificate number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filter by document type" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="all">All Document Types</SelectItem>
                <SelectItem value="business_registration">Business Registration</SelectItem>
                <SelectItem value="tax_clearance">Tax Clearance</SelectItem>
                <SelectItem value="business_license">Business License</SelectItem>
                <SelectItem value="nssa_compliance">NSSA Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map(doc => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <Badge 
                    variant="secondary" 
                    className={getDocumentTypeColor(doc.type)}
                  >
                    {getDocumentTypeLabel(doc.type)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">{doc.businessName}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    {doc.applicantName}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="font-mono">{doc.certificateNumber}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(doc.issuedDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Issued by: {doc.issuedBy}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="ghost">
                    Re-issue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table View */}
      <Card>
        <CardHeader>
          <CardTitle>Document Records ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Certificate Number</th>
                  <th className="text-left py-3 px-4 font-medium">Document Type</th>
                  <th className="text-left py-3 px-4 font-medium">Applicant</th>
                  <th className="text-left py-3 px-4 font-medium">Business Name</th>
                  <th className="text-left py-3 px-4 font-medium">Issue Date</th>
                  <th className="text-left py-3 px-4 font-medium">Issued By</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm">{doc.certificateNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="secondary" 
                        className={getDocumentTypeColor(doc.type)}
                      >
                        {getDocumentTypeLabel(doc.type)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{doc.applicantName}</td>
                    <td className="py-3 px-4">{doc.businessName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(doc.issuedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{doc.issuedBy}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}