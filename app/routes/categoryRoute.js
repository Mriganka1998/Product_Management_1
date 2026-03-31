const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const router = express.Router();

// List all categories
router.get("/", CategoryController.list);

// Add category form
router.get("/add", CategoryController.addForm);
// Add category
router.post("/add", CategoryController.add);

// Edit category form
router.get("/edit/:id", CategoryController.editForm);
// Edit category
router.post("/edit/:id", CategoryController.edit);

// Soft delete category
router.post("/delete/:id", CategoryController.delete);

module.exports = router;
