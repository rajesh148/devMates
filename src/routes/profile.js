const express = require("express");
const { userAuth } = require("../middlewares/Auth");

const profleRouter = express.Router();

profleRouter.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        throw new Error("Invalid user");
      }
  
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });
module.exports = profleRouter;
