import * as React from "react";

type EmailTemplateProps = {
  labelName: string;
  albumName: string;
  status: "approved" | "rejected" | "live";
  message: string | "";
};

export default function AlbumStatusEmailTemplate({
  labelName,
  albumName,
  status,
  message,
}: EmailTemplateProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#2196F3";
      case "rejected":
        return "#F44336";
      case "live":
        return "#4CAF50";
      default:
        return "#000000";
    }
  };

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
      

        <div style={{ padding: "40px" }}>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Dear{" "}
            <span style={{ fontWeight: 600, color: "#1a1a1a" }}>
              {labelName}
            </span>
            ,
          </p>

          {status === "approved" && (
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Were pleased to inform you that your album {albumName} is now
              successfully approved by our team.
            </p>
          )}
          {status === "live" && (
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Were pleased to inform you that your album {albumName} is
              successfully Live Now.
            </p>
          )}

          {status === "rejected" && (
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              We are sorry to inform that your album {albumName} was rejected during our review process.
            </p>
          )}

          <div
            style={{
              width: "100%",
              padding: 20,
              backgroundColor: getStatusColor(status),
              color: "#fff",
              textTransform: "uppercase",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            {status}
          </div>

          {status === "approved" && (
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Your songs will be delivered to the platform shortly and will be
              live in some time or on your scheduled release date. We cant wait
              to get your music live! For promotions and marketing, kindly
              utilize the SwaLay Plus platform.
            </p>
          )}

          {status === "rejected" && (
            <div>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Please review the specific feedback provided below. We recommend
                carefully considering these points and making the necessary
                revisions before resubmitting. To ensure a smooth submission in
                the future, please refer to the content uploading guidelines
                available on the SwaLay Plus platform.
              </p>
              <div
                style={{
                  backgroundColor: "#f0f7ff",
                  borderLeft: "4px solid #007bff",
                  padding: "20px",
                  marginTop: "30px",
                  marginBottom: "30px",
                }}
              >
                <p
                  style={{ fontSize: "16px", marginBottom: "20px" }}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>Reason :</strong> ${message.replace(/'/g, "&apos;")}`,
                  }}
                ></p>
              </div>
            </div>
          )}

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            For any questions or assistance, please feel free to contact our
            support team at{" "}
            <a
              href="mailto:swalay.care@talantoncore.in"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              swalay.care@talantoncore.in
            </a>{" "}
            if you have any questions or require assistance.
          </p>

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Keep SwaLaying!
          </p>

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>Sincerely,</p>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            {" "}
            Team SwaLay India{" "}
          </p>
        </div>

        

      </div>
    </div>
  );
}
