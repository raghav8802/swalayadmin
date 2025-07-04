import React from "react";

interface EmailLayoutProps {
  children: React.ReactNode;
}

const EmailLayout: React.FC<EmailLayoutProps> = ({ children }) => {
  const year = new Date().getFullYear(); // Get the current year

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
      }}
    >
      {/* Banner */}
      <div style={{ width: "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/email/swalayEmailBanner.png"
          alt="SwaLay Banner"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "20px 10px" }}>{children}</div>

      {/* Tagline */}
      <div
        style={{
          margin: "20px 0",
          padding: "20px 0",
          textAlign: "center",
          borderTop: "1px dashed #444",
          borderBottom: "1px dashed #444",
        }}
      >
        <p
          style={{
            fontSize: "20px",
            fontStyle: "italic",
            margin: "0",
          }}
        >
          Keep the Beat, Team SwaLay
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#000000",
          padding: "20px",
          marginTop: "32px",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <a
            href="https://www.facebook.com/swalaydigital"
            style={{ margin: "0 10px" }}
          >
                {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/facebook2x.png"
              alt="Facebook"
              style={{ width: "30px", height: "30px" }}
            />
          </a>
          <a
            href="https://www.linkedin.com/company/swalay"
            style={{ margin: "0 10px" }}
          >
                {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/linkedin2x.png"
              alt="LinkedIn"
              style={{ width: "30px", height: "30px" }}
            />
          </a>
          <a
            href="https://www.instagram.com/swalaydigital"
            style={{ margin: "0 10px" }}
          >
                {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/instagram2x.png"
              alt="Instagram"
              style={{ width: "30px", height: "30px" }}
            />
          </a>
        </div>
        <div style={{ color: "#ffffff", fontSize: "14px" }}>
          © Copyright {year} By SwaLay Digital
        </div>
        <div style={{ color: "#ffffff", fontSize: "12px", marginTop: "8px" }}>
          Powered By TalantonCore
        </div>
      </div>
    </div>
  );
};

export default EmailLayout;
