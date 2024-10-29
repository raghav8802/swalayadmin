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
    <div
      style={{
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        lineHeight: 1.6,
        color: "#333333",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "10px",
        backgroundColor: "#f8f8f8",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <header
          style={{
            backgroundColor: "#4e37e0",
            color: "#ffffff",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            Welcome to SwaLay Plus
          </h1>
        </header>

        <div style={{ padding: "40px" }}>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Hi{" "}
            <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
              {clientName}
            </span>
            ,
          </p>

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Welcome to SwaLay! We're thrilled you've joined our exclusive music
            community.
          </p>

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            It's time to unlock a world of premium music experiences. Here's how
            to begin your journey:
          </p>

          <ol style={{ fontSize: "16px", paddingLeft: "20px" }}>
            <li style={{ marginBottom: "15px" }}>
              Access your SwaLay Plus account: Visit{" "}
              <a
                href="https://app.swalayplus.in"
                target="_blank"
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                app.swalayplus.in
              </a>
            </li>
            <li style={{ marginBottom: "15px" }}>
              Set up your login: As a new member, click on "
              <a
                href="https://app.swalayplus.in/forgotpassword"
                target="_blank"
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Forgot Password
              </a>
              " to create your unique credentials for future access.
            </li>
          </ol>

          <div
            style={{
              backgroundColor: "#f0f7ff",
              borderLeft: "4px solid #007bff",
              padding: "20px",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            <p style={{ fontSize: "16px", margin: 0 }}>
              Ready to explore? Once you've set up your login, dive into the
              exclusive world of music on SwaLay Plus!
            </p>
          </div>

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Our dedicated support team is here to ensure your experience is
            flawless. If you need any assistance, please don't hesitate to reach
            out to us at{" "}
            <a
              href="mailto:swalay.care@talantoncore.in"
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              swalay.care@talantoncore.in
            </a>
            .
          </p>

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            We're excited to have you embark on this musical journey with
            SwaLay!
          </p>
        </div>

        <footer
          style={{
            backgroundColor: "#4e37e0",
            color: "#ffffff",
            padding: "30px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: 0, marginBottom: "10px", fontWeight: 600 }}>
            SwaLay India
          </p>
          {/* <p style={{ margin: 0, color: "#cccccc" }}>
            India's First All-In-One Music Distribution Solution
          </p> */}
        </footer>
      </div>
    </div>
  );
}
