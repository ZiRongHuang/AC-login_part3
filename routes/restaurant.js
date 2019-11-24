const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
const { checkRequired, checkImageUrl } = require("../utils/check");
const { authenticated } = require("../config/auth");

// 查詢_全部 restaurant
router.get("/", authenticated, (req, res) => {
  return res.redirect("/");
});

// 新增_頁面 restaurant (順序必須在這)
router.get("/new", authenticated, (req, res) => {
  return res.render("new");
});

// 查詢_單筆 restaurant 詳細內容
router.get("/:id", authenticated, (req, res) => {
  Restaurant.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, restaurant) => {
      if (err) return console.error(err);
      return res.render("show", { restaurant });
    }
  );
});

// 新增_單筆 restaurant
router.post("/", authenticated, (req, res) => {
  let isValidated = checkRequired(req.body);
  let data = {
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: checkImageUrl(req.body.image)
      ? req.body.image
      : "http://" + req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description,
    userId: req.user._id
  };
  if (!isValidated) return res.render("new", { isError: true, data });
  const restaurant = new Restaurant(data);
  restaurant.save(err => {
    if (err) return console.error(err);
    return res.redirect("/");
  });
});

// 修改_頁面 restaurant
router.get("/:id/edit", authenticated, (req, res) => {
  Restaurant.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, data) => {
      if (err) return console.error(err);
      return res.render("edit", { data });
    }
  );
});

// 修改_單筆 restaurant
router.put("/:id/edit", authenticated, (req, res) => {
  let isValidated = checkRequired(req.body);
  let data = {
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: checkImageUrl(req.body.image)
      ? req.body.image
      : "http://" + req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  };
  if (!isValidated) {
    return res.render("edit", {
      isError: true,
      data: Object.assign({}, data, { id: req.params.id })
    });
  }

  Restaurant.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, restaurant) => {
      if (err) return console.error(err);
      restaurant.name = req.body.name;
      restaurant.name_en = req.body.name_en;
      restaurant.category = req.body.category;
      restaurant.image = checkImageUrl(req.body.image)
        ? req.body.image
        : "http://" + req.body.image;
      restaurant.location = req.body.location;
      restaurant.phone = req.body.phone;
      restaurant.google_map = req.body.google_map;
      restaurant.rating = req.body.rating;
      restaurant.description = req.body.description;
      restaurant.save(err => {
        if (err) return console.error(err);
        return res.redirect(`/restaurants/${req.params.id}`);
      });
    }
  );
});

// 刪除_單筆 restaurant
router.delete("/:id/delete", authenticated, (req, res) => {
  Restaurant.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, restaurant) => {
      if (err) return console.error(err);
      restaurant.remove(err => {
        if (err) return console.error(err);
        return res.redirect("/");
      });
    }
  );
});

module.exports = router;
