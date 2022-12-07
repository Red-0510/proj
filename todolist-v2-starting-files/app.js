//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _= require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery",true);

mongoose.connect("mongodb://localhost:27017/todolistDB",{
  useNewUrlParser:true,
});

const itemSchema = {
  name:String,
};

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("list",listSchema);
const Item = mongoose.model("item",itemSchema);


app.get("/", function(req, res) {
  Item.find({},(err,items)=>{
    if(err) {
      res.send("Uh Oh! Error occured \n" + err);
    }
    else res.render("list", {listTitle: "Today", newListItems: items});
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;
  if(itemName.length>1){
    const item=Item({
      name:itemName
    });
    if(listName==="Today"){
      item.save();
      res.redirect("/");
    }
    else{
      List.findOne({name:listName},(err,doc)=>{
        doc.items.push(item);
        doc.save();
        res.redirect("/"+listName);
      })
    }
  }
  else res.redirect("/");
});

app.post("/delete",(req,res)=>{
  const item_id=req.body.check;
  const listName=req.body.list;
  if(listName==="Today"){
    Item.findByIdAndRemove(item_id,function(err,doc){
      if(!err){
        res.redirect("/");
      }
    });
  }
  else{
    List.findOneAndUpdate({name:listName},{
      $pull:{
        items:{ _id:item_id }
      }
    },(err,doc)=>{
      if(!err) res.redirect("/"+listName);
    });
  }
});

app.get("/:listName", (req,res)=>{
  const listName=_.capitalize(req.params.listName);
  List.findOne({name:listName},(err,doc)=>{
    if(doc!=null){
      res.render("list",{
        listTitle:listName,
        newListItems:doc.items
      });
    }
    else{
      const list= new List({
        name:listName,
        items:[]
      });
      list.save();
      res.render("list",{
        listTitle:listName,
        newListItems:list.items
      });
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
