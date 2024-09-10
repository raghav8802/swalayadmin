"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";

interface FormData {
  username: string;
  email: string;
  contact: string;
  usertype: "normal" | "super";
  isLable: boolean;
  lable: string;
  state: string;
}

const LabelRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    contact: "",
    usertype: "super", // default value
    isLable: true,
    lable: "",
    state: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "radio" && name === "usertype") {
      const isNormal = value === "normal";
      setFormData({
        ...formData,
        usertype: value as "normal" | "super",
        isLable: !isNormal,
        lable: isNormal ? "SwaLay Digital" : "",
      });
    } else if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    toast.loading("Creating account");
    // Validation
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.contact.trim()) {
      toast.error("Contact is required");
      return;
    }
    if (formData.usertype === "super" && !formData.lable.trim()) {
      toast.error("Record Label Name is required");
      return;
    }

    if (formData.usertype === "normal") {
      setFormData({
        ...formData,
        lable: "SwaLay Digital",
      });
    }
    setIsSubmitting(true);

    try {
      const response = await apiPost("/api/labels/addLabel", formData);
      if (response.success) {
        toast.success("Label registered successfully!");
        router.push("/labels");
        setIsSubmitting(false);
      } else {
        toast.error(response.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error registering label:", error);
      toast.error("Failed to register label. Please try again.");
      setIsSubmitting(false);
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
            <BreadcrumbPage>Labels</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Register</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-4 mt-5 text-blue-600">
        Register label
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Owner Name
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            placeholder="Write username"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Write Email"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Contact
          </label>
          <input
            type="number"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Write Contact Number"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            User Type
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center me-5 cursor-pointer">
              <input
                type="radio"
                name="usertype"
                value="normal"
                checked={formData.usertype === "normal"}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Artist</span>
            </label>
            <label className="inline-flex items-center ms-5 cursor-pointer">
              <input
                type="radio"
                name="usertype"
                value="super"
                checked={formData.usertype === "super"}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Music Label</span>
            </label>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Record Label Name
          </label>
          <input
            type="text"
            name="lable"
            value={formData.lable}
            onChange={handleChange}
            disabled={!formData.isLable}
            className="form-control"
            placeholder="Write record label name"
          />
        </div>

        <div className="mb-2">
          <label
            className="block text-sm font-medium mb-2 text-gray-700"
            htmlFor="states"
          >
            State
          </label>

          <select
            name="state"
            id="states"
            className="form-control"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>

            <option value="Andaman and Nicobar Islands">
              Andaman and Nicobar Islands
            </option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Dadra and Nagar Haveli and Daman and Diu">
              Dadra and Nagar Haveli and Daman and Diu
            </option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Delhi">Delhi</option>
            <option value="Puducherry">Puducherry</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-5 px-3 py-2 bg-blue-500 rounded text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting" : "Register Label"} 
        </button>
        
      </form>
    </div>
  );
};

export default LabelRegistrationForm;
