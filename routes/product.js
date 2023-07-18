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
    res.send(500).send(error);
  }
});

router.put("/", async (req, res) => {
  try {
    const id = req.body;
    const allDatas = await Product.find({});
    const temp = [...allDatas];
    const prevValue = temp.find((i) => i._id === id);
    const newValue = req.body;
    const db = await UserData.updateOne(prevValue, newValue);
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const allDatas = await Product.find({});
    const temp = [...allDatas];
    const prevValue = temp.find((i) => i._id === id);
    const newValue = req.body;
    const db = await UserData.deleteOne(prevValue, newValue);
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
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
    const id = req.params._id;
    const allDatas = await UserData.find({});
    const temp = [...allDatas];
    const prevValue = temp.find((i) => i._id === id);
    const newValue = req.body;
    const db = await UserData.updateOne(prevValue, newValue);
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
  }
});
router.get("/userData", async (req, res) => {
  try {
    const products = await UserData.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
  }
});
router.delete("/userData/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const allDatas = await UserData.find({});
    const temp = [...allDatas];
    const prevValue = temp.find((i) => i._id === id);
    const newValue = req.body;
    const db = await UserData.deleteOne(prevValue, newValue);
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
  }
});

module.exports = router;
