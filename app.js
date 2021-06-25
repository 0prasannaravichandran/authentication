require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true,  useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended :true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']  });

const User = new mongoose.model("user",userSchema);

app.get("/", function(req,res) {
  res.render("home");
});

app.get("/login", function(req,res) {
  res.render("login");
});

app.get("/register", function(req,res) {
  res.render("register");
});

app.get("/secrets", function(req,res) {
  res.render("secrets");
});

// app.get("/json", function(req,res) {
//   User.find(function(err,foundArticles) {
//         if(!err) {
//         res.send(foundArticles);
//       } else {
//         console.log(err);
//       }
//       });
// });

app.post("/register", function(req,res) {
  const user = new User ({
   username: req.body.username,
   password: req.body.password
  });
  User.findOne({username: req.body.username,password: req.body.password}, function(err,foundUser) {
    if(foundUser) {
      res.redirect("/");
    } else {
    user.save(function(err) {
      if(err) {
        console.log("Error while inserting the record: " + err);
      } else {
        res.redirect("/");
      }
    });
  }
});
});

app.post("/login", function(req,res) {
  User.findOne({username: req.body.username,password: req.body.password}, function(err,foundUser) {
    if(foundUser) {
      res.redirect("secrets");
    } else {
          res.redirect("/");
      }
    });
});

app.listen(3000, function() {
  console.log("listening to port 3000");
});
