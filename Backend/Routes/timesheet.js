const express = require("express");
const Timesheet = require("../models/timesheet");
const router = express.Router();
const User = require("../models/user");

router.post("/submit-timesheet", async (req, res) => {
    const { employeeId, hours } = req.body;

    try {
        console.log("Submitted payload:", { employeeId, hours });

        const supervisorId = await User.findOne({ employeeId }).then(user => user.supervisorId);

        if (!supervisorId) {
            return res.status(404).json({ error: "Supervisor not found" });
        }

          if (!Array.isArray(hours)) {
            return res.status(400).json({ error: "Invalid hours format. Expected an array." });
        }

        const timesheet = new Timesheet({ employeeId, supervisorId, hours });
        await timesheet.save();

        res.status(200).json({ message: "Timesheet submitted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit timesheet." });
    }
});


router.put("/supervisor/timesheets/update", async (req, res) => {
    const { timesheetId, hours } = req.body;

    try {
        const timesheet = await Timesheet.findById(timesheetId);
        if (!timesheet) {
            return res.status(404).json({ error: "Timesheet not found" });
        }

        timesheet.hours = hours; // Replace hours with the updated data
        await timesheet.save();

        res.status(200).json({ message: "Timesheet updated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update timesheet." });
    }
});





module.exports = router;
