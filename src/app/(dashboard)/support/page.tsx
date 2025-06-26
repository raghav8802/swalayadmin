"use client";

import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UserContext from "@/context/userContext";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SupportTicket {
  _id: string;
  subject: string;
  message: string;
  reply: string;
  status: string;
  createdAt: string;
}

export default function MyTickets() {
  const context = useContext(UserContext);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response:any = await apiGet('/api/support/getAllTickets');
        console.log(response);
        if (response.success) {
          setTickets(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      setUpdating({ ...updating, [ticketId]: true });
      const response:any = await apiPost('/api/support/updateTicket', {
        ticketId,
        status: newStatus
      });
      
      if (response.success) {
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, status: newStatus }
            : ticket
        ));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to update ticket status");
    } finally {
      setUpdating({ ...updating, [ticketId]: false });
    }
  };

  const handleReply = async (ticketId: string) => {
    try {
      setUpdating({ ...updating, [ticketId]: true });
      const response:any = await apiPost('/api/support/replyTicket', {
        ticketId,
        reply: replyText[ticketId]
      });
      
      if (response.success) {
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, reply: replyText[ticketId] }
            : ticket
        ));
        setReplyText({ ...replyText, [ticketId]: '' });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to send reply");
    } finally {
      setUpdating({ ...updating, [ticketId]: false });
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">My Support Tickets</h1>
          <p className="text-muted-foreground">
            View all your support tickets and responses
          </p>
        </div>
        
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p>No support tickets found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{ticket.subject}</span>
                  <div className="flex items-center gap-4">
                    <Select
                      defaultValue={ticket.status}
                      onValueChange={(value) => handleStatusChange(ticket._id, value)}
                      disabled={updating[ticket._id]}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Your Message:</h3>
                  <p className="text-gray-600">{ticket.message}</p>
                </div>
                {ticket.reply && (
                  <div>
                    <h3 className="font-semibold mb-2">Admin Reply:</h3>
                    <p className="text-gray-600">{ticket.reply}</p>
                  </div>
                )}
                <div className="text-sm text-gray-400">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                
                {/* Reply Section */}
                <div className="mt-4 space-y-2">
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyText[ticket._id] || ''}
                    onChange={(e) => setReplyText({
                      ...replyText,
                      [ticket._id]: e.target.value
                    })}
                  />
                  <Button 
                    onClick={() => handleReply(ticket._id)}
                    disabled={!replyText[ticket._id] || updating[ticket._id]}
                    className="mt-2"
                  >
                    {updating[ticket._id] ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 