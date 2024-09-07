// app/page.js
"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    // For the capstone project, we'll always redirect to the dashboard
    // In a real application, you'd check for authentication here
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100">
      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Tyme Keepa: A Time Management Solution
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Capstone project for Bachelor's in Software Development. Experience a powerful tool designed to help you track time, boost productivity, and manage your work efficiently.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={handleGetStarted}
                className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300"
              >
                Get Started
              </button>
              <Link href="/demo" className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition duration-300" passHref>
                View Dashboard Demo
              </Link>
              <Link href="#features" className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition duration-300">
                Explore Features
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

        <div id="features" className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Key Features of Tyme Keepa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Intuitive Time Tracking", description: "Effortlessly log your work hours with a user-friendly interface." },
              { title: "Productivity Analytics", description: "Visualize your work patterns and identify areas for improvement." },
              { title: "Academic Project Showcase", description: "Demonstrates software development skills acquired during the Bachelor's program." }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">About This Project</h2>
          <p className="text-lg text-gray-700 text-center">
            Tyme Keepa is a capstone project developed as part of a Bachelor's degree in Software Development. 
            It showcases the application of various software engineering principles, database management, 
            user interface design, and web development technologies learned throughout the academic program.
          </p>
        </div>
      </main>

      <footer className="bg-gray-100 mt-20">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-700">© 2023 Tyme Keepa - A Capstone Project for Bachelor's in Software Development</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
