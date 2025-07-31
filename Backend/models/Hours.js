const mongoose = require("mongoose");

const hoursSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
    },
    date: {
        type: String, 
        required: true,
    },
    hoursWorked: {
        type: String, 
        required: true,
    },
});

module.exports = mongoose.model("Hours", hoursSchema);
