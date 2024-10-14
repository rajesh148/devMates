const express = require("express");
const { userAuth } = require("../middlewares/Auth");
const {
  validateEditProfile,
  validateProfilePassword,
} = require("../utils/validation");

const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Invalid user");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : in user profile View " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Editing profile is failed");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    await loggedInUser.save();

    res.json({
      message: "Profile updated successfully!!!",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : in user profile Edit " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateProfilePassword(req)) {
      throw new Error("Edit password request failed");
    }
    const { password, newPassword, confirmPassword } = req.body;

    const loggedInUser = req.user;

    console.log("pass ", password);
    const isPasswordValid = await loggedInUser.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Current password was wrong");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("New password and ConfirmPasswords are not matched");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter strong password");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash;

    await loggedInUser.save();

    res.json({ message: "Password updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR : in user profile password " + err.message);
  }
});

module.exports = profileRouter;
