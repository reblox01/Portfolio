import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
// Import your database client
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email, name, subject, message } = await request.json();

  // Fetch email and password from the database
  const contact = await prisma.contact.findFirst();  // Adjust this query according to your actual schema

  if (!contact || !contact.email || !contact.password) {
    return NextResponse.json({ error: 'Email or password not found in database or incorrect' }, { status: 500 });
  }

  // Set up the transporter using fetched credentials
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: contact.email,
      pass: contact.password,
    },
  });

  const mailOptions: Mail.Options = {
    from: email,
    to: contact.email,
    replyTo: email,
    subject: `${subject} - ${name}`,
    text: `By ${name} from ${email}\n\n${message}`,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
