import React from "react";
import EmailLayout from "./EmailLayout";

interface SubscriptionSuccessEmailProps {
  clientName: string;
  planName: string;
  price: string;
  startDate: string;
}

const SubscriptionSuccessEmail: React.FC<SubscriptionSuccessEmailProps> = ({
  clientName,
  planName,
  price,
  startDate,
}) => {
  return (
    <EmailLayout>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '32px', textAlign: 'center', color: '#000000', marginBottom: '24px' }}>
          Subscription Activated!
        </h1>
        <div style={{ color: '#333333', fontSize: '16px', lineHeight: '1.5' }}>
          <p style={{ marginBottom: '16px' }}>Hi {clientName},</p>
          <p style={{ marginBottom: '16px' }}>
            Thank you for subscribing to the <b>{planName}</b> plan on SwaLay!
          </p>
          <p style={{ marginBottom: '16px' }}>
            <b>Plan:</b> {planName}<br />
            <b>Start Date:</b> {startDate}
          </p>
          <p style={{ marginBottom: '16px' }}>
            Your subscription is now active. You can now enjoy all the benefits and features included in your plan.
          </p>
          <p style={{ marginBottom: '16px' }}>
            If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:swalay.care@talantoncore.in" style={{ color: '#0066cc', textDecoration: 'none' }}>swalay.care@talantoncore.in</a>.
          </p>
          <p style={{ marginBottom: '24px' }}>
            Welcome to the SwaLay family!
          </p>
        </div>
      </div>
    </EmailLayout>
  );
};

export default SubscriptionSuccessEmail; 