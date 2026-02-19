import React, { useEffect, useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
 
   FiTrash2
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import api from "../API/api";
import Loader from "../Components/Loader";

function PostDetail() {
  const { dark } = useTheme();
  const { id } = useParams();

  const [comments, setComments] = useState([1, 2]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState(null);
  const [likes, setLikes] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/post/${id}`);
      if (res.data.success) {
        setPost(res.data.postData);
        setComments(res.data.comments);
        setLikes(res.data.postData.likes || []);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

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

  const [addComm, setaddCom] = useState();
  const addCommentHandler = async (e) => {
    e.preventDefault();

    if (!addComm?.trim()) return;

    try {
      const res = await api.post(`/comments/${post._id}`, {
        token: localStorage.getItem("token"),
        text: addComm,
      });

      if (res.data.success) {
        setComments((prev) => [...prev, res.data.newComment]);
        setaddCom("");
      }
    } catch (err) {
      console.log(err);
    }
  };


const deleteCommentHandler = async (commentId) => {
  try {
    await api.delete(`/comments/${post._id}/${commentId}`, {
      data: {
        token: localStorage.getItem("token"),
      },
    });

    setComments((prev) =>
      prev.filter((comment) => comment._id !== commentId)
    );

  } catch (error) {
    console.log(error.response?.data);
  }
};


  useEffect(() => {
    getData();
    fetchUser();
  }, [id]);

  const isLiked =
    userId && likes.some((likeId) => likeId?.toString() === userId?.toString());

const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);

  const diffInSeconds = Math.floor((now - past) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;   // approximate
  const year = 365 * day;   // approximate

  if (diffInSeconds < minute) {
    return "Just now";
  }

  if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes}m ago`;
  }

  if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours}h ago`;
  }

  if (diffInSeconds < month) {
    const days = Math.floor(diffInSeconds / day);
    return `${days}d ago`;
  }

  if (diffInSeconds < year) {
    const months = Math.floor(diffInSeconds / month);
    return `${months}mo ago`;
  }

  const years = Math.floor(diffInSeconds / year);
  return `${years}y ago`;
};

  const handleLike = async () => {
    if (!userId) return;

    try {
      const res = await api.post("/post/like", {
        postId: post._id,
        userId: userId,
      });

      if (res.data.success) {
        setLikes(res.data.likesArray);
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  if (loading || !post) return <Loader />;
 
  return (
    <div className={`min-h-screen pt-20 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div
          className={`flex flex-col lg:flex-row rounded-2xl lg:rounded-3xl overflow-hidden border

          ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-xl"}`}
        >
          <div className="w-full lg:flex-[1.5] bg-black flex items-center justify-center max-h-[60vh] lg:max-h-none">
            <img
              src={post.image_url}
              className="w-full h-auto lg:h-full object-cover"
              alt="Post"
            />
          </div>

          <div
            className={`w-full lg:flex-1 flex flex-col ${dark ? "bg-zinc-900" : "bg-white"}`}
          >
            <div
              className={`p-4 border-b flex items-center gap-3 ${dark ? "border-zinc-800" : "border-zinc-100"}`}
            >
              <img
                src={post.profile_url}
                className="w-9 h-9 rounded-full"
                alt="avatar"
              />
              <Link to={`/profile/${post.username}`}>
              <span className={`font-bold text-sm ${!dark ? "text-zinc-950" : "text-zinc-50"}`}>{post.username}</span>
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[40vh] lg:max-h-none">
             
              <div
                className={`p-4 border-b ${
                  dark
                    ? "border-zinc-800 bg-zinc-900/40"
                    : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={post.profile_url}
                    className="w-9 h-9 rounded-full"
                    alt="avatar"
                  />
                  <div>
                    <p className="text-sm leading-relaxed">
                       <Link to={`/profile/${post.username}`}>
                      <span className={`font-semibold ${!dark ? "text-zinc-950" : "text-zinc-50"} mr-2`}>
                        {post.username}
                      </span>
                      </Link>
                      <span
                        className={dark ? "text-zinc-300" : "text-zinc-600"}
                      >
                        {post.postDescription}
                      </span>
                    </p>
                    <p className="text-[10px] mt-1 text-zinc-500 uppercase tracking-wider">
                    Posted {formatTimeAgo(post.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 💬 COMMENTS SECTION */}
              <div className="p-4 space-y-4 h-42">
                {comments.length === 0 && (
                  <p className="text-center text-sm text-zinc-500">
                    No comments yet
                  </p>
                )}

               {comments.map((comment) => (
  <div
    key={comment._id}
    className={`flex gap-3 p-3 rounded-xl transition-all duration-200 ${
      dark
        ? "bg-zinc-800/40 hover:bg-zinc-800/70"
        : "bg-zinc-100 hover:bg-zinc-200"
    }`}
  >
    <img
      src={comment.profile_url}
      className="w-8 h-8 rounded-full"
      alt="avatar"
    />

    <div className="flex-1">
      <p className="text-sm leading-relaxed">
           <Link to={`/profile/${comment.username}`}>
        <span className={`font-semibold ${!dark ? "text-zinc-950" : "text-zinc-50"} mr-2 `}>
          {comment.username}
        </span>
        </Link>
        <span className={dark ? "text-zinc-300" : "text-zinc-700"}>
          {comment.text}
        </span>
      </p>

      <div className="flex justify-between items-center mt-2 text-[10px] uppercase tracking-wide text-zinc-500">
        <span>{formatTimeAgo(comment.date)}</span>

        {/* 🗑 Show only if comment belongs to logged-in user */}
        {comment.userId?.toString() === userId?.toString() && (
          <button
            onClick={() => deleteCommentHandler(comment._id)}
            className="hover:text-red-500 transition-colors"
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
    </div>
  </div>
))}

              </div>
            </div>

            <div
              className={`p-4 border-t ${dark ? "border-zinc-800" : "border-zinc-100"}`}
            >
              <div className="flex justify-between items-center text-2xl mb-3">
                <div className="flex gap-4">
                  <button
                    onClick={handleLike}
                    className={`transition-all duration-200 ${
                      isLiked ? "text-red-500 scale-110" : "hover:text-red-500"
                    }`}
                  >
                    <FiHeart fill={isLiked ? "currentColor" : "none"} />
                  </button>

                  <FiMessageCircle className="hover:text-indigo-500 cursor-pointer transition-colors" />
                  <FiSend className="hover:text-indigo-500 cursor-pointer transition-colors" />
                </div>

                <FiBookmark className="hover:text-indigo-500 cursor-pointer transition-colors" />
              </div>

              <p className="text-sm font-bold">{likes.length} likes</p>
            </div>

            <form
              onSubmit={addCommentHandler}
              className={`p-4 border-t flex gap-3 items-center ${dark ? "border-zinc-800" : "border-zinc-100"}`}
            >
              <input
              required
                type="text"
                onChange={(e) => setaddCom(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1  bg-transparent outline-none text-sm"
              />
              <button
                type="submit"
                className="text-sm hover:cursor-pointer font-bold text-indigo-500"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PostDetail;
