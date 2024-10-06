// src/app/page.js

"use client"

import React from 'react';
import Image from 'next/image';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100">


      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tyme Keepa: A Time Management Solution
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Capstone project for Bachelor's in Software Development. A powerful tool designed to help you track time, boost productivity, and manage your work efficiently.
            </p>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Key Features of Tyme Keepa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Intuitive Time Tracking", 
                description: "Effortlessly log your work hours with a user-friendly interface. Clock in and out with a single click, and easily manage your daily, weekly, and monthly schedules." 
              },
              { 
                title: "Productivity Analytics", 
                description: "Visualize your work patterns and identify areas for improvement. Get insights into your most productive hours, track project time allocations, and optimize your workflow." 
              },
              { 
                title: "Paycheck Calculator", 
                description: "Automatically calculate your expected paycheck based on your logged hours, hourly rate, and overtime rules. Stay on top of your earnings in real-time." 
              },
              { 
                title: "Report Generation", 
                description: "Generate comprehensive reports for both employees and managers. Access detailed breakdowns of hours worked, projects completed, and earnings over custom date ranges." 
              },
              { 
                title: "Secure Database Management", 
                description: "All your data is securely stored and managed using MongoDB, ensuring fast access and reliable backups of your important time and payroll information." 
              },
              { 
                title: "Responsive Web Design", 
                description: "Access Tyme Keepa from any device with an internet connection. Our responsive design ensures a seamless experience on desktops, tablets, and smartphones." 
              }
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
          <p className="text-lg text-gray-700 text-center mt-4">
            Built using Next.js for the frontend and Node.js for the backend, Tyme Keepa demonstrates 
            proficiency in modern web development practices. The application utilizes MongoDB for efficient 
            data storage and retrieval, ensuring scalability and performance.
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