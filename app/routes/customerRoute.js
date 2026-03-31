const express = require("express");
const CustomerController = require("../controllers/CustomerController");
const router = express.Router();

// Homepage
router.get("/", CustomerController.home);

// Product detail
router.get("/product/:slug", CustomerController.productDetail);

module.exports = router;
