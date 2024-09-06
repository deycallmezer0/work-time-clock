// src/lib/models/Employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  hourlyRate: { type: Number, required: true },
  timeEntries: [{ 
    type: { type: String, enum: ['in', 'out'] },
    time: { type: Date, default: Date.now }
  }]
});

employeeSchema.methods.clockIn = function() {
  this.timeEntries.push({ type: 'in', time: new Date() });
  return this.save();
};

employeeSchema.methods.clockOut = function() {
  this.timeEntries.push({ type: 'out', time: new Date() });
  return this.save();
};

employeeSchema.methods.calculatePay = function(startDate, endDate) {
  // Implementation of pay calculation logic
};

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default Employee;
