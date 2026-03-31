const express = require("express");
const ProductController = require("../controllers/ProductController");
const upload = require("../utils/productImageUpload");
const router = express.Router();

// List all products
router.get("/", ProductController.list);

// Add product form
router.get("/add", ProductController.addForm);
// Add product
router.post("/add", upload.single("image"), ProductController.add);

// Edit product form
router.get("/edit/:id", ProductController.editForm);
// Edit product
router.post("/edit/:id", upload.single("image"), ProductController.edit);

// Soft delete product
router.post("/delete/:id", ProductController.delete);

module.exports = router;
