import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import { useTheme } from "../Context/ThemeContext";
import { FiEdit2, FiGrid, FiTrash2 } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { checkToken } from '../Utils/checkToken';
import api from "../API/api";
import { toast } from 'react-toastify';

function ProfilePage() {
  const { dark } = useTheme();
  const token = checkToken();

  const [user, setuser] = useState(null);
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/user/profile", {
          token: localStorage.getItem("token"),
        });

        if (res.data.success) {
          setuser(res.data.user);
          setPosts(res.data.posts || []);   
        }
      } catch (error) {
        console.log("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [token]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await api.delete(`/post/${postId}`);
      if (res.data.success) {
        setPosts(posts.filter(p => p._id !== postId));
        toast.success("Post removed");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-15 transition-colors duration-300 ${dark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}>
      <main className="max-w-4xl mx-auto px-4 pt-10 pb-20">

        <header className="flex flex-col md:flex-row items-center gap-8 md:gap-20 mb-12 px-4">
          <div className="relative group">
            <img 
              src={user?.image_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
              alt="Profile" 
            />
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h2 className="text-2xl font-light tracking-tight">
                {user?.username}
              </h2>
              <Link to='/edit'>
                <button className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${dark ? "bg-zinc-100 text-black hover:bg-zinc-300" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                  Edit Profile
                </button>
              </Link>
            </div>
            <div>
              <p className="font-bold text-sm">{user?.name}</p>
              <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                {user?.description}
              </p>
            </div>
          </div>
        </header>

        <div className={`border-t ${dark ? "border-zinc-800" : "border-zinc-200"}`}>
          <div className="flex justify-center gap-12">
            <button className="flex items-center gap-2 py-4 text-xs font-bold tracking-widest uppercase">
              <FiGrid /> Posts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
        {posts.length > 0 ? (
  posts.map((post) => (
    <div key={post._id} className="relative aspect-square overflow-hidden rounded-lg group">
      {/* Post Image */}
      <img 
        src={post.image_url}
        alt="Post"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Aesthetic Action Overlay */}
      <div className={`
        absolute bottom-1.5 right-1.5 flex items-center gap-1 p-1 
        bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-xl
        /* Mobile: Always visible | Desktop: Show on hover */
        opacity-100 md:opacity-0 md:group-hover:opacity-100 
        transition-all duration-300
      `}>
        <Link 
          to={`/edit-post/${post._id}`}
          className="p-2 active:bg-white/20 text-white rounded-lg transition-colors"
        >
          <FiEdit2 size={14} className="md:w-[15px]" />
        </Link>
        
        <div className="w-[1px] h-3 bg-white/20" />

        <button 
          onClick={() => handleDelete(post._id)}
          className="p-2 active:bg-red-500/40 text-white rounded-lg transition-colors"
        >
          <FiTrash2 size={14} className="md:w-[15px]" />
        </button>
      </div>
    </div>
  ))
) : (
  <p className="col-span-3 text-center text-zinc-500 mt-6">No posts yet</p>
)}
        </div>

      </main>
    </div>
  );
}

export default ProfilePage;