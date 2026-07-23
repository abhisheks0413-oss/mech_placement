import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Placement Website | CET Mechanical",
  description: "Mechanical Association placement portal for College of Engineering Trivandrum."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 2600 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
