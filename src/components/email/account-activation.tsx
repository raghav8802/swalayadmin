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
    <html lang="en">
    <head>
      <title>Welcome to SwaLay!</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
    </head>
    <body style={{ margin: '0', backgroundColor: '#fffefe', padding: '0' }}>
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center', color: '#000000', marginBottom: '24px' }}>
        Thanks For Joining!
      </h1>

      <div style={{ color: '#333333', fontSize: '16px', lineHeight: '1.5' }}>
        <p style={{ marginBottom: '16px' }}>Hi {clientName},</p>
        
        <p style={{ marginBottom: '16px' }}>
          Welcome to SwaLay! We're thrilled you've joined our exclusive music community.
        </p>
        
        <p style={{ marginBottom: '16px' }}>
          It's time to unlock a world of premium music experiences. Here's how to begin your journey:
        </p>

        <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '12px' }}>
            Access your SwaLay Plus Label account: Visit{' '}
            <a href="https://app.swalayplus.in" style={{ color: '#0066cc', textDecoration: 'none' }}>
              app.swalayplus.in
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            Set up your login: As a new member, click on "
            <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>
              Forgot Password
            </a>
            " to create your unique credentials for future access.
          </li>
        </ol>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center",  margin: '32px 0' }}>
          <img 
            src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png" 
            alt="Welcome Character"
            style={{ width: '180px', height: '150px' }}
          />
          <p style={{ 
            marginLeft: '20px', 
            fontStyle: 'italic',
            color: '#333333',
            fontSize: '16px'
          }}>
            Ready to explore? Once you've set up your login, dive into the exclusive world of music on SwaLay Plus!
          </p>
        </div>

        <p style={{ marginBottom: '24px' }}>
          Our dedicated support team is here to ensure your experience is flawless. If you need any assistance, 
          please don't hesitate to reach out to us at{' '}
          <a href="mailto:swalay.care@talantoncore.in" style={{ color: '#0066cc', textDecoration: 'none' }}>
            swalay.care@talantoncore.in
          </a>.
        </p>

        <p style={{ marginBottom: '24px' }}>
          We're excited to have you embark on this musical journey with SwaLay!
        </p>

        <p style={{ 
          fontStyle: 'italic', 
          textAlign: 'center',
          borderTop: '1px dashed #cccccc',
          paddingTop: '20px',
          marginTop: '32px'
        }}>
          Keep the Beat, Team SwaLay
        </p>

        <div style={{ 
          backgroundColor: '#000000',
          padding: '20px',
          marginTop: '32px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <a href="https://www.facebook.com/swalaydigital" style={{ margin: '0 10px' }}>
              <img 
                src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/facebook2x.png" 
                alt="Facebook"
                style={{ width: '24px', height: '24px' }}
              />
            </a>
            <a href="https://www.linkedin.com/company/swalay" style={{ margin: '0 10px' }}>
              <img 
                src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/linkedin2x.png" 
                alt="LinkedIn"
                style={{ width: '24px', height: '24px' }}
              />
            </a>
            <a href="https://www.instagram.com/swalaydigital" style={{ margin: '0 10px' }}>
              <img 
                src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/instagram2x.png" 
                alt="Instagram"
                style={{ width: '24px', height: '24px' }}
              />
            </a>
          </div>
          <div style={{ color: '#ffffff', fontSize: '14px' }}>
            © Copyright 2024 By SwaLay Digital
          </div>
          <div style={{ color: '#ffffff', fontSize: '12px', marginTop: '8px' }}>
            Powered By TalantonCore
          </div>
        </div>
      </div>
    </div>
    </body>
  </html>
  );
}
