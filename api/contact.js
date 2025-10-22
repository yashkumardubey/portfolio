import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_FROM}>`,
      to: process.env.CONTACT_RECEIVER || process.env.SMTP_FROM,
      subject: `Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Mail error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
