//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const port = 3000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//connect to mongodb using mongoose
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

//create new Schema
const userShema = {
  email: String,
  password: String
};

const User = new mongoose.model("User", userShema);

app.get("/", function (req, res){
  res.render("home")
});

app.get("/login", function (req, res){
  res.render("login")
});

app.get("/register", function (req, res){
  res.render("register")
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets")
    }
  });
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
