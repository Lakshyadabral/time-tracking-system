const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

router.post("/login", async (req, res) => {


    const { employeeId, password } = req.body;

    try {

        console.log("Login endpoint hit with data:", req.body);
        // Find user by employeeId
        const user = await User.findOne({ employeeId });
        console.log("Query executed, user found:", user);


        if (!user) {
            console.log("User not found for employeeId:", employeeId);
            return res.status(404).json({ error: "Invalid employee ID or password" });
        }

        // Validate hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Password validation:", isPasswordValid);
            return res.status(401).json({ error: "Invalid employee ID or password" });
        }

        // Send user info based on role
        return res.status(200).json({
            message: `Redirect to ${user.role} dashboard`,
            user: {
                id: user._id,
                employeeId: user.employeeId,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

const testPassword = async () => {
    const plainPassword = "DefaultPassword123";
    const hashedPassword = "$2b$10$8e4.L.apt9jzKXs/XK4YY.9m3FI0jy6X83hZxXz/.cR64hDj8fIl6";

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("Password match:", isMatch);
};

testPassword();

module.exports = router;
