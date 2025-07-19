"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import { X, Send, MessageCircle } from "lucide-react";

interface Reply {
  _id: string;
  senderType: 'user' | 'admin';
  senderName: string;
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface SupportThreadProps {
  ticketId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function SupportThread({ ticketId, onClose, onUpdate }: SupportThreadProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [ticket, setTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMarkedAsRead = useRef(false);

  useEffect(() => {
    fetchReplies();
  }, [ticketId]);

  // Auto-mark replies as read when thread is opened (only once)
  useEffect(() => {
    if (replies.length > 0 && !hasMarkedAsRead.current) {
      hasMarkedAsRead.current = true;
      markAllRepliesAsRead();
    }
  }, [replies]);

  const fetchReplies = async () => {
    try {
      setLoading(true);
      hasMarkedAsRead.current = false; // Reset flag when fetching new replies
      const response: any = await apiGet(`/api/support/getReplies?ticketId=${ticketId}`);
      if (response.success) {
        setReplies(response.data);
        setTicket(response.ticket);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch replies");
    } finally {
      setLoading(false);
    }
  };

  const markAllRepliesAsRead = async () => {
    try {
      // Get all unread user replies
      const unreadUserReplies = replies.filter(reply => 
        reply.senderType === 'user' && !reply.isRead
      );

      // Mark each unread reply as read
      await Promise.all(
        unreadUserReplies.map(reply =>
          apiPost('/api/support/markAsRead', {
            replyId: reply._id,
            isRead: true
          })
        )
      );

      // Update local state to reflect read status
      setReplies(replies.map(reply => 
        reply.senderType === 'user' && !reply.isRead
          ? { ...reply, isRead: true }
          : reply
      ));

      // Notify parent component to refresh tickets
      onUpdate();
    } catch (error) {
      console.error('Error marking replies as read:', error);
    }
  };

  const handleSendReply = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const response: any = await apiPost('/api/support/replyTicket', {
        ticketId,
        message: newMessage,
        senderType: 'admin',
        senderId: 'admin', // You might want to get this from context
        senderName: 'SwaLay' // You might want to get this from context
      });

      if (response.success) {
        setNewMessage("");
        await fetchReplies();
        onUpdate();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      const response: any = await apiPost('/api/support/updateTicket', {
        ticketId,
        status: newStatus
      });

      if (response.success) {
        setTicket({ ...ticket, status: newStatus });
        onUpdate();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      setUpdating(true);
      const response: any = await apiPost('/api/support/updateTicket', {
        ticketId,
        isClosed: true,
        status: 'resolved'
      });

      if (response.success) {
        setTicket({ ...ticket, isClosed: true, status: 'resolved' });
        onUpdate();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to close ticket");
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      setUpdating(true);
      const response: any = await apiPost('/api/support/updateTicket', {
        ticketId,
        priority: newPriority
      });

      if (response.success) {
        setTicket({ ...ticket, priority: newPriority });
        onUpdate();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to update priority");
    } finally {
      setUpdating(false);
    }
  };

  const markReplyAsRead = async (replyId: string, isRead: boolean) => {
    try {
      const response: any = await apiPost('/api/support/markAsRead', {
        replyId,
        isRead
      });

      if (response.success) {
        setReplies(replies.map(reply => 
          reply._id === replyId ? { ...reply, isRead } : reply
        ));
      }
    } catch (error) {
      console.error('Error marking reply as read:', error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'in-progress': return "bg-blue-100 text-blue-800";
      case 'resolved': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low': return "bg-green-100 text-green-800";
      case 'medium': return "bg-yellow-100 text-yellow-800";
      case 'high': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p>Loading thread...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-red-500">{error}</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{ticket?.subject}</h2>
            <Badge variant="outline" className="bg-gray-50">
              #{ticket?.ticketId}
            </Badge>
            <div className="flex gap-2">
              <Badge className={getStatusBadgeColor(ticket?.status)}>
                {ticket?.status}
              </Badge>
              <Badge className={getPriorityBadgeColor(ticket?.priority)}>
                {ticket?.priority}
              </Badge>
              <Badge className={
                ticket?.isClosed ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"
              }>
                {ticket?.isClosed ? "Closed" : "Open"}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Select
                value={ticket?.status}
                onValueChange={handleStatusChange}
                disabled={updating || ticket?.isClosed}
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
              <span className="text-sm font-medium">Priority:</span>
              <Select
                value={ticket?.priority}
                onValueChange={handlePriorityChange}
                disabled={updating || ticket?.isClosed}
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

            {!ticket?.isClosed && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCloseTicket}
                disabled={updating}
              >
                Close Ticket
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {replies.map((reply) => (
            <div
              key={reply._id}
              className={`flex ${reply.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg relative ${
                  reply.senderType === 'admin'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {reply.senderType === 'user' ? (
                      <a 
                        href={`/labels/${btoa(reply.senderId)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {reply.senderName}
                      </a>
                    ) : (
                      reply.senderName
                    )}
                  </span>
                  <span className="text-xs opacity-70">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                  {reply.senderType === 'user' && !reply.isRead && (
                    <span className="text-xs text-red-500">(Unread)</span>
                  )}
                </div>
                <p className="text-sm">{reply.message}</p>
                {reply.senderType === 'user' && !reply.isRead && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        {!ticket?.isClosed && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
                rows={3}
              />
              <Button
                onClick={handleSendReply}
                disabled={!newMessage.trim() || sending}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 