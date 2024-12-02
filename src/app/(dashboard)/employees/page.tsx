"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import toast from "react-hot-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import { EmployeeDataTable } from "./components/EmployeeDataTable";

type Employee = {
  _id: string;
  fullName: string;
  officialEmail: string;
  phoneNumber: string;
  role: string;
  department: string;
  status: string;
  assignedTo: string;
};

export default function UserManagement() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchUsers = async () => {
    try {
      const result = await apiGet("/api/employee/all");
      console.log("fetch employee result");
      console.log(result.data);
      setEmployees(result.data);
    } catch (error) {
      console.log("internal server error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!name || !email || !role) {
        toast.error("Please fill in all fields");
        return;
      }

      const result = await apiPost("/api/employee/add", {
        name,
        email,
        role,
      });

      console.log("api result");
      console.log(result.data);

      toast.success("Success! User added successfully");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  return (
    <div
      className="w-full h-full p-6 bg-white rounded-sm"
      style={{ minHeight: "90vh" }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>User</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Role</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mx-auto py-5 space-y-10">
        <div>
          <h2 className="text-2xl font-bold mb-6">Employees</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="form-control"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium mb-2 text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="form-control"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium mb-2 text-gray-700"
                  htmlFor="role"
                >
                  User Role
                </label>

                <select
                  name=""
                  id=""
                  value={role}
                  className="form-control"
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select User</option>
                  <option value="customerSupport">Customer Support</option>
                  <option value="contentDeployment">Content Deployment</option>
                  <option value="ANR">A&R</option>
                </select>
              </div>
              <div className="space-y-2 flex items-end ">
                <Button type="submit" className="p-5">
                  Add User
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Employees List</h2>

          {employees && <EmployeeDataTable data={employees} />}
        </div>
      </div>
    </div>
  );
}
