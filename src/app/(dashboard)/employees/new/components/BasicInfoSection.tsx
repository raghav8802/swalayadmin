"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import toast from "react-hot-toast";
import { apiPost, apiGet } from "@/helpers/axiosRequest";

interface BasicInfoSectionProps {
  onSectionComplete: (employeeId: string) => void;
  employeeId?: string | null;
  isEditMode?: boolean;
}

interface BasicFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  aadhar: string;
  pan: string;
}

interface BasicErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  aadhar?: string;
  pan?: string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  onSectionComplete,
  employeeId,
  isEditMode = false
}) => {
  const [loading, setLoading] = useState(false);
  const [sectionEmployeeId, setSectionEmployeeId] = useState<string | null>(employeeId || null);
  const [formData, setFormData] = useState<BasicFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    aadhar: "",
    pan: "",
  });
  const [errors, setErrors] = useState<BasicErrors>({});

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode && employeeId) {
      loadBasicInfo();
    }
  }, [isEditMode, employeeId]);

  const loadBasicInfo = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/employee/basic-info?employeeId=${employeeId}`) as any;
      
      if (response.success && response.data) {
        const data = response.data;
        setFormData({
          name: data.fullName || "",
          email: data.personalEmail || "",
          phone: data.phoneNumber || "",
          address: data.address || "",
          dob: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : "",
          aadhar: data.aadharCardNumber || "",
          pan: data.panCardNumber || "",
        });
        console.log("Loaded basic info:", data);
      }
    } catch (error) {
      console.error("Error loading basic info:", error);
      toast.error("Error loading basic info");
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
    if (errors[id as keyof BasicErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const validateBasicInfo = () => {
    const newErrors: BasicErrors = {};
    
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.aadhar) newErrors.aadhar = "Aadhar card number is required";
    if (!formData.pan) newErrors.pan = "PAN card number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateBasicInfo()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        fullName: formData.name,
        personalEmail: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dob || null,
        aadharCardNumber: formData.aadhar,
        panCardNumber: formData.pan || null,
      };

      const response = await apiPost("/api/employee/basic-info", payload) as any;

      if (response.success) {
        const newEmployeeId = response.employeeId || sectionEmployeeId;
        setSectionEmployeeId(newEmployeeId);
        onSectionComplete(newEmployeeId);
        toast.success(response.message || "Basic info saved successfully");
      } else {
        toast.error(response.error || "Failed to save basic info");
      }
    } catch (error) {
      console.error("Error saving basic info:", error);
      toast.error("Error saving basic info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 inline-block" />
          Basic Info
        </CardTitle>
        <p className="text-gray-500 text-sm mt-1">Personal details of the employee.</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <input 
              id="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="John Doe" 
              required 
              className="form-control" 
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Personal Email</Label>
            <input 
              id="email" 
              type="email" 
              placeholder="john.doe@example.com" 
              value={formData.email} 
              onChange={handleInputChange} 
              className="form-control" 
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <input 
              id="phone" 
              type="tel" 
              placeholder="+91 1234567890" 
              value={formData.phone} 
              onChange={handleInputChange} 
              className="form-control" 
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <input 
              id="address" 
              placeholder="123 Main St, City, State, ZIP" 
              required 
              value={formData.address} 
              onChange={handleInputChange} 
              className="form-control" 
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <input 
              id="dob" 
              type="date" 
              className="form-control" 
              value={formData.dob} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aadhar">Aadhar Card Number</Label>
            <input 
              id="aadhar" 
              placeholder="123456789012" 
              value={formData.aadhar} 
              onChange={handleInputChange} 
              className="form-control" 
              maxLength={12} 
            />
            {errors.aadhar && <p className="text-red-500 text-sm">{errors.aadhar}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pan">PAN Card Number</Label>
            <input 
              id="pan" 
              placeholder="ABCDE1234F" 
              value={formData.pan} 
              onChange={handleInputChange} 
              className="form-control" 
              maxLength={10} 
            />
            {errors.pan && <p className="text-red-500 text-sm">{errors.pan}</p>}
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Saving..." : (isEditMode ? "Update Basic Info" : "Save Basic Info")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection; 