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
      <style>
        {`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }
        .desktop_hide, .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }
        @media (max-width: 685px) {
          .social_block.desktop_hide .social-table {
            display: inline-block !important;
          }
          .mobile_hide {
            display: none;
          }
          .row-content {
            width: 100% !important;
          }
          .stack .column {
            width: 100%;
            display: block;
          }
          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }
          .desktop_hide, .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
        }
        `}
      </style>
    </head>
    <body style={{ margin: '0', backgroundColor: '#fffefe', padding: '0' }}>
      <table
        role="presentation"
        width="100%"
        style={{
          backgroundColor: '#fffefe',
        }}
      >
        <tbody>
          <tr>
            <td>
              <table align="center" role="presentation" width="100%">
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        role="presentation"
                        width="665"
                        style={{
                          margin: '0 auto',
                          backgroundColor: '#fffefe',
                          color: '#000',
                        }}
                      >
                        <tbody>
                          <tr>
                            <td width="100%">
                              <table
                                role="presentation"
                                width="100%"
                                style={{ textAlign: 'center' }}
                              >
                                <tr>
                                  <td style={{ padding: '5px 20px 10px' }}>
                                    <h1 style={{ fontSize: '32px', color: '#111' }}>
                                      <strong>Thanks For Joining!</strong>
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                              <table role="presentation" width="100%">
                                <tr>
                                  <td style={{ padding: '10px 20px' }}>
                                    <div
                                      style={{
                                        fontSize: '15px',
                                        color: '#000',
                                        lineHeight: '180%',
                                      }}
                                    >
                                      <p>Hi {clientName},</p>
                                      <p>
                                        Welcome to SwaLay! We're thrilled you've joined our
                                        exclusive music community.
                                      </p>
                                      <p>
                                        It's time to unlock a world of premium music
                                        experiences. Here's how to begin your journey:
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table role="presentation" width="100%">
                                <tr>
                                  <td style={{ padding: '10px 40px' }}>
                                    <ol style={{ marginLeft: '-20px' }}>
                                      <li>
                                        Access your SwaLay Plus Label account: Visit{' '}
                                        <a
                                          href="https://app.swalayplus.in"
                                          target="_blank"
                                          style={{ color: '#4b99df', textDecoration: 'underline' }}
                                        >
                                          app.swalayplus.in
                                        </a>
                                      </li>
                                      <li>
                                        Set up your login: As a new member, click on{' '}
                                        <a
                                          href="https://app.swalayplus.in/forgotpassword"
                                          target="_blank"
                                          style={{ color: '#4b99df', textDecoration: 'underline' }}
                                        >
                                          Forgot Password
                                        </a>{' '}
                                        to create your unique credentials for future access.
                                      </li>
                                    </ol>
                                  </td>
                                </tr>
                              </table>
                              <table role="presentation" width="100%">
                                <tr>
                                  <td align="center">
                                    <img
                                      src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/email/welcome.gif"
                                      alt="Welcome"
                                      style={{ width: '220px', height: 'auto' }}
                                    />
                                  </td>
                                  <td style={{ padding: '20px' }}>
                                    <p>Ready to explore? Once you've set up...</p>
                                  </td>
                                </tr>
                              </table>
                              {/* Social Media Icons */}
                              <table role="presentation" width="100%">
                                <tr>
                                  <td align="center" style={{ padding: '10px 0' }}>
                                    <a
                                      href="https://www.facebook.com/YourPage"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ margin: '0 5px' }}
                                    >
                                      <img
                                        src="https://yourcdn.com/facebook-icon.png"
                                        alt="Facebook"
                                        width="24"
                                        height="24"
                                        style={{ display: 'inline-block' }}
                                      />
                                    </a>
                                    <a
                                      href="https://www.twitter.com/YourPage"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ margin: '0 5px' }}
                                    >
                                      <img
                                        src="https://yourcdn.com/twitter-icon.png"
                                        alt="Twitter"
                                        width="24"
                                        height="24"
                                        style={{ display: 'inline-block' }}
                                      />
                                    </a>
                                    <a
                                      href="https://www.instagram.com/YourPage"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ margin: '0 5px' }}
                                    >
                                      <img
                                        src="https://yourcdn.com/instagram-icon.png"
                                        alt="Instagram"
                                        width="24"
                                        height="24"
                                        style={{ display: 'inline-block' }}
                                      />
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  );
}
