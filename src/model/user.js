const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [4, "First Name Length should be more than 3"],
      maxLength: [50, "First Name Length should be less than 50"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      minLength: [4, "Last Name Length should be more than 3"],
      maxLength: [50, "Last Name Length should be less than 50"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [4, "Password Length should be more than 3"],
      // maxLength: [50, "Password Length should be less than 50"],
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Your password is not stronger");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "You must be at least 18 years old!"], // Optional with validation
    },
    gender: {
      type: String,
      validate: {
        validator: function (v) {
          if (!["male", "female", "others"].includes(v)) {
            throw new Error("Gender data is not valid");
          }
        },
        message: (props) => `${props.value} is not a valid gender.`,
      },
    },
    mobileNumber: {
      type: String,
      // required: [true, "User phone number required"],
      validate: {
        validator: function (v) {
          // Custom validation: Phone number should start with 6-9 and be 10 digits long
          return /^[6-9]\d{9}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid phone number! It must be a 10-digit number starting with 6-9.`,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png",
      // validate: (value) => {
      //   if (!validator.isDataURI(value)) {
      //     throw new Error("Invalid PhotoUrl address");
      //   }
      // },
    },
    about: {
      type: String,
      default: "This is a default string for about of the User",
    },
    skills: {
      type: [String],
      required: [true, "Atleaset add one skill"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

// userSchema.methods.getPasswordHash = async function (passwordInputByUser) {
//   const user = this;
//   const isPasswordValid = await bcrypt.compare(
//     passwordInputByUser,
//     user.password
//   );
//   return isPasswordValid;
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
