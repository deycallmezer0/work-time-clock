"use client"

import React from 'react';
import Link from 'next/link';
import UserManagement from '../components/UserManagement';
import WorkStatsVisualization from '../components/WorkStatsVisualization';

const Demo = () => {
  // Mock user ID for demo purposes
  const mockUserId = '12345';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Tyme Keepa Demo Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
              <h2 className="text-2xl font-semibold mb-4">User Management</h2>
              <UserManagement />
            </div>
            <div className="mt-8 border-4 border-dashed border-gray-200 rounded-lg p-4">
              <h2 className="text-2xl font-semibold mb-4">Work Stats Visualization</h2>
              <WorkStatsVisualization userId={mockUserId} />
            </div>
          </div>
        </div>
      </main>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-purple-600 hover:text-purple-800">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Demo;
