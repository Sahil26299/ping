import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/components/hoc/ThemeProvider";
import { poppins } from "@/src/utilities";

export const metadata: Metadata = {
  title: "Ping",
  description: "Chat app for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}`}>
        <ThemeProvider attribute={"class"} defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
