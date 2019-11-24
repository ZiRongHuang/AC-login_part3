const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
const { authenticated } = require("../config/auth");

router.get("/", authenticated, (req, res) => {
  const { keyword = "", sort = "asc" } = req.query;

  // 欄位排序 [name, category, location]
  // 如果是排序類別或地區，直接用遞增排序
  let sortObj = {};
  if (sort === "category" || sort === "location") sortObj[sort] = "asc";
  else sortObj["name"] = sort;

  Restaurant.find({ userId: req.user._id })
    .sort(sortObj)
    .exec((err, result) => {
      if (err) return console.error(err);
      else {
        const restaurants = result.filter(el =>
          el.name.toLowerCase().includes(keyword.toLowerCase())
        );
        return res.render("index", { restaurants, keyword, sort });
      }
    });
});

module.exports = router;
