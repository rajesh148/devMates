const express = require("express");
const connectDB = require("./config/database");
const mongoSanitize = require("express-mongo-sanitize");
const User = require("./model/user");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/Auth");

const app = express();

const PORT = 7777;

app.use(express.json());

app.use(cookieParser());

app.use(mongoSanitize());

app.post("/signup", async (req, res) => {
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
    res.status(400).send("ERROR : " + err.message);
  }
});

//Login
app.post("/login", async (req, res) => {
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

    const isPasswordValid = user.getPasswordHash(password);

    if (isPasswordValid) {
      //Create a token
      const token = user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfully!!!");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
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

app.get("/sendConnectionRequest", userAuth, (req, res) => {
  res.send("sent connection");
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
