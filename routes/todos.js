const express = require("express");
const router = express.Router();
const connection = require("../lib/db");

// Get /
router.get("/", function (req, res, next) {
  let sqlSelect = `SELECT * FROM todos ORDER BY id desc;`;
  connection.query(sqlSelect, function (err, result) {
    if (err) {
      req.flash("error", err);
      res.render("todos", { data: "" });
    } else {
      res.render("todos", { data: result });
    }
  });
});

// GET Create
router.get("/create", function (req, res, next) {
  // render to create.ejs
  res.render("todos/create", {
    name: "",
    content: "",
  });
});

// POST Create
router.post("/create", function (req, res, next) {
  let name = req.body.name;
  let content = req.body.content;
  let errors = false;

  if (name.length === 0 || content.length === 0) {
    errors = true;

    req.flash("error", "Please enter name and content");
    res.render("todos/create", {
      name: name,
      content: content,
    });
  }

  if (!errors) {
    let form_data = {
      name: name,
      content: content,
    };
    let sqlCreate = `INSERT INTO todos SET ?;`;

    connection.query(sqlCreate, form_data, function (err, result) {
      if (err) {
        req.flash("error", err);

        res.render("todos/create", {
          name: form_data.name,
          content: form_data.content,
        });
      } else {
        req.flash("success", "createed");
        res.redirect("/todos");
      }
    });
  }
});

// GET Update
router.get("/update/(:id)", function (req, res, next) {
  let id = req.params.id;
  let sqlSelect = `SELECT * FROM todos WHERE id = ${id};`;

  connection.query(sqlSelect, function (err, rows, fields) {
    if (err) throw err;

    if (rows.length <= 0) {
      req.flash("error", "id = " + id);
      res.redirect("/todos");
    } else {
      res.render("todos/update", {
        title: "Todo Update",
        id: rows[0].id,
        name: rows[0].name,
        content: rows[0].content,
      });
    }
  });
});

// POST Update
router.post("/update/:id", function (req, res, next) {
  let id = req.params.id;
  let name = req.body.name;
  let content = req.body.content;
  let errors = false;

  if (name.length === 0 || content.length === 0) {
    errors = true;

    req.flash("error", "Please enter  and content");
    res.render("todos/update", {
      id: id,
      name: name,
      content: content,
    });
  }

  if (!errors) {
    let form_data = {
      name: name,
      content: content,
    };
    let sqlUpdate = `UPDATE todos SET ? WHERE id = ${id}`;

    connection.query(sqlUpdate, form_data, function (err, result) {
      if (err) {
        req.flash("error", err);
        res.render("todos/update", {
          id: req.params.id,
          name: form_data.name,
          content: form_data.content,
        });
      } else {
        req.flash("success", "updated");
        res.redirect("/todos");
      }
    });
  }
});

// GET Delete
router.get("/delete/(:id)", function (req, res, next) {
  let id = req.params.id;
  let sqlDelete = `DELETE FROM todos WHERE id = ${id}`;

  connection.query(sqlDelete, function (err, result) {
    if (err) {
      req.flash("error", err);
      res.redirect("/todos");
    } else {
      req.flash("success", "ID = " + id);
      res.redirect("/todos");
    }
  });
});

module.exports = router;
