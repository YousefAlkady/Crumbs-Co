import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email, name, orderId, orderNumber, additional_notes, total, items } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Create the receipt table dynamically based on what they bought
        const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 2px solid #FDF6E3; font-weight: bold;">${item.quantity}x ${item.name}</td>
        <td style="padding: 12px 0; border-bottom: 2px solid #FDF6E3; text-align: right; font-weight: bold; color: #ffc0cb;">${item.price * item.quantity} EGP</td>
      </tr>
    `).join('');

        const mailOptions = {
            from: `"Crumbs & Co." <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `Order Confirmed! Receipt for ${orderNumber || orderId}`,
            html: `
        <div style="background-color: #FDF6E3; padding: 40px; font-family: sans-serif; color: #5C3317; text-align: center;">
          <h1 style="color: #00008B; font-weight: 900; letter-spacing: -1px; margin-bottom: 30px;">
            CRUMBS<span style="color: #ffc0cb;">&</span>CO.
          </h1>
          <div style="background-color: white; padding: 40px; border-radius: 24px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 2px solid rgba(92, 51, 23, 0.1); text-align: left;">
            <h2 style="color: #00008B; font-weight: 900; margin-top: 0; text-align: center;">ORDER CONFIRMED.</h2>
            <p style="font-size: 20px; font-weight: 900; color: #00008B; text-align: center; margin: 10px 0 20px 0; letter-spacing: 1px;">${orderNumber || `#${orderId}`}</p>
            <p style="font-size: 16px; font-weight: 500; margin-bottom: 30px; text-align: center;">
              Hi ${name}, the ovens are warming up. Here is your receipt!
            </p>
            ${additional_notes ? `
            <div style="background-color: #ffc0cb33; padding: 16px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #ffc0cb;">
              <p style="font-size: 12px; font-weight: 900; color: #00008B; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Your Note</p>
              <p style="font-size: 15px; font-weight: 600; color: #5C3317; margin: 0;">${String(additional_notes).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
            ` : ''}
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              ${itemsHtml}
            </table>
            <div style="display: flex; justify-content: space-between; font-size: 24px; font-weight: 900;">
              <span style="color: #00008B;">TOTAL</span>
              <span>${total} EGP</span>
            </div>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: rgba(92, 51, 23, 0.6); font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
            © Crumbs & Co. Baked with love in Egypt.
          </p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Email error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}