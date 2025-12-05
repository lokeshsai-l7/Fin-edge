const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { validateTransaction } = require("../middleware/validator");

router.post("/", validateTransaction, transactionController.create);
router.get("/", transactionController.getAll);
router.get("/:id", transactionController.getById);
router.patch("/:id", transactionController.update);
router.delete("/:id", transactionController.delete);

module.exports = router;
