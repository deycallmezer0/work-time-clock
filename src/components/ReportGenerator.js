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
    <div>
      <div className="mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={generateReport}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>
      </div>

      {report && (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Employee</th>
              <th className="text-left">Hours Worked</th>
              <th className="text-left">Regular Pay</th>
              <th className="text-left">Overtime Pay</th>
              <th className="text-left">Total Pay</th>
            </tr>
          </thead>
          <tbody>
            {report.employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.hoursWorked}</td>
                <td>${employee.regularPay.toFixed(2)}</td>
                <td>${employee.overtimePay.toFixed(2)}</td>
                <td>${employee.totalPay.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}