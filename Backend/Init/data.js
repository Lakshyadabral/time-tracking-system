require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

async function seedDatabase() {
   await mongoose.connect(process.env.MONGO_URI);

    const defaultPassword = "DefaultPassword123";

    const users = [
        { employeeId: "EMP001", role: "employee", password: defaultPassword, supervisorId: "SUP001" },
        { employeeId: "EMP002", role: "employee", password: defaultPassword, supervisorId: "SUP001" },
        { employeeId: "EMP003", role: "employee", password: defaultPassword, supervisorId: "SUP001" },
        { employeeId: "EMP004", role: "employee", password: defaultPassword, supervisorId: "SUP001" },
        { employeeId: "SUP001", role: "supervisor", password: defaultPassword },
        { employeeId: "ADMIN001", role: "admin", password: defaultPassword }, 

    ];

    await User.deleteMany(); // Clear the database

    // Hash passwords and save users
    for (const user of users) {
        user.password = await bcrypt.hash(user.password, 10);
        await User.create(user);
    }

    console.log("Database seeded successfully!");
    mongoose.connection.close();
}

seedDatabase();
