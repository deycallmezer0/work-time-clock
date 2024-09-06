// app/components/PaycheckCalculator.js
"use client"

import React, { useState } from 'react';

const PaycheckCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paycheckData, setPaycheckData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const calculatePaycheck = async () => {
    setError('');
    setPaycheckData(null);
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to calculate your paycheck.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/paycheck?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch paycheck data');
      }

      const data = await response.json();
      setPaycheckData(data);
    } catch (error) {
      setError('An error occurred while calculating your paycheck. Please try again.');
      console.error('Paycheck calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Paycheck Calculator</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
        onClick={calculatePaycheck}
        disabled={isLoading}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Calculating...' : 'Calculate Paycheck'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {paycheckData && (
        <div className="mt-6 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Paycheck Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-medium">Regular Hours:</span> {paycheckData.regularHours.toFixed(2)}</p>
            <p><span className="font-medium">Overtime Hours:</span> {paycheckData.overtimeHours.toFixed(2)}</p>
            <p><span className="font-medium">Regular Pay:</span> ${paycheckData.regularPay.toFixed(2)}</p>
            <p><span className="font-medium">Overtime Pay:</span> ${paycheckData.overtimePay.toFixed(2)}</p>
          </div>
          <p className="mt-4 text-xl font-bold text-blue-600">Total Pay: ${paycheckData.totalPay.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default PaycheckCalculator;
