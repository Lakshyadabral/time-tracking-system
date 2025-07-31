const express = require("express");
const Timesheet = require("../models/timesheet");
const router = express.Router();

// Get all approved timesheets
router.get("/timesheets/approved", async (req, res) => {
    try {
        const approvedTimesheets = await Timesheet.find({
            "hours.approved": true, // Ensures every entry in the `hours` array is approved
        });
        res.status(200).json(approvedTimesheets);
    } catch (err) {
        console.error("Error fetching approved timesheets:", err);
        res.status(500).json({ error: "Failed to fetch approved timesheets." });
    }
});

module.exports = router;
