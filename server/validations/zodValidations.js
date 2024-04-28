const { check } = require("express-validator");

const userSchema = [
  // Validate name
  check("name")
    .exists()
    .withMessage("Name is required")
    .trim()
    .escape() // Sanitize to prevent XSS attacks
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  // Validate email
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(), // Normalize for consistent storage

  // Validate password
  check("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must contain a lowercase letter, uppercase letter, number, and special symbol"
    ),

  // Validate phone (optional, customize based on your phone number format)
  check("phone")
    .optional() // Make phone validation optional if needed
    .isMobilePhone("any") // Check for valid phone number format across regions
    .withMessage("Invalid phone number format"),
];

module.exports = userSchema;
