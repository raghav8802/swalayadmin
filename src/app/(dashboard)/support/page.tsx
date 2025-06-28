"use client";

import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UserContext from "@/context/userContext";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MessageCircle, Plus, Filter, Search } from "lucide-react";
import SupportThread from "./components/SupportThread";
import Link from "next/link";

interface SupportTicket {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  isClosed: boolean;
  replies?: any[];
  replyCount?: number;
  unreadReplies?: number;
  createdAt: string;
  labelId: string;
}

export default function MyTickets() {
  const context = useContext(UserContext);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [closedFilter, setClosedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, statusFilter, priorityFilter, closedFilter, searchTerm]);

  const fetchTickets = async () => {
    try {
      const response: any = await apiGet('/api/support/getAllTickets');
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

  const applyFilters = () => {
    let filtered = [...tickets];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter as 'low' | 'medium' | 'high');
    }

    // Closed/Open filter
    if (closedFilter !== "all") {
      const isClosed = closedFilter === "closed";
      filtered = filtered.filter(ticket => ticket.isClosed === isClosed);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.name.toLowerCase().includes(term) ||
        ticket.email.toLowerCase().includes(term) ||
        ticket.subject.toLowerCase().includes(term) ||
        ticket.message.toLowerCase().includes(term)
      );
    }

    setFilteredTickets(filtered);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setClosedFilter("all");
    setSearchTerm("");
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      setUpdating({ ...updating, [ticketId]: true });
      const response: any = await apiPost('/api/support/updateTicket', {
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

  const handlePriorityChange = async (ticketId: string, newPriority: string) => {
    try {
      setUpdating({ ...updating, [ticketId]: true });
      const response: any = await apiPost('/api/support/updateTicket', {
        ticketId,
        priority: newPriority
      });
      
      if (response.success) {
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, priority: newPriority as 'low' | 'medium' | 'high' }
            : ticket
        ));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to update ticket priority");
    } finally {
      setUpdating({ ...updating, [ticketId]: false });
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      setUpdating({ ...updating, [ticketId]: true });
      const response: any = await apiPost('/api/support/updateTicket', {
        ticketId,
        isClosed: true,
        status: 'resolved'
      });
      
      if (response.success) {
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, isClosed: true, status: 'resolved' }
            : ticket
        ));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to close ticket");
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
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage and respond to support tickets
          </p>
        </div>
        <Link href="/support/create-ticket">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ticket State</label>
              <Select value={closedFilter} onValueChange={setClosedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </p>
        <div className="flex gap-2">
          <Badge variant="outline">
            Total: {tickets.length}
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending: {tickets.filter(t => t.status === 'pending').length}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            In Progress: {tickets.filter(t => t.status === 'in-progress').length}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Resolved: {tickets.filter(t => t.status === 'resolved').length}
          </Badge>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {tickets.length === 0 ? "No support tickets found." : "No tickets match the current filters."}
            </p>
            {tickets.length > 0 && (
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span>{ticket.subject}</span>
                    <Badge className={
                      ticket.isClosed ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"
                    }>
                      {ticket.isClosed ? "Closed" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(ticket._id)}
                      className="relative"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      View Thread ({ticket.replyCount || 0})
                      {ticket.unreadReplies && ticket.unreadReplies > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {ticket.unreadReplies > 9 ? '9+' : ticket.unreadReplies}
                        </div>
                      )}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">User Info:</h3>
                    <p className="text-sm text-gray-600">
                      <a 
                        href={`/labels/${btoa(ticket.labelId)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                      >
                        {ticket.name}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">{ticket.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Message:</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Controls:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Status:</span>
                        <Select
                          value={ticket.status}
                          onValueChange={(value) => handleStatusChange(ticket._id, value)}
                          disabled={updating[ticket._id] || ticket.isClosed}
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
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Priority:</span>
                        <Select
                          value={ticket.priority}
                          onValueChange={(value) => handlePriorityChange(ticket._id, value)}
                          disabled={updating[ticket._id] || ticket.isClosed}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {!ticket.isClosed && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCloseTicket(ticket._id)}
                          disabled={updating[ticket._id]}
                        >
                          Close Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    ticket.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                    ticket.status === 'in-progress' ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }>
                    {ticket.status}
                  </Badge>
                  <Badge className={
                    ticket.priority === 'low' ? "bg-green-100 text-green-800" :
                    ticket.priority === 'medium' ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }>
                    {ticket.priority}
                  </Badge>
                  <Badge className={
                    ticket.isClosed ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"
                  }>
                    {ticket.isClosed ? "Closed" : "Open"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-400">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Thread Modal */}
      {selectedTicket && (
        <SupportThread
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={fetchTickets}
        />
      )}
    </div>
  );
} 