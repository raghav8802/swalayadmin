"use client";

import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import ShemarooAssignModal from "./components/ShemarooAssignModal";
import { apiGet } from "@/helpers/axiosRequest";

const page = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);

  // to close the modal
  const handleClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result: any = await apiGet("/api/shemaroo/users");
        
        setUsers(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

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
            <BreadcrumbPage>Collabration</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shemaroo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mx-auto py-5 space-y-10">
        <div>
          <div className="flex justify-between items-center mt-3">
            <h3 className="text-2xl font-bold mb-3">Shemaroo</h3>

            <div>
              <Button className="me-3" onClick={() => setIsModalVisible(true)}>
                Assign Login
              </Button>
            </div>
          </div>
        </div>

        <div>
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Email</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">
                        <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                        >
                        {user.isActive ? "Active" : "Inactive"}
                        </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <ShemarooAssignModal isVisible={isModalVisible} onClose={handleClose} />
      </div>
    </div>
  );
};

export default page;
