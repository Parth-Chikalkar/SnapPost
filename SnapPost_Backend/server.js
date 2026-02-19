const dotenv = require("dotenv");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const userRoute = require("./Routes/UserRoute")
const userModel = require("./Models/UserModel");
const postModel = require("./Models/PostModel");
const upload = require("./multer");
const cloudinary = require("./Cloudinary/Cloudinary");
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3500;
const postRoute = require("./Routes/PostRoute");
const commentRoute = require("./Routes/CommentRoute");
/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.use("/api/post", postRoute);
app.use("/api/user",userRoute);

app.use("/api/comments", commentRoute);


//   const token = req.cookies?.token;
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   try {
//     req.user = jwt.verify(token, process.env.JWT_KEY);
//     next();
//   } catch (err) {
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };

// const isAdmin = (req, res, next) => {
//   const { username, password } = req.user;
//   if (
//     username !== process.env.SYSTEM_ADMIN_USERNAME ||
//     password !== process.env.SYSTEM_ADMIN_PASSWORD
//   ) {
//     return res.status(403).json({ success: false, message: "Admin only" });
//   }
//   next();
// };

// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;

//   if (
//     username === process.env.SYSTEM_ADMIN_USERNAME &&
//     password === process.env.SYSTEM_ADMIN_PASSWORD
//   ) {
//     const token = jwt.sign({ username, password }, process.env.JWT_KEY);
//     res.cookie("token", token, { httpOnly: true });
//     return res.json({ success: true, role: "admin" });
//   }

//   const user = await userModel.findOne({ username });
//   if (!user) {
//     return res.status(401).json({ success: false, message: "Invalid credentials" });
//   }

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) {
//     return res.status(401).json({ success: false, message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { username: user.username, image_url: user.image_url },
//     process.env.JWT_KEY
//   );

//   res.cookie("token", token, { httpOnly: true });
//   res.json({ success: true, user });
// });

// app.post("/api/logout", (req, res) => {
//   res.clearCookie("token");
//   res.json({ success: true });
// });

// app.post("/api/signup", async (req, res) => {
//   const { name, username, email, phnNum, password } = req.body;

//   const exists = await userModel.findOne({ username });
//   if (exists) {
//     return res.status(400).json({ success: false, message: "User exists" });
//   }

//   const hashed = await bcrypt.hash(password, 10);

//   const user = await userModel.create({
//     name,
//     username,
//     email,
//     phnNum,
//     password: hashed,
//   });

//   const token = jwt.sign({ username }, process.env.JWT_KEY);
//   res.cookie("token", token, { httpOnly: true });

//   res.json({ success: true, user });
// });

// app.get("/api/profile", isLoggedIn, async (req, res) => {
//   const userData = await userModel.findOne({ username: req.user.username });
//   const postData = await postModel.find({ userId: userData._id });
//   res.json({ userData, postData });
// });


// app.post("/api/post", isLoggedIn, upload.single("image"), async (req, res) => {
//   let imageUrl = "";

//   if (req.file) {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     imageUrl = result.secure_url;
//     fs.unlinkSync(req.file.path);
//   }

//   const user = await userModel.findOne({ username: req.user.username });

//   const post = await postModel.create({
//     profile_url: user.image_url,
//     username: user.username,
//     image_url: imageUrl,
//     postDescription: req.body.description,
//     userId: user._id,
//   });

//   res.json({ success: true, post });
// });

// app.delete("/api/post/:id", isLoggedIn, async (req, res) => {
//   await postModel.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });


// app.get("/api/admin", isLoggedIn, isAdmin, async (req, res) => {
//   const users = await userModel.find();
//   const posts = await postModel.find();
//   res.json({ users, posts });
// });


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
