//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const port = 3000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//connect to mongodb using mongoose
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

//create new Schema
const userShema = new mongoose.Schema({
  email: String,
  password: String
});

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

//////////// POST methods ///////////////

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    const newUser = new User({
      email: req.body.username,
      password: hash
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

});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  //Find one email that is the same as the user name input by the user
  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }
    //Then if user is found check for matching password
    else{
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result === true){
            res.render("secrets");
          }
        });
      }
    }
  });

});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
