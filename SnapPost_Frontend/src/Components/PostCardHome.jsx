import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiSmile } from "react-icons/fi";
import { useTheme } from "../Context/ThemeContext";
import api from "../API/api";

function PostCardHome({ data }) {
  const { dark } = useTheme();

  const [userId, setUserId] = useState(null);
  const [likes, setLikes] = useState(data.likes || []);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.post("/user/profile", {
          token: localStorage.getItem("token"),
        });

        if (res.data.success) {
          setUserId(res.data.user._id);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUser();
  }, []);


  const isLiked =
    userId &&
    likes.some(
      (likeId) => likeId?.toString() === userId?.toString()
    );

  const handleLike = async () => {
    if (!userId) return;

    try {
      const res = await api.post("/post/like", {
        postId: data._id,
        userId: userId,
      });

      if (res.data.success) {
        setLikes(res.data.likesArray);
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/comments/${data._id}`, {
        token: localStorage.getItem("token"),
        text: commentText,
      });

      if (res.data.success) {
        setComments((prev) => [...prev, res.data.newComment]);
        setCommentText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`
        w-full rounded-2xl overflow-hidden transition-all duration-300
        ${dark
          ? "bg-zinc-900/50 border-zinc-800 text-zinc-100"
          : "bg-white border-zinc-100 text-zinc-900"}
        border shadow-sm hover:shadow-xl hover:-translate-y-1
      `}
    >
      
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={data.profile_url}
            className="w-9 h-9 rounded-full ring-2 ring-indigo-500/20"
            alt="avatar"
          />

          <Link to={`/profile/${data.username}`}>
          <h4 className="text-sm font-bold leading-none">
            {data.username}
          </h4>
          </Link>
        </div>
      </div>

   
      <Link
        to={`/postdetails/${data._id}`}
        className="block relative aspect-square overflow-hidden bg-zinc-200"
      >
        <img
          src={data.image_url}
          alt="post"
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-2xl">

           
            <button
              onClick={handleLike}
              className={`transition-all duration-200 ${
                isLiked
                  ? "text-red-500 scale-110"
                  : "hover:text-red-500"
              }`}
            >
              <FiHeart fill={isLiked ? "currentColor" : "none"} />
            </button>

            
            <button
              onClick={() => setShowCommentBox((prev) => !prev)}
              className="hover:text-indigo-500 transition-colors"
            >
              <FiMessageCircle />
            </button>

            <button className="hover:text-indigo-500 transition-colors">
              <FiSend />
            </button>
          </div>

          <button className="text-2xl hover:text-indigo-500 transition-colors">
            <FiBookmark />
          </button>
        </div>

  
        <p className="text-sm font-semibold mb-2">
          {likes.length} likes
        </p>

    
        <p className="text-sm leading-relaxed">
          <span className="font-bold mr-2">{data.username}</span>
          <span className={dark ? "text-zinc-400" : "text-zinc-600"}>
            {data.postDescription}
          </span>
        </p>

        {showCommentBox && (
          <div className="mt-4 space-y-3">

       
            {comments.map((comment) => (
              <div key={comment._id} className="text-sm">
                <span className="font-semibold mr-2">
                  {comment.username}
                </span>
                {comment.text}
              </div>
            ))}

          
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <FiSmile className="text-zinc-400" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                type="submit"
                className="text-sm font-bold text-indigo-500"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCardHome;
