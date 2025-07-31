const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["employee", "supervisor" , "admin"],
        required: true,
    },
    supervisorId: {
        type: String, 
        required: function () {
            return this.role === "employee"; 
        },
    },
});

module.exports = mongoose.model("User", userSchema, "users");
