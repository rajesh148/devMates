const User = require("../model/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is invalid!!");
    }

    const decodeObj = jwt.verify(token, "This is");

    const user = await User.findById(decodeObj._id);

    if (!user) {
      throw new Error("User not found!!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {
  userAuth,
};
