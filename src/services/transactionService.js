const transactionModel = require("../models/transactionModel");
// Ensure you have a utility for AppError
const AppError = require("../utils/AppError");

/**
 * Service layer responsible for business logic and validation.
 */
class TransactionService {
  async createTransaction(data) {
    // --- Validation moved here to ensure integrity before hitting the model ---
    const { type, amount, category } = data;
    const typesAccepted = ["income", "expense"];

    if (!type || !typesAccepted.includes(type.toLowerCase())) {
      throw new AppError(
        "Transaction type must be 'income' or 'expense'.",
        400
      );
    }

    if (
      !category ||
      typeof category !== "string" ||
      category.trim().length === 0
    ) {
      throw new AppError(
        "Category is required and must be a non-empty string.",
        400
      );
    }

    // Ensure amount is handled correctly
    if (typeof amount !== "number" || amount <= 0) {
      throw new AppError(
        "Amount must be a positive number greater than zero.",
        400
      );
    }

    // Pass validated data to the model
    return await transactionModel.create(data);
  }

  async getAllTransactions() {
    return await transactionModel.findAll();
  }

  async getTransactionById(id) {
    const transaction = await transactionModel.findById(id);
    if (!transaction) {
      // Throw an error that the controller/global handler can catch and translate to a 404
      throw new AppError(`Transaction with ID ${id} not found`, 404);
    }
    return transaction;
  }

  async updateTransaction(id, data) {
    // --- Validation for updates (only validating provided fields) ---
    if (data.amount !== undefined) {
      data.amount = Number(data.amount);
      if (typeof data.amount !== "number" || data.amount <= 0) {
        throw new AppError(
          "Amount must be a positive number greater than zero.",
          400
        );
      }
    }

    if (data.type && !["income", "expense"].includes(data.type.toLowerCase())) {
      throw new AppError(
        "Invalid transaction type. Must be 'income' or 'expense'.",
        400
      );
    }

    // Check if the transaction exists before trying to update
    const existing = await transactionModel.findById(id);
    if (!existing) {
      throw new AppError(
        `Transaction with ID ${id} not found for update.`,
        404
      );
    }

    return await transactionModel.update(id, data);
  }

  async deleteTransaction(id) {
    // Check if the transaction exists before trying to delete
    const existing = await transactionModel.findById(id);
    if (!existing) {
      throw new AppError(
        `Transaction with ID ${id} not found for deletion.`,
        404
      );
    }

    return await transactionModel.delete(id);
  }
}

module.exports = new TransactionService();
