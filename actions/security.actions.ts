'use server'

import prisma from "@/db"
import { auth, currentUser } from "@clerk/nextjs/server"
import nodemailer from 'nodemailer'
import { headers } from "next/headers"

export async function recordLoginAction() {
    try {
        const user = await currentUser();
        if (!user) return null;

        // Rate limit: Check if we logged a login for this user in the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentLogin = await prisma.notification.findFirst({
            where: {
                type: 'security_login',
                createdAt: {
                    gt: fiveMinutesAgo
                }
            }
        });

        if (recentLogin) return null; // Skip if recently logged

        // Get Notification Settings
        const settings = await prisma.notificationSettings.findFirst();
        if (!settings || !settings.securityLogin) return null;

        const method = settings.securityLogin_method;
        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || 'Unknown Device';

        const timestamp = new Date().toLocaleString();

        // 1. Create In-App Notification
        if (method === 'browser' || method === 'both') {
            await prisma.notification.create({
                data: {
                    type: 'security_login',
                    title: 'New Sign-in Detected',
                    message: `New sign-in from ${userAgent} at ${timestamp}`,
                    data: {
                        userAgent,
                        email: user.emailAddresses[0]?.emailAddress,
                        timestamp
                    }
                }
            });
        }

        // 2. Send Email
        if (method === 'email' || method === 'both') {
            const contact = await prisma.contact.findFirst();
            if (contact && contact.smtpEmail && contact.emailPassword) {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: contact.smtpEmail,
                        pass: contact.emailPassword,
                    },
                });

                await transporter.sendMail({
                    from: `"Security Alert" <${contact.email}>`,
                    to: contact.smtpEmail,
                    subject: `🔐 New Login Detected: ${user.firstName || 'User'}`,
                    html: `
                        <h2>New Login Detected</h2>
                        <p>A new sign-in was detected for your account.</p>
                        <p><strong>Time:</strong> ${timestamp}</p>
                        <p><strong>Device:</strong> ${userAgent}</p>
                        <p><strong>User:</strong> ${user.emailAddresses[0]?.emailAddress}</p>
                        <hr/>
                        <p><small>If this wasn't you, please change your password immediately.</small></p>
                    `
                });
            }
        }

        return { success: true }
    } catch (error) {
        console.error("Error logging login:", error)
        return null
    }
}
