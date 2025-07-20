const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const userModel = require("./Models/UserModel");
const postModel = require("./Models/PostModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const UserModel = require("./Models/UserModel");
const path = require("path");
const fs = require("fs");
const upload = require("./multer");
const cloudinary = require("./Cloudinary/Cloudinary.js");
const { log } = require("console");
app.use(cookieParser());
// app.set('views', path.join(__dirname, '../views'));
dotEnv.config({ path: "./src/.env" });
const PORT = process.env.PORT || 3500;
// app.use(express.static(path.join(__dirname, 'views')));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isLoggedin = (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect("/login");
  }
  next();
};
const adminUser = process.env.SYSTEM_ADMIN_USERNAME;
const adminPass = process.env.SYSTEM_ADMIN_PASSWORD;
const isLoggedinasAdmin = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect("/login");
  } else {
    const { username, password } = jwt.verify(
      req.cookies.token,
      "process.env.JWT_KEY"
    );

    if (username != adminUser || password != adminPass) {
      return res.redirect("/login");
    }
  }
  next();
};

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/log", async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });

  // Check For Admin
  if (adminUser == username && adminPass == password) {
    const token = jwt.sign({ username, password }, "process.env.JWT_KEY");
    res.cookie("token", token);
    return res.redirect("/admin");
  }
  if (!user) {
    return res.send("Invalid Username or Password");
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = jwt.sign(
        { username, image_url: user.image_url },
        "process.env.JWT_KEY"
      );
      res.cookie("token", token);
      return res.redirect("/");
    } else {
      return res.send("Invalid Username or Password");
    }
  });
});

app.get("/admin", isLoggedinasAdmin, async (req, res) => {
  const user = await userModel.find();
  const post = await postModel.find();
  res.render("admin.ejs", { user, post });
});

app.get("/profile", isLoggedin, async (req, res) => {
  const user = jwt.verify(req.cookies.token, "process.env.JWT_KEY");
  const userData = await userModel.findOne({ username: user.username });
  const postData = await postModel.find({ userId: userData._id });
  res.render("profile", { data: userData, data1: postData });
});
app.get("/sign_up", (req, res) => {
  res.render("sign_up");
});
app.post("/create", async (req, res) => {
  const { name, username, email, phnNum, password, image_url, descriptiom } =
    req.body;
  const ifExists = await userModel.findOne({ username });
  if (!ifExists) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      name,
      username,
      email,
      phnNum,
      password: hashed,
      description: descriptiom,
      image_url:
        image_url ||
        "https://up.yimg.com/ib/th?id=OIP.l3waMeOdc8D_y_odZx2IcwHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
    });
    const token = jwt.sign({ username, image_url }, "process.env.JWT_KEY");
    res.cookie("token", token);
    res.redirect("/");
  } else {
    res.send("UserName Already Exists , Pleasee try something else");
  }
});
app.get("/edit", async (req, res) => {
  const user = jwt.verify(req.cookies.token, "process.env.JWT_KEY");
  const editDt = await UserModel.findOne({ username: user.username });
  res.render("edit", { editDt });
});
app.post("/editt", isLoggedin, upload.single("image_url"), async (req, res) => {
  const user = jwt.verify(req.cookies.token, "process.env.JWT_KEY");

  const editDt = await UserModel.findOne({ username: user.username });
  let image_urlL = editDt.image_url;

  const { name, username, image_url, descriptiom } = req.body;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    image_urlL = result.secure_url;
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
  }

  // const uploadImg = cloudinary.uploader.upload(image_url);
  console.log(image_urlL);
  const edit = await UserModel.findOneAndUpdate(
    { username: user.username },
    {
      $set: {
        name,
        username,
        description: descriptiom,
        image_url:
          image_urlL ||
          "https://up.yimg.com/ib/th?id=OIP.l3waMeOdc8D_y_odZx2IcwHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
      },
    },
    { new: true }
  );
  const postupdate = await postModel.findOneAndUpdate(
    { userId: editDt._id },
    {
      $set: {
        profile_url:
          image_urlL ||
          "https://up.yimg.com/ib/th?id=OIP.l3waMeOdc8D_y_odZx2IcwHaHa&pid=Api&rs=1&c=1&qlt=95&w=113&h=113",
      },
    },
    { new: true }
  );

  res.redirect("/profile");
});
app.get("/", async (req, res) => {
  const cookie = req.cookies.token;
  let dataa = {};
  let postdata = [];
  if (!cookie) {
    return res.render("home", { dataa, postdata });
  } else {
    const user = jwt.verify(cookie, "process.env.JWT_KEY");
    dataa = await userModel.findOne({ username: user.username });
    const postData = await postModel.find();

    return res.render("home", { dataa, postdata: postData });
  }
});
app.get("/createPost", (req, res) => {
  res.render("createPost");
});
app.post("/createP", upload.single("image_url"), async (req, res) => {
  const user = jwt.verify(req.cookies.token, "process.env.JWT_KEY");
  const userName = await userModel.findOne({ username: user.username });
  const { descriptiom } = req.body;

  let uploadedImageUrl = "";

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    uploadedImageUrl = result.secure_url;

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }

  const post = await postModel.create({
    profile_url: userName.image_url,
    username: userName.username,
    image_url: uploadedImageUrl,
    postDescription: descriptiom,
    userId: userName._id,
  });
  res.redirect("/profile");
});
app.get("/deletePost/:id", async (req, res) => {
  const id = req.params.id;
  const post = await postModel.findByIdAndDelete({ _id: id });
  res.redirect("/profile");
});

app.get("/profile/:username", async (req, res) => {
  const username = req.params.username;
  const data = await userModel.findOne({ username });
  const data1 = await postModel.find({ userId: data._id });

  res.render("profileDetails", { data, data1 });
});

app.get("/postDetail/:id", async (req, res) => {
  const id = req.params.id;

  const data = await postModel.findById(id);
  const userData = jwt.verify(req.cookies.token, "process.env.JWT_KEY");
  res.render("postDetail", { data, userData });
});

app.get("/removeUser/:username", async (req, res) => {
  const { username } = req.params;

  const user = await userModel.findOne({ username });

  const deletedPost = await postModel.deleteMany({ userId: user._id });
  const deleted_user = await userModel.deleteOne({ _id: user._id });

  return res.redirect("/admin");
});
app.listen(PORT, function () {
  console.log("Server Is listening on port " + PORT);
});
