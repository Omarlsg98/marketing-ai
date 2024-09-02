"use client"
import { Inter } from "next/font/google";
import { FC, ReactNode } from "react";
import AppSubLayout from "./AppSubLayout";

const font = Inter({ subsets: ["latin"] });

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
      <AppSubLayout>{children}</AppSubLayout>
  );
};

export default AppLayout;
