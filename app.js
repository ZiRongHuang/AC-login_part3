const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");

const app = express();
const port = 3000;

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// 設定 express handlebars & helper
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      select: (selected, option) => {
        return selected == option ? 'selected="selected"' : "";
      }
    }
  })
);
app.set("view engine", "handlebars");

app.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash()); // 設定 connect flash

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

app.use(bodyParser.urlencoded({ extended: true })); // 設定 body parser
app.use(methodOverride("_method")); // 設定 method override
app.use(express.static("public")); // 設定 public 資料夾

// 設定 routes
app.use("/", require("./routes/home.js"));
app.use("/restaurants", require("./routes/restaurant"));
app.use("/search", require("./routes/search"));
app.use("/users", require("./routes/user"));
app.use("/auth", require("./routes/auths"));

// 設定 資料庫連結
mongoose.connect("mongodb://localhost/restaurant", {
  useNewUrlParser: true,
  useCreateIndex: true
});
const db = mongoose.connection;

// db 偵聽
db.on("error", () => {
  console.log("app.js: mongodb error!");
});

db.once("open", () => {
  console.log("app.js: mongodb connected!");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
