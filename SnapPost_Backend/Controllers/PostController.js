const postModel = require("../Models/PostModel");
const userModel = require("../Models/UserModel");
const commentModel = require("../Models/CommentModel");
const upload = require("../multer");
const cloudinary = require("../Cloudinary/Cloudinary");
const fs = require("fs");
const CommentModel = require("../Models/CommentModel");
const { getParam } = require("../Utils/Token");

const createPost = async (req, res) => {
  try {
    const { token, caption } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    
    const username = getParam(token);

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    } else {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const post = await postModel.create({
      profile_url: user.image_url,
      username: user.username,
      image_url: imageUrl,
      postDescription: caption,
      userId: user._id,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};


const deletePost = async (req, res) => {
  try {
    await postModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};

const getPostDetail =  async (req,res)=>{
 
   try {
    const {id} = req.params;
    const postData = await postModel.findById(id);
    const comments = await CommentModel.find({postId : id});
    return res.json({success : true , postData , comments});
    
   } catch (error) {
    console.log(error.message);
    
   }
}

const likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing postId or userId",
      });
    }

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      success: true,
      likesArray: post.likes,
      likesCount: post.likes.length,
    });

  } catch (error) {
    console.log("LIKE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const editPostCaption = async (req, res) => {
  try {
    const { token, caption } = req.body;
    const { postId } = req.params;

    if (!caption?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Caption cannot be empty",
      });
    }

  
    const username = getParam(token);

    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts",
      });
    }
    post.postDescription = caption;
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      updatedPost: post,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






module.exports = {
  createPost,
  editPostCaption,
  getAllPosts,
  deletePost,
  getPostDetail,
  likePost
};
