import { Modal } from "@/components/Modal";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import React, { useContext, useEffect, useState } from "react";
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
      const response = await apiPost("/api/leads/create", formData);
      
      if (response.success) {
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
          owner name
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
          <label className="form-label" htmlFor="spotify">
            Email ID 
          </label>
          <input
            type="Text"
            id="spotify"
            name="spotify"
            value={formData.email}
            onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            className="form-control"
            placeholder="Enter The Email ID"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="instagram">
            Phone Number
          </label>
          <input
            type="Text"
            id="instagram"
            name="instagram"
            value={formData.contactNo}
            onChange={(e) =>
                setFormData({ ...formData, contactNo: e.target.value })
              }
            className="form-control"
            placeholder="Enter the Contact number"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="instagram">
            State
          </label>
          <input
            type="Text"
            id="instagram"
            name="instagram"
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
