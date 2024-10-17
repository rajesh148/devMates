const express = require("express");
const { validateSignUp } = require("../utils/validation");
const User = require("../model/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Validation
    validateSignUp(req);

    const { firstName, lastName, email, password } = req.body;
    //password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully!!!");
  } catch (err) {
    res.status(400).send("ERROR signup : " + err.message);
  }
});

//Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //email check;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create a token
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      //   res.cookie("token", token, {
      //     expires: new Date(Date.now() + 80 * 3600000),
      //   });

      res.send("Login Successfully!!!");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR in Login : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successfullu.");
});

module.exports = authRouter;
