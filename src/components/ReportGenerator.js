// File: src/components/ReportGenerator.js
'use client'

import { useState } from 'react'

export default function ReportGenerator() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [report, setReport] = useState(null)

  async function generateReport() {
    const response = await fetch(`/api/reports?start=${startDate}&end=${endDate}`)
    const data = await response.json()
    setReport(data)
  }

  return (
    <div className="space-y-4">
      <div className="space-x-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={generateReport}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate Paycheck Report
        </button>
      </div>

      {report && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Employee</th>
              <th className="border p-2">Regular Hours</th>
              <th className="border p-2">Overtime Hours</th>
              <th className="border p-2">Regular Pay</th>
              <th className="border p-2">Overtime Pay</th>
              <th className="border p-2">Total Pay</th>
            </tr>
          </thead>
          <tbody>
            {report.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.regularHours.toFixed(2)}</td>
                <td className="border p-2">{employee.overtimeHours.toFixed(2)}</td>
                <td className="border p-2">${employee.regularPay.toFixed(2)}</td>
                <td className="border p-2">${employee.overtimePay.toFixed(2)}</td>
                <td className="border p-2">${employee.totalPay.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
