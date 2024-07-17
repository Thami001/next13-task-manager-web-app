import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {siteConfig} from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}` //This real time changes the name of the site to match the orgs name
  },
  description: siteConfig.description,
  icons : [
    {
      url: "/Logo.jpg",
      href: "/Logo.jpg"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
