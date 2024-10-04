// app/components/PaycheckInfo.js
"use client"

import React, { useState } from 'react';

const PaycheckInfo = () => {
  const [paycheckData, setPaycheckData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchPaycheckData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/paycheck?startDate=${startDate}&endDate=${endDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPaycheckData(data);
      } else {
        throw new Error('Failed to fetch paycheck data');
      }
    } catch (error) {
      console.error('Error fetching paycheck data:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Paycheck Information</h2>
      <div className="mb-4">
        <label className="block mb-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <button
        onClick={fetchPaycheckData}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Calculate Paycheck
      </button>
      {paycheckData && (
        <div className="mt-4 bg-white shadow rounded-lg p-4">
          <h3 className="text-xl font-bold mb-2">Paycheck Summary</h3>
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

export default PaycheckInfo;