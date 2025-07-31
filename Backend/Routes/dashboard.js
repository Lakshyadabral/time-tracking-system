const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/:employeeId", async (req, res) => {
    const { employeeId } = req.params;

    try {
        const user = await User.findOne({ employeeId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Dashboard data fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                employeeId: user.employeeId,
                otherDetails: user.otherDetails, 
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
