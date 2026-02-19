import React, { useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { FiImage, FiSmile, FiX } from "react-icons/fi";
import { useAppContext } from "../Context/AppContext"; 
import api from "../API/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";

function CreatePost() {
  const { dark } = useTheme();
  const { token } = useAppContext(); 
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleShare = async () => {
    if (!file) return toast.error("Please select an image");
    if (!token) return toast.error("You must be logged in");

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file); 
    formData.append("caption", caption);
    formData.append("token", token);

    try {
      const res = await api.post("/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Post shared successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      {loading && <Loader />}
      
      <main className="max-w-5xl mx-auto px-4 py-10">
      
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}>
            Create New Post
          </h1>

          <button 
            onClick={handleShare}
            disabled={loading}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

     
        <div className={`flex flex-col lg:flex-row rounded-3xl overflow-hidden border min-h-[500px] ${dark ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/40"}`}>
          
        
          <div className={`flex-1 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r ${dark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50"}`}>
            {image ? (
              <div className="relative w-full h-full p-4">
                <img src={image} className="w-full h-full object-contain rounded-xl" alt="Preview" />
                <button
                  onClick={() => { setImage(null); setFile(null); }}
                  className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-4 cursor-pointer group">
                <div className={`p-8 rounded-full transition-all ${dark ? "bg-zinc-800 group-hover:bg-zinc-700" : "bg-white group-hover:bg-zinc-100 shadow-sm"}`}>
                  <FiImage size={40} className="text-indigo-500" />
                </div>
                <div className="text-center">
                  <p className={`font-bold ${dark ? "text-zinc-300" : "text-zinc-700"}`}>Select photos or videos</p>
                  <p className="text-xs text-zinc-500 mt-1">PNG, JPG or GIF</p>
                </div>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>

     =
          <div className="w-full lg:w-[400px] p-6 flex flex-col gap-6">
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={`w-full h-full bg-transparent resize-none outline-none text-sm leading-relaxed ${dark ? "text-zinc-300" : "text-zinc-700"}`}
            />
            <div className={`flex justify-between items-center pb-4 border-b ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
              <FiSmile className="text-zinc-400 cursor-pointer hover:text-indigo-500" size={20} />
              <span className="text-[10px] text-zinc-500">{caption.length}/2200</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePost;