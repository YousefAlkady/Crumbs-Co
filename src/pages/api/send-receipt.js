import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Default 'cart' to an empty array [] if missing to prevent crashes
  const { orderCode, customerName, customerEmail, cart = [], total, address } = req.body;

  // --- 1. CONFIGURATION ---
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'joemalkady@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD, // set in .env.local and Vercel; never in code (public repo)
    },
  });

  // --- 2. GENERATE ITEM LIST ---
  const today = new Date().toLocaleDateString();
  let itemsHtml = '';

  if (Array.isArray(cart) && cart.length > 0) {
    itemsHtml = cart.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; color: #4A2C2A;">${item.name || 'Item'}</td>
            <td style="padding: 10px; text-align: right; color: #4A2C2A;">${item.price || 0} LE</td>
        </tr>
        `).join('');
  } else {
    itemsHtml = `<tr><td colspan="2" style="padding:10px; text-align:center;">No items listed</td></tr>`;
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF8E7; padding: 20px; border: 3px solid #4A2C2A; border-radius: 10px;">
      <h1 style="color: #FF69B4; text-align: center;">Crumb & Co.</h1>
      <p style="text-align: center;">Order Confirmation: <strong>${orderCode}</strong></p>
      
      <div style="background: #fff; padding: 15px; margin-bottom: 20px;">
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>

      <table style="width: 100%; background: #fff; border-collapse: collapse;">
        <thead style="background: #4A2C2A; color: #fff;">
            <tr><th style="padding:10px; text-align:left;">Item</th><th style="padding:10px; text-align:right;">Price</th></tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <h2 style="text-align: right; color: #FF69B4; margin-top: 20px;">Total: ${(Number(total) || 0) + 45} LE</h2>
    </div>
    `;

  // --- 3. SEND EMAIL ---
  try {
    await transporter.sendMail({
      from: '"Crumb & Co." <joemalkady@gmail.com>',
      to: customerEmail,
      subject: `Order Confirmed: ${orderCode}`,
      html: emailHtml,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}