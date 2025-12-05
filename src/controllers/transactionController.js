const transactionService = require("../services/transactionService");

class TransactionController {
  create = async (req, res) => {
    try {
      const transaction = await transactionService.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res) => {
    try {
      const transactions = await transactionService.getAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const transaction = await transactionService.getTransactionById(
        req.params.id
      );
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const updatedTransaction = await transactionService.updateTransaction(
        req.params.id,
        req.body
      );
      // Assume service throws 404 error if ID not found, which next(error) handles.
      res.status(200).json(updatedTransaction);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const deletedTransaction = await transactionService.deleteTransaction(
        req.params.id
      );
      // Assume service throws 404 error if ID not found.
      res.status(200).json(deletedTransaction);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new TransactionController();
