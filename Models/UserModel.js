const mongoose = require('mongoose');
const dotEnv = require('dotenv');

// Load environment variables from.env file 

dotEnv.config();

const MONGO_URI = process.env.MONGO_URI
// Connect to MongoDB
mongoose.connect(MONGO_URI).then(function(connection) {
    console.log("Connected to MongoDB");
});

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