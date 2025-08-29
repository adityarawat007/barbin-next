import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, phone, email, projectDetails, fileUrl } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const recipients = [
      'david@barbinfurniture.com.au',
      'd.hohepa@barbinfurniture.com.au',
    ];

    const attachmentRow = fileUrl
      ? `<tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Attachments:</td>
          <td style="padding: 8px 0; color: #333;">
              <a href="${fileUrl}" style="color: #007BFF; text-decoration: none;">Download Attachment</a>
          </td>
        </tr>`
      : '';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333; border-bottom: 2px solid #007BFF; padding-bottom: 8px;">New Custom Order Form Submission</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">First Name:</td>
            <td style="padding: 8px 0; color: #333;">${firstName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Last Name:</td>
            <td style="padding: 8px 0; color: #333;">${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
            <td style="padding: 8px 0; color: #007BFF; font-weight: bold;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px 0; color: #007BFF; font-weight: bold;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Project Details:</td>
            <td style="padding: 8px 0; color: #333;">${projectDetails}</td>
          </tr>
          ${attachmentRow}
        </table>

        <p style="margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 10px;">
          This message was sent from your barbinfurniture.com.au custom order form.
        </p>
      </div>
    `;

    // Send to all recipients
    await Promise.all(recipients.map(recipient => 
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'New Custom Order Form Submission',
        html: htmlContent
      })
    ));

    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error sending email' },
      { status: 500 }
    );
  }
}
