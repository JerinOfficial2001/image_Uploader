const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
exports.Product = Product;
