require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const User = require("../models/user"); 
const { userSchema } = require("./schema.js"); 


const MONGO_URL = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
}

const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    console.log("Existing users cleared");

    // Validate and hash passwords for each user
    const validatedUsers = await Promise.all(
      initData.data.map(async (user) => {
        // Validate user against schema
        const { error } = userSchema.validate(user);
        if (error) throw new Error(`Validation Error: ${error.message}`);

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        return { ...user, password: hashedPassword };
      })
    );

    // Insert validated and processed users into the database
    await User.insertMany(validatedUsers);
    console.log("Database seeded with user data");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
    console.log("Connection closed");
  }
};

main()
  .then(seedDB)
  .catch((err) => console.error("Error connecting to MongoDB:", err));
