const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password!");
  }
};

const validateEditProfile = (req) => {
  const allowedUpdateEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
    "email",
  ];

  const isEditAllow = Object.keys(req.body).every((field) =>
    allowedUpdateEditFields.includes(field)
  );

  return isEditAllow;
};

const validateProfilePassword = (req) => {
  const allowedUpdatePasswordFields = [
    "password",
    "newPassword",
    "confirmPassword",
  ];

  const isPasswordChangeAllowed = Object.keys(req.body).every((field) =>
    allowedUpdatePasswordFields.includes(field)
  );

  return isPasswordChangeAllowed;
};

module.exports = {
  validateSignUp,
  validateEditProfile,
  validateProfilePassword,
};
