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
import Link from "next/link";
import AssignRoleModal from "./components/AssignRoleModal";

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
  const [ setPassword] = useState("");
  const [role, setRole] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // to close the modal 
  const handleClose = () => {
    setIsModalVisible(false);
  };

  const fetchUsers = async () => {
    try {
      const result = await apiGet("/api/employee/all") as { data: Employee[] };
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
          <div className="flex justify-between items-center mt-3">
            <h3 className="text-2xl font-bold mb-3">Employees List</h3>

            <div>
              <Button className="me-3" onClick={() => setIsModalVisible(true)}>
                Assign Role
              </Button>
              <Button>
                <Link href={"/employees/profile"}>New Employee <i className="bi bi-person-add"></i></Link>
              </Button>
            </div>
          </div>


        </div>

        <div>
          {employees && <EmployeeDataTable data={employees} />}
        </div>

        <AssignRoleModal isVisible={isModalVisible} onClose={handleClose} />


      </div>
    </div>
  );
}
