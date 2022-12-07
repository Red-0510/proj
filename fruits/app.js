const mongoose = require("mongoose");
mongoose.set("strictQuery",true);
mongoose.connect("mongodb://localhost:27017/fruitsDB",{
    useNewUrlParser:true, 
});

const fruitsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , "Name is a required field"],
    },
    rating:Number,
    reviews:[{authorName:String,review: String }]
});

const Fruit = mongoose.model("fruit",fruitsSchema);
const apple = new Fruit({
    rating:7,
    reviews:[
        {
            authorName:"JAinesh",
            review:"this is nice review!",
        },

        {
            authorName:"JAvsjkavnkah",
            review:"this is nice review!",
        }
    ]
});

const personSchema= new mongoose.Schema({
    name: String,
    age:Number
});

const Person = mongoose.model("people",personSchema);

const john = new Person({
    name: "john",
    age:20
});
// john.save(); 

// apple.save();



const orange = new Fruit({
    name:"orange",
    rating:8,
    review:"Pretty solid as a fruit"
});
const chiku = new Fruit({
    name:"chiku",
    rating:9,
    review:"Pretty solid as a fruit"
});
const melon = new Fruit({
    name:"melon",
    rating:8,
    review:"Pretty solid as a fruit"
});

// Fruit.insertMany([orange,chiku,melon],(err)=>{
//     if(err) console.log(err);
//     else console.log("Sucessfull added 3 fruits");
// })

Fruit.find((err,fruits)=>{
    if(err) console.log(err);
    else{
        // mongoose.connection.close()
        fruits.forEach(fruit=>{
            console.log(fruit.name, fruit.reviews);
        });
    }
});


Fruit.updateOne({_id:})
