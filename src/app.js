const express = require("express");
const connectDB = require("./config/database");
const mongoSanitize = require("express-mongo-sanitize");
const User = require("./model/user");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();

const PORT = 7777;

app.use(express.json());

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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successfully!!!");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/user", async (req, res) => {
  //   try {
  //     //Find will return the array. So we are name it as plural
  //     const users = await User.find({ email: req.body.email });
  //     if (users.length !== 0) {
  //       res.send(users);
  //     } else {
  //       res.status(404).send("User not found!!");
  //     }
  //   } catch (err) {
  //     res.status(404).send("Something went wrong!!");
  //   }
  // });

  console.log(req.body);

  try {
    const user = await User.findById(req.body._id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found!!");
    }
  } catch (err) {
    res.status(404).send("Something went wrong!!");
  }
});

app.get("/feed", async (req, res) => {
  // try {
  const users = await User.find({});
  res.send(users);
  // } catch (err) {
  //   res.status(404).send("Something went wrong!!");
  // }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.body._id });
    // console.log(deleteOne);
    res.send("Deleted successfully");
  } catch (err) {
    res.status(404).send("Something went wrong!!");
  }
});

app.patch("/user/:userId", async (req, res) => {
  console.log("body", req.body);
  try {
    const userId = req.params.userId;

    const data = req.body;

    console.log(data);

    const allowedFields = [
      "firstName",
      "lastName",
      "gender",
      "photoUrl",
      "about",
      "password",
      "skills",
    ];

    console.log("all ", Object.keys(req.body));

    const isAllowedToChange = Object.keys(req.body).every((item) =>
      allowedFields.includes(item)
    );

    if (!isAllowedToChange) {
      throw new Error("Update not possible");
    }

    const returnObj = await User.findOneAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });

    console.log("Obj ", returnObj);
    res.send("Data updatged successfully");
  } catch (err) {
    res.status(404).send("Something went wrong!!" + err.message);
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
