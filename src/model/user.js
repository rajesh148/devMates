const mongoose = require("mongoose");
const validator = require("validator");

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
    phone: {
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
        "data:image/png;base64,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",

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
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
