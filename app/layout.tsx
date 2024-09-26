import { ReactNode } from "react";
import { Viewport } from "next";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import AppLayout from "@/components/app/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

export const viewport: Viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}