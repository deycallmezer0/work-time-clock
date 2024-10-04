// File: src/lib/paycheck.js
export function calculatePay(timeEntries, hourlyRate) {
    let totalHours = 0
    let overtimeHours = 0
  
    // Group time entries by day
    const entriesByDay = timeEntries.reduce((acc, entry) => {
      const date = entry.timestamp.toDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(entry)
      return acc
    }, {})
  
    // Calculate hours worked for each day
    Object.values(entriesByDay).forEach(dayEntries => {
      let dayHours = 0
      for (let i = 0; i < dayEntries.length; i += 2) {
        const clockIn = dayEntries[i]
        const clockOut = dayEntries[i + 1]
        if (clockIn && clockOut) {
          dayHours += (clockOut.timestamp - clockIn.timestamp) / (1000 * 60 * 60)
        }
      }
      totalHours += Math.min(dayHours, 8)
      overtimeHours += Math.max(dayHours - 8, 0)
    })
  
    const regularPay = totalHours * hourlyRate
    const overtimePay = overtimeHours * hourlyRate * 1.5
  
    return {
      regularHours: totalHours,
      overtimeHours,
      regularPay,
      overtimePay,
      totalPay: regularPay + overtimePay
    }
  }