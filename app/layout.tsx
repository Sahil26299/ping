import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/components/hoc/ThemeProvider";
import { poppins } from "@/src/utilities";

// export const metadata: Metadata = {
//   title: "Ping",
//   description: "Chat app for developers",
// };
export const metadata: Metadata = {
  title: "Ping",
  description:
    "Chat app for developers",
  keywords: [
    "Chat app for developers",
    "Chatting",
    "Texting",
    "Real-Time chat app"
  ],
  openGraph: {
    title: "Ping",
    description:
      "",
    type: "website",
    locale: "en_US",
    siteName: "Ping",

    // Ideal OG image size: 1200×630
    images: [
      {
        url: "https://ping-ruby-eight.vercel.app/assets/appImage.png",
        width: 1200,
        height: 630,
        alt: "Ping Logo",
      }
    ],
  },

  // Optional but recommended for SEO
  twitter: {
    card: "summary_large_image",
    title: "Ping",
    description:
      "Chat app for developers",
    images: ["https://ping-ruby-eight.vercel.app/assets/appImage.png", "https://ping-ruby-eight.vercel.app/assets/appLogo.png"],
  },
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
