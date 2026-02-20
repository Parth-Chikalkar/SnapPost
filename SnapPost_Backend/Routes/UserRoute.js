const express = require('express');
const upload = require("../multer");
const {signup, login, getProfile, updateProfile, getUser, updateUserProfile , searchUsers, adminData , deleteAcc} = require('../Controllers/UserController');
const { isAdmin } = require('../Middleware/AuthMiddleware');


const router = express.Router();
router.put("/update", upload.single("image"), updateUserProfile);
router.get("/profile/:username",getUser);
router.get("/search",searchUsers);
router.get("/admin/:token",isAdmin,adminData);
router.delete("/deleteacc/:id", deleteAcc);
router.post("/signup", signup);
router.post("/login", login);
router.post("/profile", getProfile);



module.exports=router;