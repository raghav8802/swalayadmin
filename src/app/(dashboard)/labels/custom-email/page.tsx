"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Select from "react-select/async";
import { components, MultiValue } from "react-select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface LabelUser {
  _id: string;
  username: string;
  email: string;
}

interface OptionType {
  value: string;
  label: string;
}

export default function CustomEmailPage() {
  const [selected, setSelected] = useState<OptionType[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Load options async for react-select
  const loadOptions = async (inputValue: string): Promise<OptionType[]> => {
    const res = await fetch("/api/labels/getLabels");
    const data = await res.json();
    console.log('getLabels API data:', data); // Debug log
    if (data.success) {
      let options = data.data.map((l: LabelUser) => ({
        value: l._id,
        label: `${l.username} (${l.email})`,
      }));
      if (inputValue) {
        options = options.filter((o: OptionType) => o.label.toLowerCase().includes(inputValue.toLowerCase()));
      }
      return options;
    } else {
      return [];
    }
  };

  // Select All option
  const selectAllOption = { value: "__all__", label: "Select All" };
  const handleChange = (options: MultiValue<OptionType>) => {
    if (options.some((o) => o.value === selectAllOption.value)) {
      setSelected([selectAllOption]);
    } else {
      setSelected(options as OptionType[]);
    }
  };

  const getSelectedUserIds = async () => {
    if (selected.some((o) => o.value === selectAllOption.value)) {
      // Fetch all user IDs
      const res = await fetch("/api/labels/getLabels");
      const data = await res.json();
      if (data.success) {
        return data.data.map((l: LabelUser) => l._id);
      }
      return [];
    }
    return selected.map((o) => o.value);
  };

  const handleSend = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const userIds = await getSelectedUserIds();
      const res = await fetch("/api/labels/sendCustomMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds, subject, content: body }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback("Emails sent successfully!");
        setSubject("");
        setBody("");
        setSelected([]);
      } else {
        setFeedback(data.message || "Failed to send emails.");
      }
    } catch (err) {
      setFeedback("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Custom Option to show Select All
  const customComponents = {
    Option: (props: any) => {
      if (props.data.value === selectAllOption.value) {
        return <components.Option {...props}><b>{props.data.label}</b></components.Option>;
      }
      return <components.Option {...props} />;
    },
  };

  // Fetch sent emails
  useEffect(() => {
    setEmailsLoading(true);
    fetch("/api/labels/sentEmails?page=1&limit=20")
      .then((res) => res.json())
      .then((data) => {
        console.log("from all mail")
        console.log(data)
        
        if (data.success) setEmails(data.data);
      })
      .finally(() => setEmailsLoading(false));
  }, [feedback]); // refetch after sending

  const openModal = (email: any) => {
    setSelectedEmail(email);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {/* Send Custom Email Section */}
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-2">
          <i className="bi bi-envelope-paper-fill text-[#F59E42] text-3xl"></i>
          Send Custom Email to Labels
        </h2>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-lg">Select Users</label>
          <Select
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            value={selected}
            onChange={handleChange}
            components={customComponents}
            placeholder="Search and select users..."
            className="rounded-lg border border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-lg">Subject</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-[#F59E42] focus:outline-none shadow-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-lg">Email Body</label>
          <ReactQuill
            value={body}
            onChange={setBody}
            placeholder="Write your email here..."
            theme="snow"
            className="bg-white rounded-lg border border-gray-300 shadow-sm"
            style={{ minHeight: 300 }}
          />
        </div>
        <button
          className="bg-[#F59E42] hover:bg-[#e48a1f] text-white px-8 py-3 rounded-lg text-lg font-semibold shadow transition disabled:opacity-50"
          onClick={handleSend}
          disabled={loading || !subject || !body || selected.length === 0}
        >
          {loading ? (
            <span><i className="bi bi-arrow-repeat animate-spin mr-2"></i>Sending...</span>
          ) : (
            <span><i className="bi bi-send-fill mr-2"></i>Send Email</span>
          )}
        </button>
        {feedback && (
          <div className="mt-6 text-center text-base text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
            {feedback}
          </div>
        )}
      </div>
      {/* Sent Emails Section */}
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <i className="bi bi-journal-text text-[#6366F1] text-2xl"></i>
          Sent Emails
        </h3>
        {emailsLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : emails.length === 0 ? (
          <div className="text-gray-500">No sent emails yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Subject</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email._id} className="border-b hover:bg-gray-50">
                    <TableCell>{email.subject}</TableCell>
                    <TableCell>{email.recipients.map((r: any) => r.username).join(", ")}</TableCell>
                    <TableCell>{new Date(email.sentAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <button
                        className="text-[#F59E42] hover:underline font-semibold"
                        onClick={() => openModal(email)}
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200 outline-none">
            {selectedEmail && (
              <div>
                <DialogHeader>
                  <DialogTitle>{selectedEmail.subject}</DialogTitle>
                </DialogHeader>
                <div className="mb-2 text-gray-600 text-sm">
                  <b>Recipients:</b> {selectedEmail.recipients.map((r: any) => `${r.username} (${r.email})`).join(", ")}
                </div>
                <div className="mb-4 text-gray-500 text-xs">
                  <b>Sent At:</b> {new Date(selectedEmail.sentAt).toLocaleString()}
                </div>
                <div className="border rounded p-4 bg-gray-50 min-h-[120px] prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                <DialogClose asChild>
                  <button
                    className="mt-6 bg-[#F59E42] hover:bg-[#e48a1f] text-white px-6 py-2 rounded-lg font-semibold shadow"
                  >
                    Close
                  </button>
                </DialogClose>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 