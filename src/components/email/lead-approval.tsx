import React from "react";

interface LeadApprovalEmailTemplateProps {
  name: string;
}

const LeadApprovalEmailTemplate: React.FC<LeadApprovalEmailTemplateProps> = ({ name }) => (
  <div>
    <h1>Dear {name}!</h1>
    <p>We are pleased to inform you that your application for the SwaLay Plus Label program has been approved! You are now part of India's leading tech content distribution platform.</p>
    <p>To proceed, we've attached a payment link for Rs. 699 + 18% GST, covering 2 years of unlimited content distribution across all major music streaming platforms. Please complete the payment and share the confirmation with us, so we can activate your SwaLay Plus Label account immediately and get you started on your music distribution journey.</p>
    <br />
    <p><a href="https://app.swalayplus.in/xg6jtv54ghv">Click here to Register</a></p>
    <br />
    <p>For any assistance, feel free to reach out to us at swalay.care@talantoncore.in or via our WhatsApp Support at 01169268163.</p>
    <p>We look forward to supporting you as you embark on this exciting journey with SwaLay.</p>
    <br />
    <p>Best Regards,</p>
    <p>Team SwaLay</p>
  </div>
);

export default LeadApprovalEmailTemplate; 