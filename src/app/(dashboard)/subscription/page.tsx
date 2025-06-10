'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface Label {
  _id: string;
  lable: string;
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionPlan: string;
  subscriptionpaymentId: string;
  subscriptionprice: string;
  
}

export default function SubscriptionPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      const response = await fetch('/api/labels/subscriptions');
      const data = await response.json();
      if (data.success) {
        const sortedLabels = data.data.sort((a: Label, b: Label) => 
          (a.lable || '').localeCompare(b.lable || '')
        );
        setLabels(sortedLabels);
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined | null) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'active':
        return 'bg-green-500';
      case 'expired':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleLabelClick = (label: Label) => {
    setSelectedLabel(label);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLabel(null);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Label Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label Name</TableHead>
                  <TableHead>Subscription Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labels.map((label) => (
                  <TableRow key={label._id}>
                    <TableCell
                      className="font-medium cursor-pointer text-blue-600 underline"
                      onClick={() => handleLabelClick(label)}
                    >
                      {label.lable}
                    </TableCell>
                    <TableCell>{label.subscriptionPlan}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(label.subscriptionStatus)}>
                        {label.subscriptionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {label.subscriptionStartDate ? 
                        format(new Date(label.subscriptionStartDate), 'dd/MM/yyyy') : 
                        'N/A'}
                    </TableCell>
                    <TableCell>
                      {label.subscriptionEndDate ? 
                        format(new Date(label.subscriptionEndDate), 'dd/MM/yyyy') : 
                        'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {showModal && selectedLabel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-3xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedLabel.lable}</h2>
                <p className="text-gray-500 text-sm">Label Subscription Details</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-700 text-xm">Plan</span>
                <div className="font-semibold text-lg">{selectedLabel.subscriptionPlan}</div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">Status</span>
                <div className="inline-flex items-center gap-2">
                  <span className={`h-2 ms-3 w-2 rounded-full ${getStatusColor(selectedLabel.subscriptionStatus)}`}></span>
                  <span className="font-semibold">{selectedLabel.subscriptionStatus}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">Start Date</span>
                <div>{selectedLabel.subscriptionStartDate ? format(new Date(selectedLabel.subscriptionStartDate), 'dd/MM/yyyy') : 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">End Date</span>
                <div>{selectedLabel.subscriptionEndDate ? format(new Date(selectedLabel.subscriptionEndDate), 'dd/MM/yyyy') : 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">Price</span>
                <div className="font-semibold text-lg">{selectedLabel.subscriptionprice}</div>
              </div><div>
                <span className="text-gray-700 text-xm">Payment ID</span>
                <div className="font-semibold text-xm">{selectedLabel.subscriptionpaymentId}</div>
              </div>
            </div>
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="text-xs text-gray-400">Contact admin for more details or to upgrade your plan.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 