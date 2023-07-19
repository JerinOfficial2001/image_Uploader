const express = require("express");
const { image } = require("../utils/cloudinary");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const { Product, UserData } = require("../models/product");

router.post("/", async (req, res) => {
  const {
    title,
    place,
    type,
    price,
    quantity,
    timing,
    address,
    description,
    reviews,
    feedback,
    rating,
    image,
  } = req.body;
  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "hotelImages",
      });
      if (uploadRes) {
        const product = new Product({
          title,
          place,
          type,
          price,
          quantity,
          timing,
          address,
          description,
          reviews,
          feedback,
          rating,
          image: uploadRes,
        });
        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const imgId = product.image.asset_id;
    await cloudinary.uploader.upload(imgId);
    const edit = await Product.findByIdAndUpdate(req.params.id);
    res.send({ status: "updated", data: req.body });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const imgId = product.image.asset_id;
    await cloudinary.uploader.destroy(imgId);
    const remove = await Product.findByIdAndDelete(req.params.id);
    res.send({ status: "deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/userData", async (req, res) => {
  const { address, city, zipcode, country, mobile } = req.body;
  try {
    const userData = new UserData({
      address,
      city,
      zipcode,
      country,
      mobile,
    });
    const savedUserData = await userData.save();
    res.status(200).send(savedUserData);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.put("/userData/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const allDatas = await UserData.find({});
    const temp = [...allDatas];
    const prevValue = temp.find((i) => i._id === id);
    const newValue = req.body;
    await UserData.updateOne(prevValue, newValue);
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.get("/userData", async (req, res) => {
  try {
    const products = await UserData.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.delete("/userData/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const allDatas = await UserData.find({});
    const temp = [...allDatas];
    const prevValue = temp.find((i) => i._id === id);
    await UserData.deleteOne(prevValue);
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
