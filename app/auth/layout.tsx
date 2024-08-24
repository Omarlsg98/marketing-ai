import { ReactNode } from "react";
import "react-tooltip/dist/react-tooltip.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
