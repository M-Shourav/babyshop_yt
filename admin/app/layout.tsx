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
          <div className="flex h-screen overflow-hidden">
            <div className="w-48 h-full shrink-0 hidden md:flex flex-col justify-between bg-gradient-to-t from-cyan-950 via-gray-900 to-slate-900 text-white">
              <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="h-[56px] shrink-0 border-b bg-white z-10">
                <Topbar />
              </div>
              <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
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
