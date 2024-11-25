// // import { EmailTemplate } from "../../../components/EmailTemplate";
// import { NextRequest, NextResponse } from "next/server";

// import { Resend } from "resend";

// import EmailTemplate from "@/components/email/album-status";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: NextRequest) {

//   const reqBody = await request.json();

//   console.log("reqBody in mail send");
//   console.log(reqBody);
  

//   try {
//     const { data, error } = await resend.emails.send({
//       from: "Acme <swalay.care@talantoncore.in>",
//       to: ["ceo@talantoncore.in, 25subhankar@gmail.com"],
//       subject: "Test email from admin",
//       react: EmailTemplate({
//         albumName: "John",
//         trackName: "Test Track",
//         status: "approved",
//       }),
//     });

//     if (error) {
//       return Response.json({ error }, { status: 500 });
//     }

//     return Response.json(data);
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }
