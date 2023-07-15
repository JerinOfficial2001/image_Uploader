const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AuthData } = require("../models/product");

const JWT = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { Username, email, password, userType } = req.body;
  try {
    const oldUser = await AuthData.findOne({
      email,
    });
    if (oldUser) {
      return res.json({ error: "user exists!" });
    }
    if (Username !== "" && email !== "" && password !== "") {
      await AuthData.create({
        Username,
        email,
        password,
        userType,
      });
      console.log(req.body);
      res.send(req.body);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthData.findOne({
      email,
    });
    if (!user) {
      res.json({ error: "User not Exists" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT, { expiresIn: 10 });
      if (res.status(201)) {
        return res.json({ status: "ok", data: token });
      } else {
        return res.json({ status: error });
      }
    }
    res.json({ status: "error", error: "Invalid Password" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }
    const useremail = user.email;
    AuthData.findOne({ email: useremail }).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const allDatas = await AuthData.find({});

    res.json({ status: "ok", data: allDatas });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const allDatas = await AuthData.find({});
    const temp = [...allDatas];
    const prevValue = temp.find((i) => i._id === id);
    const newValue = req.body;
    const db = await AuthData.deleteOne(prevValue, newValue);
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const allDatas = await AuthData.find({});
    const temp = [...allDatas];
    const prevValue = temp.find((i) => i._id === id);
    const newValue = req.body;
    const db = await AuthData.updateOne(prevValue, newValue);
    res.json(req.body);
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
  }
});
module.exports = router;
