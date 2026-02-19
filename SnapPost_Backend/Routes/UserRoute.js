const express = require('express');
const upload = require("../multer");
const {signup, login, getProfile, updateProfile, getUser, updateUserProfile , searchUsers} = require('../Controllers/UserController');


const router = express.Router();
router.put("/update", upload.single("image"), updateUserProfile);
router.get("/profile/:username",getUser);
router.get("/search",searchUsers);
router.post("/signup", signup);
router.post("/login", login);
router.post("/profile", getProfile);



module.exports=router;