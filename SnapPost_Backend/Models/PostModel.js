    const mongoose = require('mongoose');

  

    const postSchema = new mongoose.Schema({
        profile_url:String,
        username : String,
        image_url : String,
        postDescription : String,
        userId : {type : mongoose.Schema.Types.ObjectId,ref:'User'},
        date:{type: Date , default:Date.now},
        likes : [
              {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
        ],
    })

    module.exports = mongoose.model("Post",postSchema);