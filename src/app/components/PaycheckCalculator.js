// app/components/PaycheckCalculator.js
"use client"

import React, { useState } from 'react';

const PaycheckCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paycheckData, setPaycheckData] = useState(null);
  const [error, setError] = useState('');

  const calculatePaycheck = async () => {
    setError('');
    setPaycheckData(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to calculate your paycheck.');
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
    }
  };

  return (
    <div className="mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Paycheck Calculator</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <button
        onClick={calculatePaycheck}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Calculate Paycheck
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {paycheckData && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Paycheck Summary</h3>
          <p>Regular Hours: {paycheckData.regularHours.toFixed(2)}</p>
          <p>Overtime Hours: {paycheckData.overtimeHours.toFixed(2)}</p>
          <p>Regular Pay: ${paycheckData.regularPay.toFixed(2)}</p>
          <p>Overtime Pay: ${paycheckData.overtimePay.toFixed(2)}</p>
          <p className="font-bold">Total Pay: ${paycheckData.totalPay.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default PaycheckCalculator;