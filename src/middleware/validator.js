const { z } = require("zod");
const AppError = require("../utils/AppError");

function isValidEmail(email) {
  // simple regex; good enough for demo
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const validateUser = (req, res, next) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return next(new AppError("Name is required", 400));
  }
  if (!email || !isValidEmail(email)) {
    return next(new AppError("Valid email is required", 400));
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return next(
      new AppError(
        "Password is required and must be at least 6 characters",
        400
      )
    );
  }
  next();
};

const validateTransaction = (req, res, next) => {
  const { type, category, amount } = req.body || {};
  const typesAccepted = ["income", "expense"];

  // --- Helper function for common string validation ---
  const validateStringField = (value, fieldName) => {
    if (!value || typeof value !== "string" || !value.trim()) {
      return `Invalid or missing ${fieldName}. It must be a non-empty string.`;
    }
    return null; // Return null if valid
  };

  // --- Type Validation ---
  const typeError = validateStringField(type, "type");
  if (typeError) return next(new AppError(typeError, 400));

  if (!typesAccepted.includes(type.toLowerCase())) {
    return next(
      new AppError("Transaction type must be 'income' or 'expense'.", 400)
    );
  }

  // --- Category Validation ---
  const categoryError = validateStringField(category, "category");
  if (categoryError) return next(new AppError(categoryError, 400));

  // --- Amount Validation ---
  if (amount === undefined || amount === null) {
    return next(new AppError("Amount is required.", 400));
  }
  if (typeof amount !== "number") {
    return next(new AppError("Amount must be a number.", 400));
  }
  if (amount <= 0) {
    return next(new AppError("Amount should be greater than zero.", 400));
  }

  // If all checks pass, proceed to the next middleware/route handler
  next();
};

const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
  }),
  category: z.string().min(1, "Category is required"),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0"),
});

module.exports = { validateTransaction, validateUser };
