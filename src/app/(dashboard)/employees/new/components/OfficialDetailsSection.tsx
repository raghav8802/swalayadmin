"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { apiPost, apiGet } from "@/helpers/axiosRequest";

interface OfficialDetailsSectionProps {
  employeeId?: string | null;
  isEditMode?: boolean;
}

interface OfficialFormData {
  officialEmail: string;
  joiningDate: string;
  role: string;
  department: string;
  type: string;
  salary: string;
  manager: string;
  status: string;
}

interface OfficialErrors {
  officialEmail?: string;
  joiningDate?: string;
  role?: string;
  department?: string;
  type?: string;
  salary?: string;
  manager?: string;
}

const OfficialDetailsSection: React.FC<OfficialDetailsSectionProps> = ({
  employeeId,
  isEditMode = false
}) => {
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState<Array<{_id: string, fullName: string}>>([]);
  const [formData, setFormData] = useState<OfficialFormData>({
    officialEmail: "",
    joiningDate: "",
    role: "",
    department: "",
    type: "Full Time",
    salary: "",
    manager: "",
    status: "Active",
  });
  const [errors, setErrors] = useState<OfficialErrors>({});

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode && employeeId) {
      loadOfficialDetails();
    }
  }, [isEditMode, employeeId]);

  // Fetch employee list for manager dropdown
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await apiGet("/api/employee/all") as { data: {_id: string, fullName: string}[] };
        if (res && res.data) {
          setEmployeeList(res.data);
        }
      } catch (e) { 
        console.error("Error fetching employees:", e);
      }
    }
    fetchEmployees();
  }, []);

  const loadOfficialDetails = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/employee/official-details?employeeId=${employeeId}`) as any;
      
      if (response.success && response.data) {
        const data = response.data;
        setFormData({
          officialEmail: data.officialEmail || "",
          joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString().split("T")[0] : "",
          role: data.role || "",
          department: data.department || "",
          type: data.type || "Full Time",
          salary: data.salary?.toString() || "",
          manager: data.manager?.name || "",
          status: data.status || "Active",
        });
        console.log("Loaded official details:", data);
      }
    } catch (error) {
      console.error("Error loading official details:", error);
      toast.error("Error loading official details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id as keyof OfficialErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const validateOfficialDetails = () => {
    const newErrors: OfficialErrors = {};
    
    if (!formData.officialEmail) newErrors.officialEmail = "Official email is required";
    if (!formData.joiningDate) newErrors.joiningDate = "Joining date is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.salary) newErrors.salary = "Salary is required";
    if (!formData.manager) newErrors.manager = "Manager is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!employeeId) {
      toast.error("Please complete Basic Info section first");
      return;
    }

    if (!validateOfficialDetails()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        employeeId,
        officialEmail: formData.officialEmail,
        joiningDate: formData.joiningDate,
        role: formData.role,
        department: formData.department,
        type: formData.type,
        salary: parseFloat(formData.salary),
        manager: formData.manager, // Send manager name as string
        status: formData.status,
      };

      const response = await apiPost("/api/employee/official-details", payload) as any;

      if (response.success) {
        toast.success(response.message || "Official details saved successfully");
      } else {
        toast.error(response.error || "Failed to save official details");
      }
    } catch (error) {
      console.error("Error saving official details:", error);
      toast.error("Error saving official details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="mr-2 inline-block" />
          Official Details
        </CardTitle>
        <p className="text-gray-500 text-sm mt-1">Work-related and employment details.</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="officialEmail">Official Email</Label>
            <Input 
              id="officialEmail" 
              type="email" 
              placeholder="john.doe@talantoncore.in" 
              pattern=".*@talantoncore\.in$" 
              value={formData.officialEmail} 
              onChange={handleInputChange} 
              required 
            />
            {errors.officialEmail && <p className="text-red-500 text-sm">{errors.officialEmail}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="joiningDate">Joining Date</Label>
            <input 
              id="joiningDate" 
              type="date" 
              className="form-control" 
              value={formData.joiningDate} 
              onChange={handleInputChange} 
            />
            {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <input 
              id="role" 
              placeholder="Software Engineer" 
              className="form-control" 
              value={formData.role} 
              onChange={handleInputChange} 
            />
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>

            

            <select 
              id="department" 
              value={formData.department} 
              onChange={handleInputChange} 
              className="form-control" 
              required
            >
              <option value="">Select Department</option>
              <option value="customerSupport">Customer Support</option>
              <option value="contentDeployment">Content Deployment</option>
              <option value="ANR">ANR</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="IT">IT</option>
            </select>

            {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select 
              id="type" 
              value={formData.type} 
              onChange={handleInputChange} 
              className="form-control" 
              required
            >
              <option value="Full Time">Full Time</option>
              <option value="Intern">Intern</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <input 
              id="salary" 
              type="number" 
              placeholder="50000" 
              value={formData.salary} 
              onChange={handleInputChange} 
              className="form-control" 
              min="0" 
              required 
            />
            {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manager">TL/Manager</Label>
            <select 
              id="manager" 
              value={formData.manager} 
              onChange={handleInputChange} 
              className="form-control" 
              required
            >
              <option value="">Select Manager</option>
              {employeeList.map((emp) => (
                <option key={emp._id} value={emp.fullName}>{emp.fullName}</option>
              ))}
            </select>
            {errors.manager && <p className="text-red-500 text-sm">{errors.manager}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select 
              id="status" 
              value={formData.status} 
              onChange={handleInputChange} 
              className="form-control"
            >
              <option value="Active">Active</option>
              <option value="Not Active">Not Active</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading || !employeeId}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? "Saving..." : (isEditMode ? "Update Official Details" : "Save Official Details")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfficialDetailsSection; 