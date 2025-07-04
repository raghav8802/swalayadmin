"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { apiPost, apiGet } from "@/helpers/axiosRequest";

interface DocumentationSectionProps {
  employeeId?: string | null;
  isEditMode?: boolean;
}

interface NestedField {
  status: string;
  document: File | null;
}

interface DocumentationFormData {
  employeeVerification: string;
  ndaSignature: NestedField;
  workPolicy: NestedField;
}

interface DocumentationErrors {
  employeeVerification?: string;
  ndaSignature?: string;
  workPolicy?: string;
}

const DocumentationSection: React.FC<DocumentationSectionProps> = ({
  employeeId,
  isEditMode = false
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DocumentationFormData>({
    employeeVerification: "Pending",
    ndaSignature: { status: "Pending", document: null },
    workPolicy: { status: "Pending", document: null },
  });
  const [errors, setErrors] = useState<DocumentationErrors>({});
  const [exsitsNdaFile, setExsitsNdaFile] = useState("");
  const [exsitsWorkPolicy, setExsitsWorkPolicy] = useState("");
  const [selectedNdaFileName, setSelectedNdaFileName] = useState<string | null>(null);
  const [selectedWorkPolicyFileName, setSelectedWorkPolicyFileName] = useState<string | null>(null);
  const [ndaFileName, setNdaFileName] = useState<string | null>(null);
  const [workPolicyFileName, setWorkPolicyFileName] = useState<string | null>(null);

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode && employeeId) {
      loadDocumentation();
    }
  }, [isEditMode, employeeId]);

  const loadDocumentation = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/employee/documentation?employeeId=${employeeId}`) as any;
      
      if (response.success && response.data) {
        const data = response.data;
        setFormData({
          employeeVerification: data.employeeVerification || "Pending",
          ndaSignature: {
            status: data.ndaSignature?.status || "Pending",
            document: null,
          },
          workPolicy: {
            status: data.workPolicy?.status || "Pending",
            document: null,
          },
        });
        
        // Set existing file URLs and filenames if available
        if (data.ndaSignature?.document) {
          setExsitsNdaFile(data.ndaSignature.document);
          setNdaFileName(data.ndaSignature.fileName || null);
        }
        if (data.workPolicy?.document) {
          setExsitsWorkPolicy(data.workPolicy.document);
          setWorkPolicyFileName(data.workPolicy.fileName || null);
        }
        
        console.log("Loaded documentation:", data);
      }
    } catch (error) {
      console.error("Error loading documentation:", error);
      toast.error("Error loading documentation");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DocumentationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof prev[field] === 'object' 
        ? { ...prev[field] as NestedField, status: value }
        : value
    }));
    
    // Clear error when user makes changes
    if (errors[field as keyof DocumentationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "ndaSignature" | "workPolicy"
  ) => {
    const file = e.target.files?.[0] || null;

    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        document: file,
      },
    }));

    // Set selected file name
    if (file) {
      if (key === "ndaSignature") {
        setSelectedNdaFileName(file.name);
      } else {
        setSelectedWorkPolicyFileName(file.name);
      }
    }
  };

  const validateDocumentation = () => {
    const newErrors: DocumentationErrors = {};
    
    if (!formData.employeeVerification) newErrors.employeeVerification = "Employee verification is required";
    if (!formData.ndaSignature.status) newErrors.ndaSignature = "NDA signature status is required";
    if (!formData.workPolicy.status) newErrors.workPolicy = "Work policy status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadDocument = async (documentType: "nda" | "workPolicy") => {
    if (!employeeId) {
      toast.error("Please complete Basic Info section first");
      return;
    }

    const file = formData[documentType].document;
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append("employeeId", employeeId);
      formDataToSend.append("documentType", documentType);
      formDataToSend.append("file", file);

      const response = await fetch("/api/employee/upload-document", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Document uploaded successfully");
        
        // Update the form data with the uploaded document URL and filename
        if (documentType === "nda") {
          setExsitsNdaFile(result.data.documentUrl);
          setNdaFileName(result.data.fileName);
        } else {
          setExsitsWorkPolicy(result.data.documentUrl);
          setWorkPolicyFileName(result.data.fileName);
        }
        
        // Clear the selected file
        setFormData(prev => ({
          ...prev,
          [documentType]: {
            ...prev[documentType],
            document: null,
          },
        }));
        
        if (documentType === "nda") {
          setSelectedNdaFileName(null);
        } else {
          setSelectedWorkPolicyFileName(null);
        }
      } else {
        toast.error(result.error || "Failed to upload document");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Error uploading document");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!employeeId) {
      toast.error("Please complete Basic Info section first");
      return;
    }

    if (!validateDocumentation()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        employeeId,
        employeeVerification: formData.employeeVerification,
        ndaSignature: {
          status: formData.ndaSignature.status,
        },
        workPolicy: {
          status: formData.workPolicy.status,
        },
      };

      const response = await apiPost("/api/employee/documentation", payload) as any;

      if (response.success) {
        toast.success(response.message || "Documentation saved successfully");
      } else {
        toast.error(response.error || "Failed to save documentation");
      }
    } catch (error) {
      console.error("Error saving documentation:", error);
      toast.error("Error saving documentation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 inline-block" />
          Documentation
        </CardTitle>
        <p className="text-gray-500 text-sm mt-1">Verification and compliance documents.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Employee Verification </Label>
            <Select 
              onValueChange={(value) => handleInputChange('employeeVerification', value)} 
              value={formData.employeeVerification} 
              defaultValue={formData.employeeVerification}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label>NDA Signature</Label>
            <div className="flex items-center space-x-2">
              <Select 
                onValueChange={(value) => handleInputChange('ndaSignature', value)} 
                value={formData.ndaSignature.status} 
                defaultValue={formData.ndaSignature.status}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              {formData.ndaSignature.status === "Completed" && (
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={() => document.getElementById("fileInput")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                  
                  {formData.ndaSignature.document && (
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => uploadDocument("nda")}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                  
                  {exsitsNdaFile && (
                    <Link href={exsitsNdaFile} className="btn ms-3 bg-blue-300 py-2 px-3 rounded hover:bg-blue-400" target="_blank">
                      <div className="flex items-center">
                        <span>View File</span>
                        <Image src="/icons/pdf.svg" alt="PDF" width={20} height={20} className="ml-1" />
                      </div>
                    </Link>
                  )}
                  
                  <input 
                    id="fileInput" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleFileUpload(e, "ndaSignature")} 
                  />
                </div>
              )}
            </div>
          </div>
          
          {selectedNdaFileName && (
            <span className="text-sm text-gray-600">
              Selected NDA File: <strong>{selectedNdaFileName}</strong>
            </span>
          )}
          {ndaFileName && !selectedNdaFileName && (
            <span className="text-sm text-green-600">
              Uploaded NDA File: <strong>{ndaFileName}</strong>
            </span>
          )}
          
          <div className="flex items-center justify-between">
            <Label>Work Policy</Label>
            <div className="flex items-center space-x-2">
              <Select 
                onValueChange={(value) => handleInputChange('workPolicy', value)} 
                value={formData.workPolicy.status} 
                defaultValue={formData.workPolicy.status}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              {formData.workPolicy.status === "Completed" && (
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={() => document.getElementById("fileInputWorkPolicy")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                  
                  {formData.workPolicy.document && (
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => uploadDocument("workPolicy")}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                  
                  {exsitsWorkPolicy && (
                    <Link href={exsitsWorkPolicy} className="btn ms-3 bg-blue-300 py-2 px-3 rounded hover:bg-blue-400" target="_blank">
                      <div className="flex items-center">
                        <span>View File</span>
                        <Image src="/icons/pdf.svg" alt="PDF" width={20} height={20} className="ml-1" />
                      </div>
                    </Link>
                  )}
                  
                  <input 
                    id="fileInputWorkPolicy" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleFileUpload(e, "workPolicy")} 
                  />
                </div>
              )}
            </div>
          </div>
          
          {selectedWorkPolicyFileName && (
            <span className="text-sm text-gray-600">
              Work Policy File: <strong>{selectedWorkPolicyFileName}</strong>
            </span>
          )}
          {workPolicyFileName && !selectedWorkPolicyFileName && (
            <span className="text-sm text-green-600">
              Uploaded Work Policy File: <strong>{workPolicyFileName}</strong>
            </span>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading || !employeeId}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? "Saving..." : (isEditMode ? "Update Documentation" : "Save Documentation")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentationSection; 