const { body } = require("express-validator");
const signupValidations = [
  body("name").notEmpty().trim().withMessage("name is required"),
  body("email").notEmpty().trim().withMessage("email is required"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("password should be 5 characters long"),
];
module.exports = signupValidations;
