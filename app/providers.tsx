"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000 * 5,
          retry: 0,
        },
      },
    });
  });

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange>
        <ClerkWithTheme>
          <Toaster />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ClerkWithTheme>
      </ThemeProvider>
    </>
  );
}

function ClerkWithTheme({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        variables: resolvedTheme === "dark" ? {
          colorPrimary: "#ffffff",
          colorBackground: "#0a0a0a",
          colorText: "#fafafa",
          colorTextSecondary: "#a1a1aa",
          colorInputBackground: "#171717",
          colorInputText: "#fafafa",
        } : {
          colorPrimary: "#000000",
          colorText: "#000000",
        },
        elements: {
          card: "bg-card text-card-foreground border border-border shadow-xl",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "bg-muted text-foreground hover:bg-muted/80 border-border",
          socialButtonsBlockButtonText: "text-foreground",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-input text-foreground border-border focus:border-ring",
          footerActionLink: "text-primary hover:text-primary/90",
          userButtonPopoverCard: "bg-popover text-popover-foreground border border-border",
          userButtonPopoverActionButton: "hover:bg-transparent hover:text-primary text-foreground",
          userButtonPopoverActionButtonText: "text-foreground",
          userButtonPopoverFooter: "hidden",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-none",
          formButtonSecondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-none",
        },
      }}>
      {children}
    </ClerkProvider>
  )
}

export default Providers;
