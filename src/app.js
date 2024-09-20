const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");

const app = express();

const PORT = 7777;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully!!!");
  } catch (err) {
    res.status(400).send("Error while creating the User " + err.message);
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

app.patch("/user", async (req, res) => {
  console.log("body", req.body);
  try {
    const userId = req.body.userId;

    const data = req.body;

    // console.log(data);

    const returnObj = await User.findOneAndUpdate(
      { email: req.body.email },
      data
    );

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
