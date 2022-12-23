const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//One filed is given
router.put("updateOneField/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      updatedTime: Date.now(),
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be updated!");

  res.send(user);
});

//Update many field

router.put("updateManyfield/:id/:isAdmin", async (req, res) => {
  if (req.params.isAdmin == "true") {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        department: req.body.department,
        updatedTime: Date.now(),
      },
      { new: true }
    );

    if (!user) return res.status(400).send("the user cannot be updated!");

    res.send(user);
  } else {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        department: req.body.department,
        updatedTime: Date.now(),
      },
      { new: true }
    );

    if (!user) return res.status(400).send("the user cannot be updated!");

    res.send(user);
  }
});

router.get("/views/:isAdmin", async (req, res) => {
  try {
    if (req.params.isAdmin == true) {
      const user = await User.find({ isAdmin: "true" }).select("-passwordHash");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }

      res.status(200).send(user);
    } else {
      const user = await User.find({ isAdmin: "false" }).select(
        "-passwordHash"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }

      res.status(200).send(user);
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "error",
      error: err,
    });
  }
});

router.get("/views/:fieldname/:isAdmin", async (req, res) => {
  const fieldname = req.params.fieldname;
  try {
    if (req.params.isAdmin == "true") {
      const user = await User.find({ isAdmin: "true" }).select(fieldname);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }

      res.status(200).send(user);
    } else {
      const user = await User.find({ isAdmin: "false" }).select(fieldname);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }

      res.status(200).send(user);
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "error",
      error: err,
    });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  console.log(user);
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    return res.status(200).send({ user: user.email, token: token });
  } else {
    return res.status(400).send("password is wrong!");
  }
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    console.log(password.length);
    if (
      password == req.body.currentpassword &&
      password.length > 6 &&
      password.length < 12
    ) {
      let user = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
        department: req.body.department,
      });
      user = await user.save();

      if (!user) return res.status(400).send("the user cannot be created!");

      res.send(user);
    } else {
      return res.status(400).send("the user cannot be created!");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/add", async (req, res) => {
  try {
    if (req.body.isAdmin == "true") {
      const password = req.body.password;
      console.log(password.length);
      if (
        password == req.body.currentpassword &&
        password.length > 6 &&
        password.length < 12
      ) {
        let user = new User({
          firstName: req.body.firstName,
          middleName: req.body.middleName,
          lastName: req.body.lastName,
          email: req.body.email,
          passwordHash: bcrypt.hashSync(req.body.password, 10),
          isAdmin: "true",
          department: req.body.department,
        });
        user = await user.save();

        if (!user) return res.status(400).send("the user cannot be created!");

        res.send(user);
      } else {
        return res.status(400).send("the user cannot be created!");
      }
    } else {
      const password = req.body.password;
      console.log(password.length);
      if (
        password == req.body.currentpassword &&
        password.length > 6 &&
        password.length < 12
      ) {
        let user = new User({
          firstName: req.body.firstName,
          middleName: req.body.middleName,
          lastName: req.body.lastName,
          email: req.body.email,
          passwordHash: bcrypt.hashSync(req.body.password, 10),
          isAdmin: "false",
          department: req.body.department,
        });
        user = await user.save();

        if (!user) return res.status(400).send("the user cannot be created!");

        res.send(user);
      } else {
        return res.status(400).send("the user cannot be created!");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
