const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Node.js Simple CRUD with Express.js and MySQL Tutorial",
  });
});

module.exports = router;
