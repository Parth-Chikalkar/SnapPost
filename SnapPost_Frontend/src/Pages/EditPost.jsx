import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { FiEdit3, FiSmile, FiArrowLeft, FiSave } from "react-icons/fi";
import api from "../API/api";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/post/${id}`);
        if (res.data.success) {
          setCaption(res.data.postData.postDescription);
          setImagePreview(res.data.postData.image_url);
        }
      } catch (error) {
        toast.error("Could not fetch post data");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      
      const res = await api.put(`/post/update/${id}`, {caption , token : localStorage.getItem("token")});
      if (res.data.success) {
        toast.success("Post updated!");
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      <main className="max-w-4xl mx-auto px-4 py-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}
          >
            <FiArrowLeft /> Back
          </button>
          
          <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-zinc-900"}`}>
            Edit Post
          </h1>

          <button 
            onClick={handleUpdate}
            disabled={updating}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            <FiSave /> {updating ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Edit Card */}
        <div className={`flex flex-col md:flex-row rounded-3xl overflow-hidden border ${dark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-xl"}`}>
          
          {/* Left: Non-editable Image Preview */}
          <div className="flex-1 bg-black/5 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-zinc-800/10">
            <img 
              src={imagePreview} 
              alt="Existing post" 
              className="max-h-[400px] w-full object-contain rounded-xl shadow-lg"
            />
          </div>

          {/* Right: Caption Editor */}
          <div className="w-full md:w-[350px] p-6 flex flex-col gap-4">
            <label className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Update your caption..."
              className={`w-full h-40 bg-transparent resize-none outline-none text-sm leading-relaxed ${dark ? "text-zinc-300" : "text-zinc-700"}`}
            />
            
            <div className={`flex justify-between items-center pt-4 border-t ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
              <FiSmile className="text-zinc-400 cursor-pointer hover:text-indigo-500" size={20} />
              <span className="text-[10px] text-zinc-500">{caption.length}/2200</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default EditPost;