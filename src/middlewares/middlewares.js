const authMiddleware = (req, res, next) => {
  const token = "rajesh";
  const authorization = token === "rajesh";

  if (!authorization) {
    res.status(401).send("Unauthorized user");
  } else {
    console.log("Valid adminuser");
    next();
  }
};

const userMiddleware = (req, res, next) => {
  const token = "sandy";

  const authUser = token === "sandy";

  if (!authUser) {
    res.status(401).send("Unauthorized user action");
  } else {
    console.log("Valid user");
    next();
  }
};

module.exports = { authMiddleware, userMiddleware };
