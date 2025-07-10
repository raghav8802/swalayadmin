import React from "react";

interface OtpEmailTemplateProps {
  otp: string;
}

const OtpEmailTemplate: React.FC<OtpEmailTemplateProps> = ({ otp }) => (
  <div>
    <p>Your OTP for login is: <strong>{otp}</strong></p>
    <p>This OTP will expire in 10 minutes.</p>
  </div>
);

export default OtpEmailTemplate; 