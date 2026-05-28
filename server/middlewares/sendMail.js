import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  try {
    const transport = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;font-family:Arial;background:#f4f4f4;">
  <div style="max-width:500px;margin:40px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 0 10px rgba(0,0,0,0.1);">
    
    <div style="background:#6a0dad;color:white;padding:20px;text-align:center;">
      <h2>E-Learning Platform</h2>
    </div>

    <div style="padding:20px;text-align:center;">
      <h3>Hello ${data.name},</h3>
      <p>Your OTP is:</p>

      <div style="font-size:32px;font-weight:bold;color:greenyellow;margin:15px 0;">
        ${data.otp}
      </div>

      <p>This OTP is valid for <b>5 minutes</b></p>

      <p style="font-size:12px;color:#cyan;">
        If you did not request this, ignore this email.
      </p>
    </div>

    <div style="background:#f4f4f4;padding:10px;text-align:center;font-size:12px;color:#888;">
      © 2026 E-Learning App
    </div>

  </div>
</body>
</html>
`;

    await transport.sendMail({
      from: `"E-Learning" <${process.env.GMAIL}>`,
      to: email,
      subject,
      html,
    });

    console.log("OTP Mail sent");
    return true;

  } catch (error) {
    console.log("MAIL ERROR:", error.message);
    return false;
  }
};

export default sendMail;



// ================= RESET PASSWORD =================

export const sendForgotMail = async (subject, data) => {
  try {
    const transport = createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;font-family:Arial;background:#f4f4f4;">
  <div style="max-width:500px;margin:40px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 0 10px rgba(0,0,0,0.1);">
    
    <div style="background:#6a0dad;color:white;padding:20px;text-align:center;">
      <h2>Password Reset</h2>
    </div>

    <div style="padding:20px;text-align:center;">
      <p>Click below to reset your password:</p>

      <a href="${process.env.FRONTEND_URL}/reset/${data.token}"
         style="display:inline-block;padding:12px 20px;background:#6a0dad;color:white;text-decoration:none;border-radius:5px;font-weight:bold;">
         Reset Password
      </a>

      <p style="margin-top:15px;">Valid for <b>5 minutes</b></p>
    </div>

    <div style="background:#f4f4f4;padding:10px;text-align:center;font-size:12px;color:#888;">
      © 2026 E-Learning App
    </div>

  </div>
</body>
</html>
`;

    await transport.sendMail({
      from: `"E-Learning" <${process.env.GMAIL}>`,
      to: data.email,
      subject,
      html,
    });

    console.log("Reset Mail sent");
    return true;

  } catch (error) {
    console.log("MAIL ERROR:", error.message);
    return false;
  }
};
