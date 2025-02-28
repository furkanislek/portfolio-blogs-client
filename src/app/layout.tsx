import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { ReduxProvider } from "@/redux/providers/ReduxProvider";
import Home from "./Home";

export const metadata: Metadata = {
  title: "Furkan Akif ISLEK",
  description: "My Portfolio Web Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased `}>
        <ReduxProvider>
          <Home children={children} />
        </ReduxProvider>
      </body>
    </html>
  );
}
