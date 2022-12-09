const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));


mongoose.set("strictQuery", 1);
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true })

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("Article", articleSchema);

// All routes to /articles

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, data) => {
            if (!err) {
                res.send(data);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const article = Article({
            title: req.body.title,
            content: req.body.content,
        });
        article.save((err) => {
            if (!err) res.send("successfully added the data to DB");
            else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) res.send("Deleted Succesfully");
            else {
                console.log(err);
                res.send(err);
            }
        });
    });


// All routes to /articles/:title
app.route("/articles/:title")
    .get((req,res)=>{
        const articleTitle=req.params.title;
        Article.findOne({title:articleTitle},(err,data)=>{
            if(data) res.send(data);
            else res.send("No found documents were found!");
        });
    })
    .put((req,res)=>{
        Article.replaceOne(
            {title:req.params.title},
            {
                content:req.body.content,
            },
            (err)=>{
                if(!err) res.send("Succesfully Updated");
                else res.send(err);
            });
    })
    .patch((req,res)=>{
        Article.updateOne({title:req.params.title},{$set:req.body},(err)=>{
            if(!err) res.send("Succesfully patched the post");
            else res.send(err);
        });
    })
    .delete((req,res)=>{
        Article.deleteOne({title:req.params.title},
            (err)=>{
                if(!err) res.send("deleted the article");
                else res.send(err);
            });
    });

app.listen(3000, () => {
    console.log("Server started to listen at port 3000");
});
