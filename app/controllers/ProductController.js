const Product = require("../models/productModel");
const Category = require("../models/category");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const { ProductSchemaValidation } = require("../utils/SchemaValidation");

const ProductController = {
  // List all products (not deleted) with category
  async list(req, res) {
    const products = await Product.find({ isDeleted: false }).populate(
      "category",
    );
    res.render("admin/product/list", { products });
  },

  // Render add product form with categories
  async addForm(req, res) {
    const categories = await Category.find({ isDeleted: false });
    res.render("admin/product/add", { categories });
  },

  // Add new product
  async add(req, res) {
    try {
      const { name, category, description } = req.body;
      const image = req.file ? req.file.filename : "";

      // Validate
      const { error } = ProductSchemaValidation.validate({
        name,
        category,
        description,
        image,
      });
      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/admin/products/add");
      }

      const slug = slugify(name, { lower: true });
      await Product.create({ name, slug, category, description, image });
      req.flash("success", "Product added successfully");
      res.redirect("/admin/products");
    } catch (err) {
      req.flash("error", "Error adding product");
      res.redirect("/admin/products/add");
    }
  },

  // Render edit product form
  async editForm(req, res) {
    const product = await Product.findById(req.params.id).populate("category");
    const categories = await Category.find({ isDeleted: false });
    res.render("admin/product/edit", { product, categories });
  },

  // Edit product
  async edit(req, res) {
    try {
      const { name, category, description } = req.body;
      const image = req.file ? req.file.filename : req.body.existingImage;

      // Validate
      const { error } = ProductSchemaValidation.validate({
        name,
        category,
        description,
        image,
      });
      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/admin/products/edit/" + req.params.id);
      }

      const slug = slugify(name, { lower: true });
      const oldProduct = await Product.findById(req.params.id);
      await Product.findByIdAndUpdate(req.params.id, {
        name,
        slug,
        category,
        description,
        image,
      });

      // Delete old image if new one uploaded
      if (req.file && oldProduct.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../Uploads",
          oldProduct.image,
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      req.flash("success", "Product updated successfully");
      res.redirect("/admin/products");
    } catch (err) {
      req.flash("error", "Error updating product");
      res.redirect("/admin/products");
    }
  },

  // Soft delete product
  async delete(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });

      // Delete image file
      if (product.image) {
        const imagePath = path.join(__dirname, "../../Uploads", product.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      req.flash("success", "Product deleted successfully");
      res.redirect("/admin/products");
    } catch (err) {
      req.flash("error", "Error deleting product");
      res.redirect("/admin/products");
    }
  },
};

module.exports = ProductController;