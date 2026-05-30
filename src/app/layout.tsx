import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lanka360.lk | Connect Sri Lanka's Creators and Builders",
  description:
    "One platform connecting Sri Lanka's passionate creators, business people, makers, builders, innovators, local stores, services, startups, products, and events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
