
require("dotenv").config();
const express=require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var findOrCreate = require('mongoose-findorcreate')
// const encrypt= require("mongoose-encryption");
// const bcrypt=require("bcrypt");
// const saltRounds=10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
 
//google Oauth Part
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const secret="thisisthesecretkey";

app.use(session({
    secret:secret,
    resave:false,
    saveUninitialized:false,
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("strictQuery",1);
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

// user Schema
const userSchema =new mongoose.Schema({
    email:String,
    password:String,
    googleId:String,
});

userSchema.plugin(passportLocalMongoose,{usernameField:"email"});
userSchema.plugin(findOrCreate);

// console.log(process.env.SECRET,process.env.API_KEY);
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("user",userSchema);

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        email: user.email,
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id , email:profile.displayName}, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets",{
            message:{
                body:"Succesfully logged In",
                colour:"success",
            }
        });
    }
    else{
        res.render("login",{
            message:{
                body:"Session Expired Login Again!",
                colour:"warning",
            }
        });
    }
});

app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(!err){
            res.redirect("/");
        }
    });
});

app.get("/auth/google",
    passport.authenticate("google",{scope:["profile"]})
);

app.get("/auth/google/secrets",
    passport.authenticate("google",{failureRedirect:"/login"}),
    (req,res)=>{
        res.redirect("/secrets");
    }
);


// posts routes

app.post("/register",(req,res)=>{
    User.findOne({email:req.body.email},(err,data)=>{
        if(!err){
            if(data) res.render("login",{
                message:{
                    body:"Account already registered please Log in",
                    colour:"warning",
                }
            });
            else{
                User.register({email:req.body.email},req.body.password,(err,user)=>{
                    if(err){
                        console.log(err);
                        res.redirect("/register");
                    }
                    else{
                        passport.authenticate("local")(req,res,()=>{
                            res.redirect("/secrets");
                        });
                    }
                });
            }
        }
    });
});

app.post("/login",(req,res)=>{
    passport.authenticate("local",(err,user,info)=>{
        if(err){
            console.log(err);
        }
        else if(!user){
            res.render("login",{
                message:{
                    body:"Wrong Credentials",
                    colour:"danger",
                }
            });
        }
        else{
            req.login(user,(err)=>{
                if(err) console.log(err);
                else{
                    res.redirect("/secrets");
                }
            });
        }
    })(req,res);
});

app.listen(3000,()=>{
    console.log("Server started to listen at port 3000.");
});
