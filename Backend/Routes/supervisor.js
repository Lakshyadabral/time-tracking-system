const express = require("express");
const Timesheet = require("../models/timesheet");
const router = express.Router();

// Get timesheets for a supervisor
router.get("/timesheets/:supervisorId", async (req, res) => {
    const { supervisorId } = req.params;

    if (!supervisorId) {
        return res.status(400).json({ error: "Supervisor ID is required." });
    }

    try {
        const timesheets = await Timesheet.find({ supervisorId });
        res.status(200).json({ timesheets });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// Update hours or approval status
router.put("/timesheets/update", async (req, res) => {
    const { timesheetId, date, updatedHours, approved } = req.body;

    try {
        // Find the timesheet by ID
        const timesheet = await Timesheet.findById(timesheetId);
        if (!timesheet) {
            return res.status(404).json({ error: "Timesheet not found" });
        }

        // Update the specific date entry
        const entry = timesheet.hours.find((entry) => entry.date === date);
        if (!entry) {
            return res.status(404).json({ error: "Date entry not found" });
        }

        if (updatedHours) entry.hoursWorked = updatedHours;
        if (approved !== undefined) entry.approved = approved;

        // Save changes
        await timesheet.save();
        res.status(200).json({ message: "Timesheet updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// Approve a timesheet
router.put("/timesheets/approve", async (req, res) => {
    const { timesheetId } = req.body;

    try {
        const timesheet = await Timesheet.findById(timesheetId);
        if (!timesheet) {
            return res.status(404).json({ error: "Timesheet not found" });
        }

        // Approve all hours in the timesheet
        timesheet.hours.forEach((entry) => {
            entry.approved = true;
        });

        await timesheet.save();

        res.status(200).json({ message: "Timesheet approved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to approve timesheet." });
    }
});


router.put("/timesheets/approve-all", async (req, res) => {
    const { supervisorId } = req.body;

    try {
        const timesheets = await Timesheet.find({ supervisorId });
        if (!timesheets.length) {
            return res.status(404).json({ error: "No timesheets found for this supervisor." });
        }

        // Approve all timesheets
        timesheets.forEach((timesheet) => {
            timesheet.hours.forEach((entry) => {
                entry.approved = true;
            });
        });

        await Promise.all(timesheets.map((timesheet) => timesheet.save()));

        res.status(200).json({ message: "All timesheets approved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to approve all timesheets." });
    }
});

router.post("/timesheets/send-to-admin", async (req, res) => {
    const { supervisorId, timesheets } = req.body;

    try {
        if (!timesheets || !timesheets.length) {
            return res.status(400).json({ error: "No approved timesheets to send." });
        }

        console.log(`Supervisor ID ${supervisorId} is sending approved timesheets to admin:`, timesheets);

        res.status(200).json({ message: "Approved timesheets sent to Admin successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send approved timesheets to Admin." });
    }

    
});

router.put("/timesheets/toggle-approve", async (req, res) => {
    const { timesheetId, approved } = req.body;

    try {
        const timesheet = await Timesheet.findById(timesheetId);

        if (!timesheet) {
            return res.status(404).json({ error: "Timesheet not found" });
        }

        // Update all entries to the provided approval status
        timesheet.hours.forEach((entry) => {
            entry.approved = approved;
        });

        await timesheet.save();

        res.status(200).json({ message: "Approval status updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update approval status." });
    }
});


module.exports = router;
