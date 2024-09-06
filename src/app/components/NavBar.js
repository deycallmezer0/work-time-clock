// app/components/NavBar.js
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Work Time Clock
        </Link>
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-blue-200">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-white hover:text-blue-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
              <Link href="/register" className="text-white hover:text-blue-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;