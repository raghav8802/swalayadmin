"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { apiGet, apiFormData } from "@/helpers/axiosRequest";
import Link from "next/link";

type NestedField = {
  status: string;
  document: File | null;
};

interface FormData {
  name: string;
  email: string;
  officialEmail: string;
  userType: string;
  role: string;
  phone: string;
  address: string;
  dob: string;
  aadhar: string;
  pan: string;
  bankAccount: string;
  ifsc: string;
  bank: string;
  branch: string;
  joiningDate: string;
  department: string;
  manager: string;
  managerContact: string;
  status: string;
  employeeVerification: string;
  ndaSignature: NestedField;
  workPolicy: NestedField;
}

type Errors = {
  name?: string;
  email?: string;
  officialEmail?: string;
  role?: string;
  phone?: string;
  aadhar?: string;
  pan?: string;
  bankAccount?: string;
  branch?: string;
  ifsc?: string;
  joiningDate?: string;
};

export default function EmployeeProfile() {
  const [employeeStatus, setEmployeeStatus] = useState("Active");
  const [terminationDate, setTerminationDate] = useState<Date>();
  const [ndaStatus, setNdaStatus] = useState("Pending");
  const [workPolicyStatus, setWorkPolicyStatus] = useState("Pending");
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [exsitsNdaFile, setExsitsNdaFile] = useState("");
  const [exsitsWorkPolicy, setExsitsWorkPolicy] = useState("");
  const [selectedNdaFileName, setSelectedNdaFileName] = useState<string | null>(
    null
  );
  const [selectedWorkPolicyFileName, setSelectedWorkPolicyFileName] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    officialEmail: "",
    userType: "",
    role: "",
    phone: "",
    address: "",
    dob: "",
    aadhar: "",
    pan: "",
    bankAccount: "",
    ifsc: "",
    bank: "",
    branch: "",
    joiningDate: "",
    department: "",
    manager: "",
    managerContact: "",
    status: "Active",
    employeeVerification: "Pending",
    ndaSignature: { status: "Pending", document: null },
    workPolicy: { status: "Pending", document: null },
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const encodedEmployeeId = query.get("employeeid");
    console.log("employeeId :");
    console.log(encodedEmployeeId);
    if (encodedEmployeeId) {
      try {
        let employeeid = atob(encodedEmployeeId);
        setEmployeeId(employeeid);
        fetchEmployeeDetails(employeeid);
        setIsNew(false);
      } catch (error) {
        console.error("Error decoding userId:", error);
      }
    }
  }, []);

  const fetchEmployeeDetails = async (id: string) => {
    try {
      const result = await apiGet(`/api/employee/details?employeeid=${id}`);
      const data = result.data;
      console.log("data ==>");
      console.log(data);
      console.log(data.employeeVerification);
      setExsitsNdaFile(data.ndaSignature?.document);
      setExsitsWorkPolicy(data.workPolicy?.document);
      const fromatedDob = new Date(data.dateOfBirth).toISOString().split("T")[0];
      const fromatedjoiningDate = new Date(data.joiningDate).toISOString().split("T")[0];
      setFormData({
        name: data.fullName || "",
        email: data.personalEmail || "",
        officialEmail: data.officialEmail || "",
        userType: "Employee", // Default value, adjust if needed
        role: data.role || "",
        phone: data.phoneNumber || "",
        address: data.address || "",
        dob: fromatedDob || "",
        aadhar: data.aadharCardNumber || "",
        pan: data.panCardNumber || "",
        bankAccount: data.bankAccountNumber || "",
        ifsc: data.ifscCode || "",
        bank: data.bank || "",
        branch: data.branch || "",
        joiningDate: fromatedjoiningDate  || "",
        department: data.department || "",
        manager: data.manager?.name || "",
        managerContact: data.manager?.contact || "",
        status: data.status || "Active",
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
    } catch (error) {
      console.log("error in employee fetch");
      console.log(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    nestedKey?: keyof typeof formData
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      if (nestedKey) {
        return {
          ...prev,
          [nestedKey]: {
            ...(prev[nestedKey] as Record<string, any>), // Type assertion here
            [id]: value,
          },
        };
      }
      return { ...prev, [id as keyof typeof formData]: value }; // Type assertion here
    });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "ndaSignature" | "workPolicy"
  ) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        document: file,
      },
    }));

    // Set the selected file name
    if (key === "ndaSignature") {
      setSelectedNdaFileName(file?.name || "");
    } else if (key === "workPolicy") {
      setSelectedWorkPolicyFileName(file?.name || "");
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!formData.email.includes("@"))
      newErrors.email = "Invalid email format";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.aadhar) newErrors.aadhar = "Aadhar card number is required";
    if (!formData.pan) newErrors.pan = "PAN card number is required";
    if (!formData.bankAccount)
      newErrors.bankAccount = "Bank account number is required";
    if (!formData.ifsc) newErrors.ifsc = "IFSC code is required";
    if (!formData.joiningDate)
      newErrors.joiningDate = "Joining date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (validateForm()) {
        console.log("Form submitted:", formData);

        // Prepare FormData object
        const formDataObj = new FormData();

        // Append normal fields
        for (const key in formData) {
          const value = formData[key as keyof typeof formData];

          // Type guard for nested fields
          if (key === "ndaSignature" || key === "workPolicy") {
            const nestedField = value as {
              status: string;
              document: File | null;
            };
            if (nestedField.document) {
              formDataObj.append(`${key}[document]`, nestedField.document);
            }
            formDataObj.append(`${key}[status]`, nestedField.status);
          } else {
            formDataObj.append(key, value as string); // Ensure the value is string-compatible
          }
        }

        formDataObj.forEach((value, key) => {
          console.log(`${key}: Value:`, value);
        });

        // Send to API
        toast.loading("Creating Employee Profile");
        const response = await apiFormData("/api/employee/add", formDataObj);

        console.log("api repsonse");
        // console.log(response);
        // if (response.success) {
        //   toast.success(`d ${response.message}`);
        // } else {
        //   toast.error(response.error);
        // }
      } else {
        alert("Please fix the errors before submitting.");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Employee Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg" alt="Employee" />
                  <AvatarFallback>EP</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">John Doe</h2>
              </div> */}

              <Separator />

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
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
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
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
                </div>

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
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
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
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <input
                    id="address"
                    placeholder="123 Main St, City, State, ZIP"
                    required={true}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-control"
                  />
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
                    placeholder="1234 5678 9012"
                    value={formData.aadhar}
                    onChange={handleInputChange}
                    className="form-control"
                    type="number"
                  />
                  {errors.aadhar && (
                    <p className="text-red-500">{errors.aadhar}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Card Number</Label>
                  <input
                    id="pan"
                    placeholder="ABCDE1234F"
                    value={formData.pan}
                    onChange={handleInputChange}
                    className="form-control"
                  />

                  {errors.pan && <p className="text-red-500">{errors.pan}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account Number</Label>
                  <input
                    id="bankAccount"
                    placeholder="1234567890"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  {errors.bankAccount && (
                    <p className="text-red-500">{errors.bankAccount}</p>
                  )}
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
                  {errors.ifsc && <p className="text-red-500">{errors.ifsc}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank">Bank </Label>
                  <input
                    id="bank"
                    placeholder="State Bank of India"
                    value={formData.bank}
                    onChange={handleInputChange}
                    className="form-control"
                  />
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
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <input
                    id="joiningDate"
                    type="date"
                    className="form-control"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                  />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <input
                    id="department"
                    placeholder="Engineering"
                    className="form-control"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">TL/Manager</Label>
                  <input
                    id="manager"
                    placeholder="Jane Smith"
                    className="form-control"
                    value={formData.manager}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerContact">TL/Manager Contact</Label>
                  <input
                    id="managerContact"
                    placeholder="+91 9876543210"
                    className="form-control"
                    value={formData.managerContact}
                    onChange={handleInputChange}
                  />
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
                {employeeStatus === "Not Active" && (
                  <div className="space-y-2">
                    <Label htmlFor="termination-date">Termination Date</Label>
                    <input
                      id="joiningDate"
                      type="date"
                      className="form-control"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Employee Verification </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeVerification: value,
                      }))
                    }
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
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          ndaSignature: { ...prev.ndaSignature, status: value },
                        }))
                      }
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
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() =>
                            document.getElementById("fileInput")?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                        {exsitsNdaFile && (
                          <a
                            href={exsitsNdaFile}
                            className="btn ms-3 bg-red-300 py-2 px-3 rounded"
                            target="_blank"
                          >
                            File <i className="bi bi-file-earmark-pdf"></i>
                          </a>
                        )}

                        <input
                          id="fileInput"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, "ndaSignature")}
                        />
                      </label>
                    )}
                  </div>
               
                </div>
                {/* Display the selected file name */}
                {selectedNdaFileName && (
                  <span className="text-sm text-gray-600">
                    Selected NDA File: <strong>{selectedNdaFileName}</strong>
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <Label>Work Policy</Label>
                  <div className="flex items-center space-x-2">
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          workPolicy: { ...prev.workPolicy, status: value },
                        }))
                      }
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
                      <div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById("fileInputWorkPolicy")
                            ?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                        </Button>
                        {exsitsWorkPolicy && (
                          <Link
                            href={exsitsWorkPolicy}
                            className="btn ms-3 bg-red-300 py-2 px-3 rounded"
                            target="_blank"
                          >
                            File <i className="bi bi-file-earmark-pdf"></i>
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

                {/* Display the selected file name */}
                {selectedWorkPolicyFileName && (
                  <span className="text-sm text-gray-600">
                    Work Policy File:{" "}
                    <strong>{selectedWorkPolicyFileName}</strong>
                  </span>
                )}
              </div>

              <Button type="submit" className="p-5">
                {isNew ? "Add Employee" : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
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