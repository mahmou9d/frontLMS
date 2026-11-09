import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Poppins, Josefin_Sans } from "next/font/google";
import ThemeProvider from "./utills/Theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Providers";
import AuthInitializer from "./utills/AuthInitializer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-josefin",
});

export const metadata: Metadata = {
  title: "ELearning - Online Learning Platform",
  description: "Best online learning platform with 40k+ courses",
  keywords: ["react", "nextjs", "typescript"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${poppins.variable} ${josefin.variable} 
          text-gray-900 dark:text-gray-100
          transition-colors duration-300
        `}
      >
        <Providers>
          <AuthInitializer>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster
                position="top-center"
                containerStyle={{ top: 88 }}
                toastOptions={{
                  duration: 4000,
                  className:
                    "!rounded-full !border !border-[#0B1020]/10 !bg-white !px-4 !py-2.5 !text-sm !font-semibold !text-[#0B1020] !shadow-none dark:!border-white/10 dark:!bg-[#0B1020] dark:!text-white",
                  success: {
                    iconTheme: { primary: "#2F4BFF", secondary: "#FFFFFF" },
                  },
                  error: {
                    iconTheme: { primary: "#0B1020", secondary: "#FFFFFF" },
                    duration: 6000,
                  },
                }}
                reverseOrder={false}
              />
            </ThemeProvider>
          </AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
