import React, { useEffect, useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { FiGrid } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../API/api";
import { Link, useParams } from "react-router-dom";
import Loader from "../Components/Loader";

function UserProfile() {
  const { dark } = useTheme();
  const { username } = useParams();

  const [userr, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/user/profile/${username}`);

      if (res.data.success) {
        setUser(res.data.user);
        setPosts(res.data.posts || []);
      } else {
        toast.error("User not found");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      getData();
    }
  }, [username]);   

  if (loading) return <Loader />;

  if (!userr) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-15 transition-colors duration-300 ${
        dark
          ? "bg-zinc-950 text-zinc-100"
          : "bg-zinc-50 text-zinc-900"
      }`}
    >
      <main className="max-w-4xl mx-auto px-4 pt-10 pb-20">

      
        <header className="flex flex-col md:flex-row items-center gap-8 md:gap-20 mb-12 px-4">
          <div>
            <img
              src={userr.image_url}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
              alt="Profile"
            />
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-2xl font-light tracking-tight">
              {userr.username}
            </h2>

            <div>
              <p className="font-bold text-sm">{userr.name}</p>
              <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                {userr.description}
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
             <Link key={post._id} to={`/postdetails/${post._id}`}>
              <div
                
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
             </Link>
            ))
          ) : (
            <p className="col-span-3 text-center text-zinc-500 mt-6">
              No posts yet
            </p>
          )}
        </div>

      </main>
    </div>
  );
}

export default UserProfile;
