// app/layout.js
import { Suspense } from 'react';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'Work Time Clock',
  description: 'Track your work hours and calculate your paycheck',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <NavBar />
        </Suspense>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}