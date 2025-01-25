const express = require('express');
const app = express();
const dotEnv = require('dotenv')
const userModel = require("./Models/UserModel")
const postModel = require("./Models/PostModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UserModel = require('./Models/UserModel');
app.use(cookieParser());

dotEnv.config()
const PORT = process.env.PORT || 3000;

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const isLoggedin = (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect("/login");
    }
    next();
};



app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
})

app.get("/login",(req,res)=>{
    res.render("login");
})
app.post("/log",async (req,res)=>{
    const {username,password} = req.body;
    const user = await userModel.findOne({username});
    if(!user){
        return res.send("Invalid Username or Password");
    }

    bcrypt.compare(password,user.password,(err,result)=>{
      if(result){
        
        const token = jwt.sign({username,image_url:user.image_url},"SecretOfParth?");
        res.cookie("token",token);
        res.redirect("/");
      }
      else{
        return res.send("Invalid Username or Password");
      }
    })

})

app.get("/profile",isLoggedin,async (req,res)=>{
    
    const user = jwt.verify(req.cookies.token,"SecretOfParth?");
    const userData = await userModel.findOne({username:user.username});
   
    const postData = await postModel.find({userId:userData._id});
   
    res.render("profile",{data:userData,data1 :postData});
})
app.get("/sign_up",(req,res)=>{
    res.render("sign_up");
})
app.post("/create",async (req,res)=>{
    const {name,username,email,phnNum,password,image_url,descriptiom} = req.body;
    const ifExists = await userModel.findOne({username});
    if(!ifExists){
        const salt = await bcrypt.genSalt(10); 
        const hashed = await bcrypt.hash(password,salt);
        const user = await userModel.create({
            name,
            username,
            email,
            phnNum,
            password : hashed,
            description : descriptiom,
            image_url : image_url || "https://up.yimg.com/ib/th?id=OIP.l3waMeOdc8D_y_odZx2IcwHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
           });
    const token = jwt.sign({username,image_url},"SecretOfParth?");
    res.cookie("token",token);
    res.redirect("/");
    
    
    }
    else{
        res.send("UserName Already Exists , Pleasee try something else");
    }
})
app.get("/edit",async (req, res)=>{
    const user = jwt.verify(req.cookies.token,"SecretOfParth?");
    const editDt = await UserModel.findOne({username:user.username});
    res.render("edit",{editDt});
})
 app.post("/editt",isLoggedin, async (req, res)=>{
    const user = jwt.verify(req.cookies.token,"SecretOfParth?");
    const editDt = await UserModel.findOne({username:user.username});
   
    const {name,username,image_url,descriptiom} = req.body;
    const edit = await UserModel.findOneAndUpdate({username:user.username},{$set :{name, username, description : descriptiom, image_url:image_url || "https://up.yimg.com/ib/th?id=OIP.l3waMeOdc8D_y_odZx2IcwHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113" }},{new :true,});
    const postupdate = await postModel.findOneAndUpdate({userId:editDt._id},{$set : {profile_url:image_url || "https://up.yimg.com/ib/th?id=OIP.l3waMeOdc8D_y_odZx2IcwHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113"}},{new:true});
   
    res.redirect("/profile")
 })
app.get("/", async (req, res) => {
    
        
    const cookie = req.cookies.token;
    let dataa ={};
    let postdata =[];
    if (!cookie) {
        return res.render("home",{dataa,postdata});
    } else {
        const user = jwt.verify(cookie, "SecretOfParth?");
        dataa = await userModel.findOne({ username: user.username });      
        const postData = await postModel.find();
      
        
        return res.render("home", { dataa , postdata:postData });
    }
 
});
app.get("/createPost",(req,res)=>{
    res.render("createPost");
})
app.post("/createP", async (req,res)=>{
    const user = jwt.verify(req.cookies.token, "SecretOfParth?");
    const userName = await userModel.findOne({ username: user.username });
    const {image_url, descriptiom} = req.body;
    const post = await postModel.create({
        profile_url:userName.image_url,
        username:userName.username,
        image_url,
        postDescription : descriptiom,
        userId : userName._id,
    });
    res.redirect("/profile");
})
 app.get("/deletePost/:id", async (req , res)=>{
    const id = req.params.id;
    const post = await postModel.findByIdAndDelete({_id:id});
    res.redirect("/profile");
 })

 app.get("/profile/:username",async (req,res)=>{
    const username = req.params.username;
    const data = await userModel.findOne({ username });
    const data1 = await postModel.find({userId :data._id});
   
    
    res.render("profileDetails",{data,data1});
 })
//  app.get("/like/:postid", async (req,res)=>{
//      const pid = req.params.postid;
//      const tok = req.cookies.token
     
//       const username =  jwt.verify(tok,"SecretOfParth?");
     
//       const user = await userModel.findOne({username:username.username});
//       const alreadyLiked = await postModel.findOne({
//         _id: pid,
//         "likes._id": user._id,
//       });
//       if(alreadyLiked) {
//         const updatedPost = await postModel.findByIdAndUpdate(
//             pid,
//             { $pull: { likes: { _id: user._id } } },
//             { new: true }
//           );
//           return res.redirect("/");
//       }
    
//      const li = await postModel.findByIdAndUpdate(pid,{
//         $push: { likes: { _id: user._id } } } , 
//         { new: true }
//     );
    
//     res.redirect("/");
     

//  })
app.get("/postDetail/:id",async (req, res) => {
    const id = req.params.id;
    
    const data = await postModel.findById(id);
    const userData = jwt.verify(req.cookies.token,"SecretOfParth?");
    res.render("postDetail",{data,userData});
})
app.listen(PORT, function(){console.log("Server Is listening on port "+ PORT);}); 
