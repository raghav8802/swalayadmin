"use client";

import { Modal } from "@/components/Modal";
import { apiPost } from "@/helpers/axiosRequest";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ShemarooAssignModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    try {
      // Validation
      if (!email || !role || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      // Password length validation
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      // Password match validation
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      // Prepare data for API
      const result: any = await apiPost("/api/shemaroo/register", {
        email,
        role,
        password,
      });

      if (result.success) {
        toast.success("User created successfully");
        onClose();
        // Reset form
        setEmail("");
        setRole("");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Submit"
      title="Assign Login to Shemaroo "
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
              Status
            </label>

            <select
              id="role"
              value={role}
              className="form-control"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium mb-2 text-gray-700"
              htmlFor="password"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              className="form-control"
            />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium mb-2 text-gray-700"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter Confirm Password"
              required
              className="form-control"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShemarooAssignModal;
