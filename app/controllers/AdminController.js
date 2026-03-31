const Product = require("../models/productModel");
const Category = require("../models/category");

class AdminController {
  dashboard(req, res) {
    Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Category.countDocuments({ isDeleted: false }),
    ])
      .then(([totalProducts, totalCategories]) => {
        res.render("admin/dashboard", { totalProducts, totalCategories });
      })
      .catch((err) => {
        console.log(err);
        res.render("admin/dashboard", { totalProducts: 0, totalCategories: 0 });
      });
  }
}

module.exports = new AdminController();
