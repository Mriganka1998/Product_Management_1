const express = require("express");

const router = express.Router();

const adminRoute = require("./adminRoute");
const customerRoute = require("./customerRoute");

router.use("/admin", adminRoute);
router.use("/", customerRoute);

module.exports = router;
