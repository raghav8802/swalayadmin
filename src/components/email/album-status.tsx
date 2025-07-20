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
            <>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                We're excited to share that your album "{albumName}" has been successfully approved by our team!
              </p>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Your songs will be delivered to all platforms shortly and will be live very soon. We can't wait for the world to experience your music.
              </p>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                To give your release the spotlight it deserves, we encourage you to use the Marketing feature on your SwaLay Plus dashboard.
              </p>
            </>
          )}

          {status === "live" && (
            <>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Congratulations! Your album "{albumName}" is now officially live on music platforms.
                We're thrilled to be part of your musical journey!
              </p>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Let the world hear you! 🌍🎶
              </p>
            </>
          )}

          {status === "rejected" && (
            <>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                We truly appreciate the time, effort, and creativity you've poured into your album "{albumName}".
              </p>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                However, we're sorry to inform you that it was not approved in its current form during our review process.
              </p>
              <div
                style={{
                  backgroundColor: "#f0f7ff",
                  borderLeft: "4px solid #007bff",
                  padding: "20px",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <p
                  style={{ fontSize: "16px", marginBottom: "0" }}
                  dangerouslySetInnerHTML={{
                    __html: `<strong>Reason:</strong> ${message.replace(/'/g, "&apos;")}`,
                  }}
                ></p>
              </div>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                We encourage you to review the feedback carefully and refer to the content uploading guidelines available on your SwaLay Plus dashboard before resubmitting.
              </p>
            </>
          )}

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            If you have any questions or need support, feel free to reach out to us at{" "}
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
            </a>
            . We're always here for you.
          </p>

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>Best regards,</p>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Team SwaLay India
          </p>
        </div>
      </div>
    </div>
  );
}
