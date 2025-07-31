const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    supervisorId: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    sentToAdmin: { type: Boolean, default: false }, 
    hours: [
        {
            date: String,
            hoursWorked: String,
            approved: { type: Boolean, default: false },
        },
    ],
});

module.exports = mongoose.model("Timesheet", timesheetSchema);
