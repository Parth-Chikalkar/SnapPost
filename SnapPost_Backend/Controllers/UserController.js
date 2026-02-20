const check = async (req,res)=>{
    res.send("Hello From Server");
}
const cloudinary = require("../Cloudinary/Cloudinary"); 
const userModel = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const {genToken, getParam} = require('../Utils/Token');
const postModel = require("../Models/PostModel");
const commentModel = require("../Models/CommentModel");
const fs = require('fs');
const login = async (req,res)=>{
   try {
     const {username , password} = req.body;
     
       if (
    username === process.env.SYSTEM_ADMIN_USERNAME &&
    password === process.env.SYSTEM_ADMIN_PASSWORD
  ) {
    const token = genToken({username});
    
    return res.json({ success: true, role: "admin" , token});
  }

 
     const user = await userModel.findOne({username});
     if(!user || user == undefined) return res.json({message :"Invalid Credentials", success : false});
     const check =  await bcrypt.compare(password,user.password);
     if(!check) return res.json({message :"Invalid Credentials", success : false});
    const token =  genToken({username});
    
     return res.json({message : "Welcome Back !" , success : true , role : "user",token,user});


   } catch (error) {
     console.log(error.message);
     res.json({message : "Internal Server Error", success : false });
   }

}

    const signup = async(req,res)=>{
        try {
            const { name, username, email, phnNum, password } = req.body;
            

            const exists = await userModel.findOne({ username });
            if (exists) {
                return res.status(400).json({ success: false, message: "User already exists" });
            }

            const hashed = await bcrypt.hash(password, 10);
            const img = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
            const user = await userModel.create({
                name,
                username,
                email,
                phnNum,
                password: hashed,
                image_url : img,
                description : "Hello 👋 , Im using Snappost",
                
            });

            const token = genToken({username});
            res.json({success : true , message : "Signed Up Sucessfully" , token , user});

            
            
        } catch (error) {
                console.log(error.message);
               res.json({message : "Internal Server Error", success : false});
        }
    }



const getProfile = async (req, res) => {
  try { 
    
    const {token} = req.body;
    const username = getParam(token);
  
    
    const user = await userModel
      .findOne({username})
      .select("-password");

    const posts = await postModel.find({
      userId: user._id,
    });

    return res.status(200).json({
      success: true,
      user,
      posts,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
    });
  }
};


const getUser = async (req,res)=>{
try { 
    
    const {username} = req.params;  
    
    const user = await userModel
      .findOne({username})
      .select("-password");

    const posts = await postModel.find({
      userId: user._id,
    });

    return res.status(200).json({
      success: true,
      user,
      posts,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,message : "No User Found"
    });
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const { token, name, username, bio } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const currentUsername = getParam(token);

    const user = await userModel.findOne({ username: currentUsername });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    
    if (username && username !== user.username) {
      const exists = await userModel.findOne({ username });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

   
    user.name = name || user.name;
    user.username = username || user.username;
    user.description = bio || user.description;

    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      user.image_url = result.secure_url;

      fs.unlinkSync(req.file.path); 
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const searchUsers = async (req,res)=>{
 try {
  const {query} = req.query;
  if(!query) return req.json({success : true , result : []});
  const users = await userModel.find({username : {$regex :query , $options :"i"}}).select("_id username image_url").limit(5);

  return res.json({success : true , result : users});
 } catch (error) {
  return res.json({success : false , message : error.message});
 }
}

const adminData= async(req,res)=>{
  try {
    const user= await userModel.find().select("-password");
    return res.json({success : true , user});
  } catch (error) {
    return res.json({success: false});
    
  }
}

const deleteAcc = async (req, res) => {
  try {
    const { id } = req.params;

  
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

  const userPosts = await postModel.find({ userId: id });
    const postIds = userPosts.map(post => post._id);

    
    await commentModel.deleteMany({ postId: { $in: postIds } });

   
    await commentModel.deleteMany({ userId: id });

    await postModel.deleteMany({ userId: id });


    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `${user.username} deleted successfully`
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
    

module.exports = { login ,signup ,getProfile , getUser ,updateUserProfile , searchUsers , adminData, deleteAcc};





