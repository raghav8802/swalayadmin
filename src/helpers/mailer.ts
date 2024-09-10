
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import Admin from '@/models/admin';
// import User from '@/models/Label';



export const sendEmail = async ({ email, emailType, userId }: any) => {
    
    try {
        console.log("mail sending ...");

        console.log(email, emailType, userId);
        
        const hasedToken = await bcryptjs.hash(userId.toString(), 10)
        console.log("hasedToken");
        console.log(hasedToken);
        

        if (emailType == "VERIFY") {
            await Admin.findByIdAndUpdate(userId, 
                {$set : {verifyCode: hasedToken, verifyCodeExpiry: Date.now() + 3600000}}
            ) 
        }
        else if (emailType == "RESET") {
            await Admin.findByIdAndUpdate(userId, 
                {$set : {verifyCode: hasedToken, verifyCodeExpiry: Date.now() + 3600000}}
            ) 
        }
        

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.NODEMAILER_USER,
              pass: process.env.NODEMAILER_PASSWORD
            }
          });

        const mailOptions = {
            from: '"Next Developer ss 👻" <ss@sdeveloper.next>', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify Your Email" : "Reset your password", // Subject line
            html: `<p>
            Join as admin 
            Click <a href="${process.env.DOMAIN}/verifyemail?token=${hasedToken}"  >Here</a> to ${emailType === 'VERIFY' ? "Verify Your Email" : "Reset your password"}
            or copy and paste the link below in your browser. <br>
            ${process.env.DOMAIN}/verifyemail?token=${hasedToken}
            </p>`, // html body
        }

        const mailResponse = await transport.sendMail(mailOptions)
      

    } catch (error: any) {
        console.log("mail error");
        console.log(error);
        throw new Error(error.message)
    }
}



