import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(_request: NextRequest) {
  // Fetch SMTP config from the database
  const contact = await prisma.contact.findFirst();

  if (!contact || !contact.smtpEmail || !contact.emailPassword) {
    return NextResponse.json({ error: 'SMTP configuration not found. Please configure SMTP in the dashboard.' }, { status: 400 });
  }

  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: contact.smtpEmail,
      pass: contact.emailPassword,
    },
  });

  try {
    await transport.verify();
  } catch (err) {
    console.error('SMTP verify failed', err);
    return NextResponse.json({ error: 'SMTP verify failed. Check SMTP credentials.' }, { status: 500 });
  }

  const mailOptions: Mail.Options = {
    from: `"Portfolio Test" <${contact.smtpEmail}>`,
    to: contact.smtpEmail,
    subject: `SMTP Test - ${new Date().toISOString()}`,
    text: `This is a test email sent from your portfolio to verify SMTP settings.`,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    return NextResponse.json({ message: 'Test email sent', messageId: info?.messageId || null });
  } catch (err) {
    console.error('Failed to send test email:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}


