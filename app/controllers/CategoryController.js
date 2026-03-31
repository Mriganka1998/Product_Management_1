const Category = require("../models/category");
const slugify = require("slugify");

const CategoryController = {
  // List all categories (not deleted)
  async list(req, res) {
    const categories = await Category.find({ isDeleted: false });
    res.render("admin/category/list", { categories });
  },

  // Render add category form
  addForm(req, res) {
    res.render("admin/category/add");
  },

  // Add new category
  async add(req, res) {
    try {
      const { name } = req.body;
      const slug = slugify(name, { lower: true });
      await Category.create({ name, slug });
      req.flash("success", "Category added successfully");
      res.redirect("/admin/categories");
    } catch (err) {
      req.flash("error", "Error adding category");
      res.redirect("/admin/categories/add");
    }
  },

  // Render edit category form
  async editForm(req, res) {
    const category = await Category.findById(req.params.id);
    res.render("admin/category/edit", { category });
  },

  // Edit category
  async edit(req, res) {
    try {
      const { name } = req.body;
      const slug = slugify(name, { lower: true });
      await Category.findByIdAndUpdate(req.params.id, { name, slug });
      req.flash("success", "Category updated successfully");
      res.redirect("/admin/categories");
    } catch (err) {
      req.flash("error", "Error updating category");
      res.redirect("/admin/categories");
    }
  },

  // Soft delete category
  async delete(req, res) {
    try {
      await Category.findByIdAndUpdate(req.params.id, { isDeleted: true });
      req.flash("success", "Category deleted successfully");
      res.redirect("/admin/categories");
    } catch (err) {
      req.flash("error", "Error deleting category");
      res.redirect("/admin/categories");
    }
  },
};

module.exports = CategoryController;
