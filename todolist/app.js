const express=require("express");
const bodyParser=require("body-parser");

const app=express();
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));
items=["code!","code!","code!"];
app.get("/", function(req,res){
    let today=new Date();
    // let days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    let day=today.toLocaleDateString("en-US",options);
    res.render("list",{
        day:day,
        todoitems:items,
    });
});

app.post("/",function(req,res){
    let item=req.body.item;
    items.push(item);
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server is listening at port 3000.");
});