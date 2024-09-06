// app/layout.js
import { Suspense } from 'react';
import NavBar from './components/NavBar';
import './globals.css';

export const metadata = {
  title: 'Work Time Clock',
  description: 'Track your work hours and calculate your paycheck',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-white shadow-md">
          <div className="container mx-auto py-4">
            <Suspense fallback={<div>Loading...</div>}>
              <NavBar />
            </Suspense>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-100 border-t border-gray-200">
          <div className="container mx-auto py-4 text-center text-gray-600">
            &copy; 2024 Work Time Clock. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
