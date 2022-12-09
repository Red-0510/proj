
require("dotenv").config();
const express=require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt= require("mongoose-encryption");
const bcrypt=require("bcrypt");
const saltRounds=10;
// const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// const secret="thisisthesecretkey";

// app.use(session({
//     secret:secret,
//     resave:false,
//     saveUninitialized:false,
// }))

// app.use(passport.initialize());
// app.use(passport.session());

mongoose.set("strictQuery",1);
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

// user Schema
const userSchema =new mongoose.Schema({
    email:String,
    password:String,
});

// userSchema.plugin(passportLocalMongoose);

// console.log(process.env.SECRET,process.env.API_KEY);
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("user",userSchema);

// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});


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
                bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
                    const user=new User({
                        email:req.body.email,
                    password:hash
                    });
                    user.save();
                    res.render("secrets",{
                        message:{
                            body:"Succesfully created the account",
                            colour:"success",
                        }
                    });
                });
            }
        }
    });
});

app.post("/login",(req,res)=>{
    User.findOne({email:req.body.email},(err,data)=>{
        if(!err){
            if(data){
                bcrypt.compare(req.body.password,data.password,(err,same)=>{
                    if(same==true){
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
                                body:"Wrong Credentials",
                                colour:"danger",
                            }
                        });
                    }
                });
            }
            else{
                res.render("login",{
                    message:{
                        body:"Wrong Credentials",
                        colour:"danger",
                    }
                });
            }
        }
    });
});

app.listen(3000,()=>{
    console.log("Server started to listen at port 3000.");
});
