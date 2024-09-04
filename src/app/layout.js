'use client'

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Work Time Clock</Link>
            <div>
              {user ? (
                <>
                  <span className="mr-4">Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={handleRegister} className="mr-4 hover:text-gray-300">Register</button>
                  <button onClick={handleLogin} className="hover:text-gray-300">Login</button>
                </>
              )}
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
