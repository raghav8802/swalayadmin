import { Modal } from "@/components/Modal";
import { apiPost } from "@/helpers/axiosRequest";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LeadModalForm = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    labelName: "",
    name: "",
    email: "",
    contactNo: "",
    state: "",
  });

  const handleSave = async () => {
    try {
      const response = await apiPost<{ success: boolean; message?: string; data?: any}>("/api/leads/create", {
        success: true,
        ...formData,
      });
      
      if (response && response.success) {
        setFormData({
          labelName: "",
          name: "",
          email: "",
          contactNo: "",
          state: "",
        });
        
        onClose();
        toast.success("Lead created successfully!");
      } else {
        toast.error(response.message || "Failed to create lead");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Submit"
      title="New Lead"
      onSave={handleSave}
      onClose={onClose}
    >
      <div className="overflow-y-auto">
        <label className="form-label" htmlFor="labelName">
          Label Name
        </label>
        <input
          type="text"
          id="labelName"
          name="labelName"
          value={formData.labelName}
          onChange={(e) =>
            setFormData({ ...formData, labelName: e.target.value })
          }
          className="form-control"
          placeholder="Write Label name"
        />
      </div>

      <div className="overflow-y-auto">
        <label className="form-label" htmlFor="name">
          Owner Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="form-control"
          placeholder="Write Owner name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="form-label" htmlFor="email">
            Email ID 
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="form-control"
            placeholder="Enter The Email ID"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="contactNo">
            Phone Number
          </label>
          <input
            type="text"
            id="contactNo"
            name="contactNo"
            value={formData.contactNo}
            onChange={(e) =>
              setFormData({ ...formData, contactNo: e.target.value })
            }
            className="form-control"
            placeholder="Enter the Contact number"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="state">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className="form-control"
            placeholder="Select Your state"
          />
        </div>
      </div>
    </Modal>
  );
};

export default LeadModalForm;
