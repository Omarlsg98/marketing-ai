import AppLayout from "@/components/app/AppLayout";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { Viewport } from "next";
import { ReactNode } from "react";
import "react-tooltip/dist/react-tooltip.css";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
