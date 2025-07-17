import { body, validationResult } from "express-validator";

// 📌 Contact validation rules
export const contactValidationRules = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be a string"),

  body("phone")
    .notEmpty().withMessage("Phone is required")
    .isLength({ min: 5 }).withMessage("Phone must be at least 5 digits"),

  body("email")
    .optional()
    .isEmail().withMessage("Invalid email format"),

  body("address")
    .optional()
    .isString().withMessage("Address must be a string"),

  body("occupation")
    .optional()
    .isString().withMessage("Occupation must be a string"),
];

// 📌 Validation result handler middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};
