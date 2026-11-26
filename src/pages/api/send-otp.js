import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // 1. Check for POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // 2. Get Data from Frontend
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
        return res.status(400).json({ error: 'Missing email or OTP code' });
    }

    // 3. Configure Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'joemalkady@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD, // set in .env.local and Vercel; never in code (public repo)
        },
    });

    // 4. Create Email HTML
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 2px solid #eee; border-radius: 10px;">
      <h2 style="color: #FF69B4;">Crumb & Co.</h2>
      <p>Here is your verification code:</p>
      <div style="background: #f4f4f4; padding: 20px; margin: 20px 0; font-size: 32px; letter-spacing: 5px; font-weight: bold; border-radius: 5px;">
        ${otpCode}
      </div>
      <p style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</p>
    </div>
    `;

    // 5. Send Email
    try {
        await transporter.sendMail({
            from: '"Crumb & Co." <joemalkady@gmail.com>',
            to: email,
            subject: `Your Verification Code: ${otpCode}`,
            html: emailHtml,
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('OTP Email Error:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
}