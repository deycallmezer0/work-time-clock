// app/components/ReportGenerator.js
"use client"

import React, { useState } from 'react';

const ReportGenerator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async (e) => {
    e.preventDefault();
    setError('');
    setReportData(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ startDate, endDate, reportTitle })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError('An error occurred while generating the report. Please try again.');
      console.error('Report generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Report Generator</h2>
      <form onSubmit={generateReport} className="space-y-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="reportTitle" className="block text-sm font-medium text-gray-700 mb-2">Report Title:</label>
          <input
            type="text"
            id="reportTitle"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button 
          type="submit" 
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {reportData && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{reportData.title}</h3>
          <p className="mb-4 text-gray-600">Generated on: {new Date().toLocaleString()}</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total Hours</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Regular Hours</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Overtime Hours</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total Pay</th>
                </tr>
              </thead>
              <tbody>
                {reportData.data.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2">{row.userName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.totalHours.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.regularHours.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.overtimeHours.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">${row.totalPay.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
