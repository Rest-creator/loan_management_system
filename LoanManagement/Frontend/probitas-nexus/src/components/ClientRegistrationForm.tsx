import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, User, MapPin, Briefcase, CreditCard, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const clientFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z.string().optional(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female", "other"]),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
  nationalId: z.string().min(8, "National ID must be at least 8 characters"),
  
  // Contact Information
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  
  // Address Information
  county: z.string().min(1, "Please select a county"),
  subCounty: z.string().min(1, "Sub-county is required"),
  ward: z.string().min(1, "Ward is required"),
  location: z.string().min(1, "Location is required"),
  physicalAddress: z.string().min(10, "Please provide detailed physical address"),
  
  // Employment Information
  employmentStatus: z.enum(["employed", "self-employed", "unemployed", "retired", "student"]),
  employer: z.string().optional(),
  jobTitle: z.string().optional(),
  workLocation: z.string().optional(),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  otherIncomeSource: z.string().optional(),
  otherIncomeAmount: z.string().optional(),
  
  // Business Information (for self-employed)
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessLocation: z.string().optional(),
  businessAge: z.string().optional(),
  businessIncome: z.string().optional(),
  
  // Financial Information
  bankAccount: z.string().min(1, "Bank account details are required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  mpesaNumber: z.string().min(10, "M-Pesa number is required"),
  
  // Next of Kin
  nextOfKinName: z.string().min(2, "Next of kin name is required"),
  nextOfKinRelationship: z.string().min(1, "Relationship is required"),
  nextOfKinPhone: z.string().min(10, "Next of kin phone is required"),
  nextOfKinAddress: z.string().min(5, "Next of kin address is required"),
  
  // Additional Information
  loanPurpose: z.string().min(1, "Please select loan purpose"),
  requestedAmount: z.string().min(1, "Requested amount is required"),
  repaymentPeriod: z.string().min(1, "Repayment period is required"),
  
  // Agreements
  consentDataProcessing: z.boolean().refine(val => val === true, "You must consent to data processing"),
  consentCreditCheck: z.boolean().refine(val => val === true, "You must consent to credit check"),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept terms and conditions"),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientRegistrationFormProps {
  onSubmit?: (data: ClientFormData) => void;
  onCancel?: () => void;
}

const ClientRegistrationForm: React.FC<ClientRegistrationFormProps> = ({ onSubmit, onCancel }) => {
  const [currentTab, setCurrentTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "male",
      maritalStatus: "single",
      nationalId: "",
      phoneNumber: "",
      alternatePhone: "",
      email: "",
      county: "",
      subCounty: "",
      ward: "",
      location: "",
      physicalAddress: "",
      employmentStatus: "employed",
      employer: "",
      jobTitle: "",
      workLocation: "",
      monthlyIncome: "",
      otherIncomeSource: "",
      otherIncomeAmount: "",
      businessName: "",
      businessType: "",
      businessLocation: "",
      businessAge: "",
      businessIncome: "",
      bankAccount: "",
      bankName: "",
      accountNumber: "",
      mpesaNumber: "",
      nextOfKinName: "",
      nextOfKinRelationship: "",
      nextOfKinPhone: "",
      nextOfKinAddress: "",
      loanPurpose: "",
      requestedAmount: "",
      repaymentPeriod: "",
      consentDataProcessing: false,
      consentCreditCheck: false,
      acceptTerms: false,
    },
  });

  const watchEmploymentStatus = form.watch("employmentStatus");

  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      // In a real application, this would submit to the backend
      console.log("Client registration data:", data);
      
      toast({
        title: "Client Registered Successfully",
        description: `${data.firstName} ${data.lastName} has been registered in the system.`,
      });
      
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering the client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCurrentTab = async () => {
    const fieldsToValidate: (keyof ClientFormData)[] = [];
    
    switch (currentTab) {
      case "personal":
        fieldsToValidate.push("firstName", "lastName", "dateOfBirth", "gender", "maritalStatus", "nationalId");
        break;
      case "contact":
        fieldsToValidate.push("phoneNumber", "county", "subCounty", "ward", "location", "physicalAddress");
        break;
      case "employment":
        fieldsToValidate.push("employmentStatus", "monthlyIncome");
        if (watchEmploymentStatus === "employed") {
          fieldsToValidate.push("employer", "jobTitle");
        }
        break;
      case "financial":
        fieldsToValidate.push("bankName", "accountNumber", "mpesaNumber");
        break;
      case "kin":
        fieldsToValidate.push("nextOfKinName", "nextOfKinRelationship", "nextOfKinPhone", "nextOfKinAddress");
        break;
      case "loan":
        fieldsToValidate.push("loanPurpose", "requestedAmount", "repaymentPeriod");
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    return isValid;
  };

  const nextTab = async () => {
    const isValid = await validateCurrentTab();
    if (!isValid) return;

    const tabs = ["personal", "contact", "employment", "financial", "kin", "loan", "agreements"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = ["personal", "contact", "employment", "financial", "kin", "loan", "agreements"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Client Registration</span>
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { id: "personal", label: "Personal", icon: User },
              { id: "contact", label: "Contact", icon: MapPin },
              { id: "employment", label: "Employment", icon: Briefcase },
              { id: "financial", label: "Financial", icon: CreditCard },
              { id: "kin", label: "Next of Kin", icon: Phone },
              { id: "loan", label: "Loan Details", icon: CreditCard },
              { id: "agreements", label: "Agreements", icon: Mail },
            ].map((tab, index) => (
              <Badge
                key={tab.id}
                variant={currentTab === tab.id ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setCurrentTab(tab.id)}
              >
                <tab.icon className="h-3 w-3 mr-1" />
                {tab.label}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                {/* Personal Information */}
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter middle name (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth *</FormLabel>
                        <div className="flex space-x-2">
                          <Select onValueChange={(day) => {
                            const currentDate = field.value || new Date();
                            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day));
                            field.onChange(newDate);
                          }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent className="h-40">
                              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <SelectItem key={day} value={day.toString()}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select onValueChange={(month) => {
                            const currentDate = field.value || new Date();
                            const newDate = new Date(currentDate.getFullYear(), parseInt(month), currentDate.getDate());
                            field.onChange(newDate);
                          }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent className="h-40">
                              {[
                                'January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'
                              ].map((month, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select onValueChange={(year) => {
                            const currentDate = field.value || new Date();
                            const newDate = new Date(parseInt(year), currentDate.getMonth(), currentDate.getDate());
                            field.onChange(newDate);
                          }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="h-40">
                              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {field.value && (
                          <p className="text-sm text-muted-foreground">
                            Selected: {format(field.value, "do MMMM yyyy")}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maritalStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National ID Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter national ID number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Contact Information */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+263712345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alternatePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alternate Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+263723456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>County *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select county" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="harare">Harare</SelectItem>
                              <SelectItem value="bulawayo">Bulawayo</SelectItem>
                              <SelectItem value="chitungwiza">Chitungwiza</SelectItem>
                              <SelectItem value="mutare">Mutare</SelectItem>
                              <SelectItem value="gweru">Gweru</SelectItem>
                              <SelectItem value="kwekwe">Kwekwe</SelectItem>
                              <SelectItem value="kadoma">Kadoma</SelectItem>
                              <SelectItem value="masvingo">Masvingo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subCounty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub-County *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter sub-county" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ward *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter ward" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="physicalAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Physical Address *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter detailed physical address..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Employment Information */}
                <TabsContent value="employment" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="employmentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="employed">Employed</SelectItem>
                            <SelectItem value="self-employed">Self-Employed</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchEmploymentStatus === "employed" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="employer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employer Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter employer name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter job title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="workLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter work location" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {watchEmploymentStatus === "self-employed" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Type</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter business type" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter business location" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="businessAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Age (Years)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter business age" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="monthlyIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Income (USD/ZWL) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter monthly income" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="otherIncomeSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Income Source</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter other income source" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="otherIncomeAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Income Amount (USD/ZWL)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Financial Information */}
                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cbz">CBZ Bank</SelectItem>
                              <SelectItem value="nedbank">Nedbank Zimbabwe</SelectItem>
                              <SelectItem value="stanbic">Stanbic Bank Zimbabwe</SelectItem>
                              <SelectItem value="steward">Steward Bank</SelectItem>
                              <SelectItem value="fbc">FBC Bank</SelectItem>
                              <SelectItem value="cabs">CABS</SelectItem>
                              <SelectItem value="ecobank">Ecobank Zimbabwe</SelectItem>
                              <SelectItem value="posb">POSB</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter account number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mpesaNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EcoCash/OneMoney Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+263712345678" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be used for loan disbursement and repayments via EcoCash/OneMoney
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Next of Kin */}
                <TabsContent value="kin" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nextOfKinName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Next of Kin Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nextOfKinRelationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="relative">Other Relative</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="nextOfKinPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next of Kin Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+263712345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nextOfKinAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next of Kin Address *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter address..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Loan Details */}
                <TabsContent value="loan" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="loanPurpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Purpose *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select loan purpose" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="business">Business Expansion</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="health">Medical/Health</SelectItem>
                            <SelectItem value="home">Home Improvement</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="asset">Asset Purchase</SelectItem>
                            <SelectItem value="working-capital">Working Capital</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="requestedAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requested Amount (USD) *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="repaymentPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Repayment Period *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="3">3 Months</SelectItem>
                              <SelectItem value="6">6 Months</SelectItem>
                              <SelectItem value="12">12 Months</SelectItem>
                              <SelectItem value="18">18 Months</SelectItem>
                              <SelectItem value="24">24 Months</SelectItem>
                              <SelectItem value="36">36 Months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Agreements */}
                <TabsContent value="agreements" className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="consentDataProcessing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Data Processing Consent *
                            </FormLabel>
                            <FormDescription>
                              I consent to the processing of my personal data for the purpose of loan evaluation and management.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consentCreditCheck"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Credit Check Authorization *
                            </FormLabel>
                            <FormDescription>
                              I authorize Probitas to conduct credit checks and verify my financial information with relevant authorities.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Terms and Conditions *
                            </FormLabel>
                            <FormDescription>
                              I have read and accept the terms and conditions of Probitas Microfinance services.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Application Summary</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Applicant:</strong> {form.watch("firstName")} {form.watch("lastName")}</p>
                      <p><strong>Phone:</strong> {form.watch("phoneNumber")}</p>
                      <p><strong>Requested Amount:</strong> USD {form.watch("requestedAmount") && parseInt(form.watch("requestedAmount")).toLocaleString()}</p>
                      <p><strong>Purpose:</strong> {form.watch("loanPurpose")}</p>
                      <p><strong>Repayment Period:</strong> {form.watch("repaymentPeriod")} months</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevTab}
                  disabled={currentTab === "personal"}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}
                  
                  {currentTab !== "agreements" ? (
                    <Button type="button" onClick={nextTab}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Registering..." : "Register Client"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRegistrationForm;