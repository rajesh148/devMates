const User = require("../model/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // Log cookies for debugging
    console.log("Cookies received: ", req.cookies);

    if (!token || typeof token !== "string") {
      return res.status(401).send("Please login");
    }

    // Verify the token and catch any errors
    const decodeObj = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          throw new Error("JWT verification failed: " + err.message);
        }
        return decoded;
      }
    );

    console.log("Decoded Object: ", decodeObj);

    // Find the user using the decoded ID
    const user = await User.findById(decodeObj._id);

    if (!user) {
      throw new Error("User not found with this ID!!");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("ERROR in auth middleware: ", err.message);
    res.status(400).send("ERROR auth: " + err.message);
  }
};

module.exports = {
  userAuth,
};
