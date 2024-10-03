"use client";
import { ThemeProvider } from "@/components/general/ThemeProvider";
import config from "@/config";
import cx from "classnames";
import PlausibleProvider from "next-plausible";
import { Inter } from "next/font/google";
import { FC, ReactNode } from "react";
import GTMProvider from "../GTMProvider/GTMProvider";
import ClientLayout from "../LayoutClient";

const font = Inter({ subsets: ["latin"] });

interface AppSubLayoutProps {
  children: ReactNode;
}

const AppSubLayout: FC<AppSubLayoutProps> = ({ children }) => {
  return (
    <html
      lang="en"
      data-theme="light"
      className={cx(font.className, "h-[100%]")}
      suppressHydrationWarning
    >
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
        </head>
      )}
      <GTMProvider />
      <body className="h-[100%] bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default AppSubLayout;
