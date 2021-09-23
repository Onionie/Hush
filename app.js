//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
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

const secret = "Averylongstringthatisasecret"
userShema.plugin(encrypt, { secret: secret});

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
  const newUser = new User({
    email: req.body.username,
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

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password = password){
          res.render("secrets");
        }
      }
    }
  });

});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
