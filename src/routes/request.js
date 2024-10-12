const express = require("express");
const { userAuth } = require("../middlewares/Auth");

const requestRouter = express.Router();
requestRouter.get("/sendConnectionRequest", userAuth, (req, res) => {
  res.send("sent connection");
});
module.exports = requestRouter;
