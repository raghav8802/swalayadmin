import * as React from "react";

type EmailTemplateProps = {
  clientName: string;
};

export default function AccountActivationEmailTemplate({
  clientName,
}: EmailTemplateProps)
: React.ReactElement
 {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center', color: '#000000', marginBottom: '24px' }}>
        Thanks For Joining!
      </h1>

      <div style={{ color: '#333333', fontSize: '16px', lineHeight: '1.5' }}>
        <p style={{ marginBottom: '16px' }}>Hi {clientName},</p>
        
        <p style={{ marginBottom: '16px' }}>
          Welcome to SwaLay! We&apos;re thrilled you&apos;ve joined our exclusive music community.
        </p>
        
        <p style={{ marginBottom: '16px' }}>
          It&apos;s time to unlock a world of premium music experiences. Here&apos;s how to begin your journey:
        </p>

        <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '12px' }}>
            Access your SwaLay Plus Label account: Visit{' '}
            <a href="https://app.swalayplus.in" style={{ color: '#0066cc', textDecoration: 'none' }}>
              app.swalayplus.in
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            Set up your login: As a new member, click on 
            <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>
              Forgot Password
            </a>
             to create your unique credentials for future access.
          </li>
        </ol>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center",  margin: '32px 0' }}>       
          <img 
            src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png" 
            alt="Welcome Character"
            width="180"
            height="150"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          <p style={{ 
            marginLeft: '20px', 
            fontStyle: 'italic',
            color: '#333333',
            fontSize: '16px'
          }}>
            Ready to explore? Once youve set up your login, dive into the exclusive world of music on SwaLay Plus!
          </p>
        </div>

        <p style={{ marginBottom: '24px' }}>
          Our dedicated support team is here to ensure your experience is flawless. If you need any assistance, 
          please don&apos;t hesitate to reach out to us at{' '}
          <a href="mailto:swalay.care@talantoncore.in" style={{ color: '#0066cc', textDecoration: 'none' }}>
            swalay.care@talantoncore.in
          </a>.
        </p>

        <p style={{ marginBottom: '24px' }}>
          We&apos;re excited to have you embark on this musical journey with SwaLay!
        </p>


      </div>
    </div>
  );
}
