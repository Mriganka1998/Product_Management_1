const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AdminAuthController {
  async AdminCheckAuth(req, res, next) {
    try {
      if (req.admin) {
        next();
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log(err);
    }
  }
  login(req, res) {
    res.render("admin/index");
  }
  async loginPost(req, res) {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        console.log("All input is required");
        return res.redirect("/admin/login");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (
        user &&
        user.is_admin === "admin" &&
        (await bcrypt.compare(password, user.password))
      ) {
        // Create token
        const token = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          process.env.JWT_SECRET_KEY || "secret",
          {
            expiresIn: "2h",
          },
        );
        if (token) {
          res.cookie("admintoken", token);
          return res.redirect("/admin/dashboard");
        } else {
          console.log("login failed");
        }
      }
      console.log("login failed");
      return res.redirect("/admin/login");
    } catch (error) {
      console.log(error);
    }
  }

  dashboard(req, res) {
    const Product = require("../models/productModel");
    const Category = require("../models/category");
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
  logout(req, res) {
    res.clearCookie("admintoken");
    return res.redirect("/admin/login");
  }
}

module.exports = new AdminAuthController();
