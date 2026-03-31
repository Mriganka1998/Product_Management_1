const Product = require("../models/productModel");
const Category = require("../models/category");

const CustomerController = {
  // Homepage: list products, filter, search
  async home(req, res) {
    const { category, search } = req.query;
    let query = { isDeleted: false };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query).populate("category");
    const categories = await Category.find({ isDeleted: false });
    res.render("home", {
      products,
      categories,
      selectedCategory: category,
      search,
    });
  },

  // Product detail
  async productDetail(req, res) {
    const product = await Product.findOne({
      slug: req.params.slug,
      isDeleted: false,
    }).populate("category");
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("product/detail", { product });
  },
};

module.exports = CustomerController;
