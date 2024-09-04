import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Work Time Clock",
  description: "Employee time tracking application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Work Time Clock</Link>
            <div>
              <Link href="/register" className="mr-4 hover:text-gray-300">Register</Link>
              <Link href="/login" className="hover:text-gray-300">Login</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
