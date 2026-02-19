const Comment = require("../Models/CommentModel");
const Post = require("../Models/PostModel");
const UserModel = require("../Models/UserModel");
const { getParam } = require("../Utils/Token");

const addComment = async (req, res) => {
    try {
        const { token, text } = req.body;
        const { postId } = req.params;

        const user = await UserModel.findOne({
            username: getParam(token)
        });

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const comment = await Comment.create({
            postId,
            userId: user._id,
            username: user.username,
            profile_url: user.image_url,
            text
        });

        post.commentsCount += 1;
        await post.save();

        res.status(201).json({
            success: true,
            newComment: comment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId })
            .sort({ date: -1 });

        res.status(200).json(comments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteComment = async (req, res) => {
  try {
    const { token } = req.body;
    const { postId, commentId } = req.params;

    const user = await UserModel.findOne({
      username: getParam(token),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const comment = await Comment.findOne({
      _id: commentId,
      postId: postId,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your comment",
      });
    }
    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: -1 },
    });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {getComments , addComment , deleteComment}