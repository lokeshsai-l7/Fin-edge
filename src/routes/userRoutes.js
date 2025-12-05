const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateUser } = require("../middleware/validator");
console.log("Type of validateUser:", typeof validateUser); //
console.log("Type of registerUser:", typeof userController.registerUser);
router.post("/", validateUser, userController.registerUser);

module.exports = router;
