const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://parthchikalkar56:55UFvgCv0XwMtWGP@cluster0.9xkdo.mongodb.net/");

const userSchema = new mongoose.Schema({
    name:String,
    username:String,
    phNum:String,
    email:String,
    password : String,
    description :  { type: String, default: ""},
    image_url : String, 
    likes :Array,
    posts :Array,



})

module.exports = mongoose.model('User', userSchema);