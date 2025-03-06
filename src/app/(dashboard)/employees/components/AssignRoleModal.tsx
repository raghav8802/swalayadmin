"use client";

import { Modal } from "@/components/Modal";
import { apiPost } from "@/helpers/axiosRequest";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AssignRoleModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSave = async () => {
    try {
      if (!email || !role) {
        toast.error("Please fill in all fields");
        return;
      }
      console.log({ email, role });

      const result = await apiPost("/api/employee/assignrole", {
        email,
        role,
      });

      console.log("api result");
      console.log(result);

      if (result.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
      // Reset form
      setEmail("");
      setRole("");
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Submit"
      title="Assign Employee Role"
      onSave={handleSave}
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium mb-2 text-gray-700"
              htmlFor="email"
            >
              Official Email
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
              <option value="HR">HR</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssignRoleModal;
