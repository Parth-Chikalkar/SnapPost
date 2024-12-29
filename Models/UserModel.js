const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/userModell");

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