"use server";

import prisma from "@/db";
import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import { apiRateLimit, getClientIp } from "@/lib/rate-limit";
import { headers } from "next/headers";

async function authenticateAndRedirect(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect('/');
  return userId;
}

export async function getSiteSettingsAction() {
  try {
    // Get site settings, or create default if none exists
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          customCursor: true
        }
      });
    }

    return { settings };
  } catch (error) {
    console.error("Error getting site settings:", error);
    return { error: "Failed to get site settings" };
  }
}

export async function updateSiteSettingsAction({ customCursor }: { customCursor: boolean }) {
  // Authenticate admin
  await authenticateAndRedirect();

  const ip = getClientIp(await headers());
  const { success } = await apiRateLimit.limit(ip);
  if (!success) throw new Error("Rate limit exceeded");

  try {
    let settings = await prisma.siteSettings.findFirst();

    if (settings) {
      // Update existing settings
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { customCursor }
      });
    } else {
      // Create settings if they don't exist
      settings = await prisma.siteSettings.create({
        data: { customCursor }
      });
    }

    return { settings };
  } catch (error) {
    console.error("Error updating site settings:", error);
    return { error: "Failed to update site settings" };
  }
} 