"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Banknote } from "lucide-react";
import toast from "react-hot-toast";
import { apiPost, apiGet } from "@/helpers/axiosRequest";

interface BankDetailsSectionProps {
  employeeId?: string | null;
  isEditMode?: boolean;
}

interface BankFormData {
  bankAccount: string;
  ifsc: string;
  bank: string;
  branch: string;
}

interface BankErrors {
  bankAccount?: string;
  ifsc?: string;
  bank?: string;
  branch?: string;
}

const BankDetailsSection: React.FC<BankDetailsSectionProps> = ({
  employeeId,
  isEditMode = false
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BankFormData>({
    bankAccount: "",
    ifsc: "",
    bank: "",
    branch: "",
  });
  const [errors, setErrors] = useState<BankErrors>({});

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode && employeeId) {
      loadBankDetails();
    }
  }, [isEditMode, employeeId]);

  const loadBankDetails = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/employee/bank-details?employeeId=${employeeId}`) as any;
      
      if (response.success && response.data) {
        const data = response.data;
        setFormData({
          bankAccount: data.bankAccountNumber || "",
          ifsc: data.ifscCode || "",
          bank: data.bank || "",
          branch: data.branch || "",
        });
        console.log("Loaded bank details:", data);
      }
    } catch (error) {
      console.error("Error loading bank details:", error);
      toast.error("Error loading bank details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id as keyof BankErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const validateBankDetails = () => {
    const newErrors: BankErrors = {};
    
    if (!formData.bankAccount) newErrors.bankAccount = "Bank account number is required";
    if (!formData.ifsc) newErrors.ifsc = "IFSC code is required";
    if (!formData.bank) newErrors.bank = "Bank name is required";
    if (!formData.branch) newErrors.branch = "Branch is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!employeeId) {
      toast.error("Please complete Basic Info section first");
      return;
    }

    if (!validateBankDetails()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        employeeId,
        bankAccountNumber: formData.bankAccount,
        ifscCode: formData.ifsc,
        bank: formData.bank,
        branch: formData.branch,
      };

      const response = await apiPost("/api/employee/bank-details", payload) as any;

      if (response.success) {
        toast.success(response.message || "Bank details saved successfully");
      } else {
        toast.error(response.error || "Failed to save bank details");
      }
    } catch (error) {
      console.error("Error saving bank details:", error);
      toast.error("Error saving bank details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Banknote className="mr-2 inline-block" />
          Bank Details
        </CardTitle>
        <p className="text-gray-500 text-sm mt-1">Banking information for salary and payments.</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bankAccount">Bank Account Number</Label>
            <input 
              id="bankAccount" 
              placeholder="1234567890" 
              value={formData.bankAccount} 
              onChange={handleInputChange} 
              className="form-control" 
            />
            {errors.bankAccount && <p className="text-red-500 text-sm">{errors.bankAccount}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ifsc">IFSC Code</Label>
            <input 
              id="ifsc" 
              placeholder="ABCD0123456" 
              value={formData.ifsc} 
              onChange={handleInputChange} 
              className="form-control" 
            />
            {errors.ifsc && <p className="text-red-500 text-sm">{errors.ifsc}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bank">Bank</Label>
            <input 
              id="bank" 
              placeholder="State Bank of India" 
              value={formData.bank} 
              onChange={handleInputChange} 
              className="form-control" 
            />
            {errors.bank && <p className="text-red-500 text-sm">{errors.bank}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <input 
              id="branch" 
              placeholder="Branch" 
              value={formData.branch} 
              onChange={handleInputChange} 
              className="form-control" 
            />
            {errors.branch && <p className="text-red-500 text-sm">{errors.branch}</p>}
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading || !employeeId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Saving..." : (isEditMode ? "Update Bank Details" : "Save Bank Details")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankDetailsSection; 