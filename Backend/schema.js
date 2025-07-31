const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  password: { type: String, required: true }, 
  role: { type: String, required: true, enum: ["employee", "supervisor" , "admin"] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
