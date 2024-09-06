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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-3xl font-bold hover:text-blue-200 transition-colors duration-300">
          TymeKeepa
        </Link>
        <div className="space-x-6">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-blue-200 transition-colors duration-300 font-semibold">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-white hover:text-blue-200 transition-colors duration-300 font-semibold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-blue-200 transition-colors duration-300 font-semibold">
                Login
              </Link>
              <Link href="/register" className="text-white hover:text-blue-200 transition-colors duration-300 font-semibold">
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
