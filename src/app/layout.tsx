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
  title: "Lanka360.lk | Discover Local Sri Lanka",
  description:
    "Find Sri Lankan local stores, services, businesses, jobs, products, news, startups, and events in one trusted place.",
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
