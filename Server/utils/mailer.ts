import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to: string, token: string) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true if 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email content
  const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  const mailOptions = {
    from: `"CloneBook" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h2>Welcome to CloneBook!</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link expires in 15 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
