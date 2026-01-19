import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import EmotionRegistry from "./registry";
import ThemeProvider from "./components/ThemeProvider";
import { Toaster } from "react-hot-toast";

import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orders Management App",
  description: "A modern application for managing customer orders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EmotionRegistry>
          <ThemeProvider>
            <Providers>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                }}
              />
              {children}
            </Providers>
          </ThemeProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}