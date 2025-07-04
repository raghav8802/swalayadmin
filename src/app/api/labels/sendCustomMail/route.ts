import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import sendMail from "@/helpers/sendMail";
import EmailLayout from "@/components/email/EmailLayout";
import React from "react";
import SentEmail from "@/models/SentEmail";

export async function POST(req: NextRequest) {
  await connect();
  try {
    const { userIds, subject, content } = await req.json();
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ success: false, message: "No users selected" }, { status: 400 });
    }
    if (!subject || !content) {
      return NextResponse.json({ success: false, message: "Subject and content required" }, { status: 400 });
    }
    const users = await Label.find({ _id: { $in: userIds } }).select("email username _id");
    const results = [];
    let sentEmailDoc = null;
    try {
      // Send emails
      for (const user of users) {
        try {
          const emailTemplate = React.createElement(
            EmailLayout as React.ElementType,
            null,
            React.createElement("div", { dangerouslySetInnerHTML: { __html: content } })
          );
          await sendMail({
            to: user.email,
            subject,
            emailTemplate,
          });
          results.push({ email: user.email, status: "sent" });
        } catch (err) {
          let errorMessage = "Unknown error";
          if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
            errorMessage = (err as any).message;
          } else if (typeof err === "string") {
            errorMessage = err;
          }
          results.push({ email: user.email, status: "failed", error: errorMessage });
        }
      }
      // Store sent email log if at least one sent
      if (users.length > 0) {
        sentEmailDoc = await SentEmail.create({
          recipients: users.map(u => ({ _id: u._id, username: u.username, email: u.email })),
          subject,
          html: content,
          sentAt: new Date(),
        });
      }
    } catch (error) {
      let errorMessage = "Server error";
      if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
        errorMessage = (error as any).message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
    return NextResponse.json({ success: true, results, sentEmailId: sentEmailDoc?._id });
  } catch (error) {
    let errorMessage = "Server error";
    if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
      errorMessage = (error as any).message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
} 