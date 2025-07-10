"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiPost } from "@/helpers/axiosRequest";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateTicketPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    priority: "medium",
    message: "",
    category: "general"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response: any = await apiPost('/api/support/createTicket', formData);
      if (response.success) {
        setMessage("Support ticket created successfully!");
        // Reset form
        setFormData({
          email: "",
          subject: "",
          priority: "medium",
          message: "",
          category: "general"
        });
        // Redirect to support page after 2 seconds
        setTimeout(() => {
          router.push('/support');
        }, 2000);
      } else {
        setMessage(`Error: ${response.message}`);
      }
    } catch (error) {
      setMessage("Failed to create support ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
      <div className="flex items-center gap-4 mb-3">
        <Link href="/support">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
        </Link>
        
      </div>

      <div className="mb-5">
          <h1 className="text-3xl font-bold">Create Support Ticket</h1>
          <p className="text-muted-foreground">
            Create a support ticket on behalf of a user
          </p>
        </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter user's email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detailed description of the issue or request"
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Create Ticket"}
                </Button>
                <Link href="/support">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>

              {message && (
                <div className={`p-3 rounded-md ${
                  message.includes("Error") 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 