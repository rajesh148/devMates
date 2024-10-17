const express = require("express");
const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

const requestRouter = express.Router();
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const loggedInUser = req.user;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status value is wrong",
        });
      }

      //to check with the existing connection
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({
          message: "Connection is already exists",
          data: existingConnection,
        });
      }

      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        return res.status(400).json({
          message: "There is no user with toUserID",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      console.log(toUserId);
      console.log(status);
      const data = await connectionRequest.save();

      res.status(201).json({
        message:
          loggedInUser.firstName +
          " have " +
          status +
          " this request with " +
          toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR in SEND REQUEST " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: status + " status request not allowed",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Request id not found in our DB",
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({
        message: "Connection request " + status,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR in review REQUEST" + err.message);
    }
  }
);

module.exports = requestRouter;
