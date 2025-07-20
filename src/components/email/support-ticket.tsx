import * as React from "react";

type SupportTicketEmailProps = {
  type: 'created' | 'replied' | 'closed';
  ticketId: string;
  subject: string;
  message?: string;
  name: string;
  status?: string;
};

export default function SupportTicketEmailTemplate({
  type,
  ticketId,
  subject,
  message,
  name,
  status
}: SupportTicketEmailProps) {
  return (
    <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', lineHeight: 1.6, color: "#333333" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "40px" }}>
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>
          Dear <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{name}</span>,
        </p>

        {type === 'created' && (
          <>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Your support ticket has been successfully created with the following details:
            </p>
            <div style={{ backgroundColor: "#f8f8f8", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
              <p><strong>Ticket ID:</strong> {ticketId}</p>
              <p><strong>Subject:</strong> {subject}</p>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Message:</strong> {message}</p>
            </div>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Our support team will review your ticket and respond as soon as possible. You can track the status of your ticket on your SwaLay Plus dashboard.
            </p>
          </>
        )}

        {type === 'replied' && (
          <>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              There has been a new reply to your support ticket:
            </p>
            <div style={{ backgroundColor: "#f8f8f8", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
              <p><strong>Ticket ID:</strong> {ticketId}</p>
              <p><strong>Subject:</strong> {subject}</p>
              <p><strong>New Message:</strong> {message}</p>
            </div>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              You can view the full conversation and respond on your SwaLay Plus dashboard.
            </p>
          </>
        )}

        {type === 'closed' && (
          <>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Your support ticket has been resolved and closed:
            </p>
            <div style={{ backgroundColor: "#f8f8f8", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
              <p><strong>Ticket ID:</strong> {ticketId}</p>
              <p><strong>Subject:</strong> {subject}</p>
              <p><strong>Final Status:</strong> Resolved</p>
            </div>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              We hope your issue has been resolved to your satisfaction. If you need further assistance, please don't hesitate to create a new ticket.
            </p>
          </>
        )}

        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Thank you for using SwaLay Plus support.
        </p>

        <div style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>
            Best regards,<br />
            Team SwaLay
          </p>
        </div>
      </div>
    </div>
  );
} 