const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");

const app = express();

const PORT = 7777;

app.post("/signup", async (req, res) => {
  const userData = {
    firstName: "Rajesh",
    lastName: "Bagguva",
    email: "rajesh@bagguva.com",
    password: "rajesh@123",
  };

  const user = new User(userData);

  try {
    await user.save();
    res.send("User added successfully!!!");
  } catch (err) {
    res.status(400).send("Error while creating the User " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database is connected susccessfully!!");

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database is not connected!!!");
  });
