// src/lib/models/Employee.js
class Person {
    constructor(name, email) {
      this.name = name;
      this.email = email;
    }
  }
  
  class Employee extends Person {
    constructor(name, email, employeeId, hourlyRate) {
      super(name, email);
      this.employeeId = employeeId;
      this.hourlyRate = hourlyRate;
      this.timeEntries = [];
    }
  
    clockIn() {
      this.timeEntries.push({ type: 'in', time: new Date() });
    }
  
    clockOut() {
      this.timeEntries.push({ type: 'out', time: new Date() });
    }
  
    calculatePay(startDate, endDate) {
      // Implementation of pay calculation logic
    }
  }