// app/layout.js
import { Suspense } from 'react';
import NavBar from './components/NavBar';
import './globals.css';

export const metadata = {
  title: 'Work Time Clock',
  description: 'Track your work hours and calculate your paycheck',
};

export function Head() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto py-4 px-6">
            <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
              <NavBar />
            </Suspense>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-6 mt-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white">
          <div className="container mx-auto py-6 px-6 text-center">
            <p>&copy; 2024 Work Time Clock. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="text-gray-300 hover:text-white mx-2">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white mx-2">Terms of Service</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
