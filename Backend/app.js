require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/auth");
const dashboardRoutes = require("./Routes/dashboard");
const cors = require("cors");
const hoursRoutes = require("./Routes/hours"); 
const supervisorRoutes = require("./Routes/supervisor");
const timesheetRoutes = require("./Routes/timesheet");
const adminRoutes = require("./Routes/admin");


const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Enable CORS
app.use(cors({
  origin: "*", 
  credentials: true,              
}));

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes); 
app.use("/dashboard", dashboardRoutes);
app.use("/api", hoursRoutes); 
app.use("/supervisor", supervisorRoutes);
app.use("/timesheet", timesheetRoutes);
app.use("/admin", adminRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
