import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/commons/Sidebar";
import Topbar from "@/components/commons/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Style-Mert E-commerce website",
  description: "style-mert is a e-commerce website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {token ? (
          <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="p-4 bg-gray-50 min-h-[calc(100vh-56px)]">
                {children}
              </main>
            </div>
          </div>
        ) : (
          <main>{children}</main>
        )}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#ffffff",
            },
          }}
        />
      </body>
    </html>
  );
}
