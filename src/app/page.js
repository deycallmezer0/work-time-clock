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
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simplify Your Work Life with TimeTrack Pro
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Effortlessly track your hours, manage your schedule, and calculate your earnings with our all-in-one solution.
            </p>
            <div className="space-y-4 mb-8">
              <FeatureItem text="Clock in and out with just one click" />
              <FeatureItem text="View detailed work history and analytics" />
              <FeatureItem text="Accurate paycheck calculations in real-time" />
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleGetStarted}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Get Started
              </button>
              <Link href="/demo" className="bg-white text-cyan-500 border border-cyan-500 font-bold py-3 px-6 rounded-lg hover:bg-cyan-50 transition duration-300 ease-in-out">
                Watch Demo
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/hero-image.png"
              alt="TimeTrack Pro Dashboard"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }) => (
  <div className="flex items-center">
    <svg className="w-6 h-6 text-cyan-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span className="text-gray-700">{text}</span>
  </div>
);

export default Home;
