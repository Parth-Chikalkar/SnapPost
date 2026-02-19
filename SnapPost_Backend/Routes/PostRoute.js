const express = require("express");
const router = express.Router();
const upload = require("../multer");

const {
  createPost,
  getAllPosts,
  deletePost,
  getPostDetail,
  likePost,
  editPostCaption,
} = require("../Controllers/PostController");

router.post("/create", upload.single("image"), createPost);
router.get("/all", getAllPosts);

router.post("/like", likePost);     

router.get("/:id", getPostDetail); 
router.delete("/:id", deletePost);
router.put("/update/:postId", editPostCaption);


module.exports = router;
