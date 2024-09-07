// app/page.js
"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Tyme Keepa Logo" width={40} height={40} />
            <span className="ml-3 text-xl font-semibold text-gray-800">Tyme Keepa</span>
          </div>
          <div>
            <Link href="/login" className="text-gray-800 hover:text-purple-600 mr-4">Login</Link>
            <button onClick={handleGetStarted} className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300">Get Started</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Master Your Time with Tyme Keepa
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Effortlessly track your hours, boost productivity, and take control of your work-life balance.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={handleGetStarted}
                className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300"
              >
                Start Free Trial
              </button>
              <Link href="/demo" className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition duration-300">
                Watch Demo
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/hero-image.png"
              alt="Tyme Keepa Dashboard"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose Tyme Keepa?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Intuitive Tracking", description: "Clock in and out with just one click, making time tracking a breeze." },
              { title: "Insightful Analytics", description: "Gain valuable insights into your work patterns and productivity trends." },
              { title: "Seamless Integration", description: "Easily integrate with your favorite tools and boost your workflow efficiency." }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 mt-20">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-700">© 2023 Tyme Keepa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
