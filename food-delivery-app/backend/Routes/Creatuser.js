const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwtSecret = "thisisajwtsecret"; // You may want to move this to an environment variable

// ROUTE: Create user
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name", "Name must be at least 5 characters").isLength({ min: 5 }),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        location: req.body.location,
      });

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ROUTE: Login user
router.post(
  "/loginuser",
  [
    body("email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ error: "Try to login with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, userData.password);
      console.log("Password match:", pwdCompare);
      if (!pwdCompare) {
        return res.status(400).json({ error: "Try to login with correct credentials" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);

      res.json({ success: true, authToken }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

module.exports = router;
