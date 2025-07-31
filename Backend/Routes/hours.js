const express = require("express");
const Hours = require("../models/Hours");
const router = express.Router();

// Save hours worked
router.post("/save-hours", async (req, res) => {
    const { employeeId, date, hoursWorked } = req.body;

    try {
        // Check if entry already exists for the given employee and date
        const existingEntry = await Hours.findOne({ employeeId, date });

        if (existingEntry) {
            // Update the existing entry
            existingEntry.hoursWorked = hoursWorked;
            await existingEntry.save();
            return res.status(200).json({ message: "Hours updated successfully" });
        }

        // Create a new entry if none exists
        const newEntry = new Hours({ employeeId, date, hoursWorked });
        await newEntry.save();

        res.status(201).json({ message: "Hours saved successfully" });
    } catch (err) {
        console.error("Error saving hours:", err);
        res.status(500).json({ error: "Failed to save hours" });
    }
});

// Fetch hours worked for an employee
router.get("/get-hours/:employeeId", async (req, res) => {
    const { employeeId } = req.params;

    try {
        const hours = await Hours.find({ employeeId });
        res.status(200).json({ hours });
    } catch (err) {
        console.error("Error fetching hours:", err);
        res.status(500).json({ error: "Failed to fetch hours" });
    }
});

module.exports = router;
