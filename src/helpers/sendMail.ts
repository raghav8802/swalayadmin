// utils/sendMail.ts
import { Resend } from "resend";
import { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY as string);

interface SendMailOptions {
  to: string | string[]; // Supports single or multiple email addresses
  subject: string;
  emailTemplate: ReactElement; // Pass any rendered template component here
}

const sendMail = async ({ to, subject, emailTemplate }: SendMailOptions): Promise<void> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "SwaLay India <swalay.care@talantoncore.in>",
      to: Array.isArray(to) ? to : [to],
      subject,
      react: emailTemplate,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error}`);
    }
    
  } catch (error) {
    console.error("Error in sendMail function:", error);
    throw error;
  }
};

export default sendMail;
