"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Building, 
  Briefcase, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Edit,
  Download,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";

interface EmployeeData {
  _id: string;
  fullName: string;
  personalEmail: string;
  officialEmail?: string;
  phoneNumber: string;
  address: string;
  dateOfBirth?: string;
  aadharCardNumber: string;
  panCardNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  bank?: string;
  branch?: string;
  joiningDate?: string;
  role?: string;
  department?: string;
  type?: string;
  salary?: number;
  manager?: {
    name: string;
    contact?: string;
  };
  status: string;
  employeeVerification?: string;
  ndaSignature?: {
    status: string;
    document?: string;
    fileName?: string;
  };
  workPolicy?: {
    status: string;
    document?: string;
    fileName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EmployeeProfile() {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const employeeId = query.get("employeeid");
        
        if (!employeeId) {
          setError("Employee ID not found");
          setLoading(false);
          return;
        }

        const decodedId = atob(employeeId);
        const response = await apiGet(`/api/employee/details?employeeId=${decodedId}`) as any;
        
        console.log("Response: ", response)

        if (response.success && response.data) {
          setEmployee(response.data);
        } else {
          setError("Employee not found");
        }
      } catch (error) {
        console.error("Error loading employee:", error);
        setError("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    loadEmployeeData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'not active':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/employees">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Employees
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/employees">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Employees
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Profile</h1>
              <p className="text-gray-600">View complete employee information</p>
            </div>
          </div>
          <Link href={`/employees/new?id=${btoa(employee._id)}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Employee Header Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {getInitials(employee.fullName)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{employee.fullName}</h2>
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{employee.role || "Role not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{employee.department || "Department not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(employee.joiningDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900 font-medium">{employee.fullName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-900">{formatDate(employee.dateOfBirth)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Personal Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${employee.personalEmail}`} className="text-blue-600 hover:underline">
                    {employee.personalEmail}
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${employee.phoneNumber}`} className="text-blue-600 hover:underline">
                    {employee.phoneNumber}
                  </a>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-900">{employee.address}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Aadhar Card Number</label>
                <p className="text-gray-900 font-mono">{employee.aadharCardNumber}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">PAN Card Number</label>
                <p className="text-gray-900 font-mono">{employee.panCardNumber || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Official Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Official Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Official Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {employee.officialEmail ? (
                    <a href={`mailto:${employee.officialEmail}`} className="text-blue-600 hover:underline">
                      {employee.officialEmail}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Employee Type</label>
                <Badge variant="outline" className="text-sm">
                  {employee.type || "Not specified"}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-900">{employee.role || "Not specified"}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900">{employee.department || "Not specified"}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Joining Date</label>
                <p className="text-gray-900">{formatDate(employee.joiningDate)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Salary</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-gray-900 font-semibold">
                    {employee.salary ? `₹${employee.salary.toLocaleString()}` : "Not specified"}
                  </span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Manager</label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">
                  {employee.manager?.name || "Not assigned"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Bank Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Bank Name</label>
                <p className="text-gray-900">{employee.bank || "Not specified"}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Branch</label>
                <p className="text-gray-900">{employee.branch || "Not specified"}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Account Number</label>
                <p className="text-gray-900 font-mono">{employee.bankAccountNumber || "Not specified"}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                <p className="text-gray-900 font-mono">{employee.ifscCode || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Documentation Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Employee Verification</span>
                <Badge className={getVerificationColor(employee.employeeVerification || 'pending')}>
                  {employee.employeeVerification || 'Pending'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">NDA Signature</span>
                <div className="flex items-center gap-2">
                  <Badge className={getVerificationColor(employee.ndaSignature?.status || 'pending')}>
                    {employee.ndaSignature?.status || 'Pending'}
                  </Badge>
                  {employee.ndaSignature?.document && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(employee.ndaSignature?.document, '_blank')}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {employee.ndaSignature?.fileName ? `View ${employee.ndaSignature.fileName}` : 'View Document'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Work Policy</span>
                <div className="flex items-center gap-2">
                  <Badge className={getVerificationColor(employee.workPolicy?.status || 'pending')}>
                    {employee.workPolicy?.status || 'Pending'}
                  </Badge>
                  {employee.workPolicy?.document && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(employee.workPolicy?.document, '_blank')}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {employee.workPolicy?.fileName ? `View ${employee.workPolicy.fileName}` : 'View Document'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Created On</label>
              <p className="text-gray-900">{formatDate(employee.createdAt)}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">{formatDate(employee.updatedAt)}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Employee ID</label>
              <p className="text-gray-900 font-mono text-sm">{employee._id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 