"use client";
import config from "@/config";
import { DarkModeContext } from "@/store/context/DarkModeContext";
import cx from "classnames";
import PlausibleProvider from "next-plausible";
import { Inter } from "next/font/google";
import { FC, ReactNode, useContext } from "react";
import GTMProvider from "../GTMProvider/GTMProvider";
import ClientLayout from "../LayoutClient";

const font = Inter({ subsets: ["latin"] });

interface AppSubLayoutProps {
  children: ReactNode;
}

const AppSubLayout: FC<AppSubLayoutProps> = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  // useEffect(() => {
  //   console.log("IS DARK MODE IN SUB: ", isDarkMode)
  // }, [isDarkMode])

  console.log("IS DARK MODE IN SUB: ", isDarkMode)

  return (
    <html
      lang="en"
      data-theme={isDarkMode ? "dark" : "light"}
      className={cx(font.className, "h-[100%]")}
    >
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
        </head>
      )}
      <GTMProvider />
      <body className="h-[100%] bg-background text-foreground">
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
};

export default AppSubLayout;
