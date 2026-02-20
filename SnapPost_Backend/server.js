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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Change as per use 
app.use(
  cors({
    origin: "https://snap-post-sigma.vercel.app",
    credentials: true,
  })
);

app.use("/api/post", postRoute);
app.use("/api/user",userRoute);

app.use("/api/comments", commentRoute);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
