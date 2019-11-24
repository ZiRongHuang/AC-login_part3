const mongoose = require("mongoose");
const User = require("../user");
const Restaurant = require("../restaurant");
const userList = require("../../public/apis/user.json");
const restaurantList = require("../../public/apis/restaurant.json");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost/restaurant", {
  useNewUrlParser: true,
  useCreateIndex: true
});

const db = mongoose.connection;

db.on("error", () => {
  console.log("Seeder: db error");
});

db.once("open", () => {
  console.log("Seeder: db connected!");

  userList.results.forEach(el => {
    let newUser = new User({
      name: el.name,
      email: el.email,
      password: el.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        let res = await newUser.save();
        let ownerFilter = restaurantList.results.filter(
          el => el.owner === res.name
        );

        ownerFilter.forEach(el => {
          Restaurant.create({
            name: el.name,
            name_en: el.name_en,
            category: el.category,
            image: el.image,
            location: el.location,
            phone: el.phone,
            google_map: el.google_map,
            rating: el.rating,
            description: el.description,
            userId: res._id
          });
        });
      });
    });
  });

  console.log("Seeder: done");
});
