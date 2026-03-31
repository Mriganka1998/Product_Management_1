const express = require("express");

const AdminController = require("../controllers/AdminController");
const router = express.Router();

router.get("/dashboard", AdminController.dashboard);

// Category management
const categoryRoute = require("./categoryRoute");
router.use("/categories", categoryRoute);
// Product management
const productRoute = require("./productRoute");
router.use("/products", productRoute);
module.exports = router;
