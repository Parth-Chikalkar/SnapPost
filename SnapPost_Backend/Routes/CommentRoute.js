const express = require("express");
const { addComment, getComments, deleteComment } = require("../Controllers/CommentController");
const router = express.Router();


router.post("/:postId", addComment);
router.get("/:postId", getComments);
router.delete("/:postId/:commentId", deleteComment);
module.exports = router;