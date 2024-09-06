// app/components/ReportGenerator.js
"use client"

import React, { useState } from 'react';

const ReportGenerator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  const generateReport = async (e) => {
    e.preventDefault();
    setError('');
    setReportData(null);

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
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Report Generator</h2>
      <form onSubmit={generateReport} className="space-y-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block mb-1">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block mb-1">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="reportTitle" className="block mb-1">Report Title:</label>
          <input
            type="text"
            id="reportTitle"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Generate Report
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {reportData && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{reportData.title}</h3>
          <p className="mb-2">Generated on: {new Date().toLocaleString()}</p>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">User</th>
                <th className="border border-gray-300 px-4 py-2">Total Hours</th>
                <th className="border border-gray-300 px-4 py-2">Regular Hours</th>
                <th className="border border-gray-300 px-4 py-2">Overtime Hours</th>
                <th className="border border-gray-300 px-4 py-2">Total Pay</th>
              </tr>
            </thead>
            <tbody>
              {reportData.data.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{row.userName}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.totalHours.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.regularHours.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.overtimeHours.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">${row.totalPay.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;