"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Modal } from "@/components/Modal";
import { apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";

interface SubscriptionData {
  userEmail: string;
  planId: string;
  startDate: string;
}

const NewSubscription = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    userEmail: "",
    planId: "",
    startDate: "",
  });
  const [isloading, setIsloading] = useState(false);

  const plans = [
    { value: "1", label: "Basic Plan" },
    { value: "3", label: "Basic Plus Plan" },
    { value: "4", label: "Pro Plan" },
    { value: "5", label: "All-In-One Plan" },
    { value: "6", label: "LABEL PARTNER" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSubscriptionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsloading(true);
      const { userEmail, planId, startDate } = subscriptionData;
      if (!userEmail || !planId || !startDate) {
        toast.error("Please fill in all fields.");
        return;
      }
      toast.loading("Creating subscription...");
      console.log("Subscription data:", subscriptionData);
      // Here you would typically send the data to your API
      const response = await apiPost(
        "/api/labels/new-subscriptions",
        subscriptionData
      );
      console.log("API response:", response);
      setIsModalVisible(false);
      // Reset form
      setSubscriptionData({
        userEmail: "",
        planId: "",
        startDate: "",
      });
      toast.success("Subscription created successfully!");
    } catch (error) {
      toast.error("Failed to create subscription. Please try again.");
      console.error("Error creating subscription:", error);
    } finally {
      setIsloading(false);
    }
  };

  const onClose = () => {
    setIsModalVisible(false);
    // Reset form on close if needed
    setSubscriptionData({
      userEmail: "",
      planId: "",
      startDate: "",
    });
  };

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)}>New Subscription</Button>

      <Modal
        isVisible={isModalVisible}
        triggerLabel="Create Subscription"
        title="New Subscription"
        onSave={handleSave}
        onClose={onClose}
        description="Fill in the details to create a new subscription"
        isLoading={isloading}
      >
        <div className="space-y-4">
          <div>
            <label className="form-label" htmlFor="userEmail">
              User Email
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={subscriptionData.userEmail}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter user email"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plan
              </label>
              <select
                name="planId"
                value={subscriptionData.planId}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan.value} value={plan.value}>
                    {plan.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={subscriptionData.startDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewSubscription;
