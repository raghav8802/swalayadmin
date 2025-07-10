"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

// Import section components
import BasicInfoSection from "./components/BasicInfoSection";
import BankDetailsSection from "./components/BankDetailsSection";
import OfficialDetailsSection from "./components/OfficialDetailsSection";
import DocumentationSection from "./components/DocumentationSection";

export default function EmployeeProfile() {
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [basicInfoCompleted, setBasicInfoCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check URL for employee ID
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const urlEmployeeId = query.get("id");
    
    if (urlEmployeeId) {
      try {
        setIsLoading(true);
        const decodedId = atob(urlEmployeeId);
        setEmployeeId(decodedId);
        setIsEditMode(true);
        setBasicInfoCompleted(true); // In edit mode, basic info is already completed
        
        // Add a small delay to show loading state and allow sections to load
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error decoding employee ID:", error);
        setIsLoading(false);
      }
    }
  }, []);

  const handleBasicInfoComplete = (newEmployeeId: string) => {
    setEmployeeId(newEmployeeId);
    setBasicInfoCompleted(true);
    toast.success("Basic info completed! Other sections are now enabled.");
  };

  // Show loading state while fetching employee details
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Loading Employee Details</h2>
            <p className="text-gray-600">Please wait while we fetch the employee information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        {/* Basic Info Section - Always enabled */}
        <BasicInfoSection 
          onSectionComplete={handleBasicInfoComplete}
          employeeId={employeeId}
          isEditMode={isEditMode}
        />
        
        <Separator />
        
        {/* Bank Details Section - Disabled until basic info is completed */}
        <div className={!basicInfoCompleted ? "opacity-50 pointer-events-none" : ""}>
          <BankDetailsSection 
            employeeId={employeeId}
            isEditMode={isEditMode}
          />
        </div>
        
        <Separator />
        
        {/* Official Details Section - Disabled until basic info is completed */}
        <div className={!basicInfoCompleted ? "opacity-50 pointer-events-none" : ""}>
          <OfficialDetailsSection 
            employeeId={employeeId}
            isEditMode={isEditMode}
          />
        </div>
        
        <Separator />
        
        {/* Documentation Section - Disabled until basic info is completed */}
        <div className={!basicInfoCompleted ? "opacity-50 pointer-events-none" : ""}>
          <DocumentationSection 
            employeeId={employeeId}
            isEditMode={isEditMode}
          />
        </div>
        
        <Separator />
        
        {/* Info message when sections are disabled */}
        {!basicInfoCompleted && (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600">
              Please complete the Basic Info section first to enable other sections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* <div className="space-y-2">
<Label htmlFor="userType">Assign User Type</Label>

<select
  id="userType"
  value={formData.userType}
  onChange={handleInputChange}
  className="form-control"
  required
>
  <option value="">Select User</option>
  <option value="employee">Employee</option>
  <option value="customerSupport">Customer Support</option>
  <option value="contentDeployment">
    Content Deployment
  </option>
  <option value="ANR">A&R</option>
</select>
{errors.role && <p className="text-red-500">{errors.role}</p>}
</div> */
}







// https://swalay-music-files.s3.ap-south-1.amazonaws.com/employees/documents/NdaSignature-1733359195077-Hemant%2BSoni-agreement.pdf

// https://swalay-music-files.s3.ap-south-1.amazonaws.com/employees/documents/NdaSignature-1733359195077-Hemant+Soni-agreement.pdf