import React, { useState, useEffect } from "react";
import { useTheme } from "../Context/ThemeContext";
import { FiUser, FiCamera } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import api from "../API/api";
import { toast } from "react-toastify";

function EditProfile() {
  const { dark } = useTheme();
  const nav = useNavigate();
  const { setUser, logout } = useAppContext();

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputClasses = `
    w-full px-4 py-2.5 rounded-xl border transition-all outline-none text-sm
    ${
      dark
        ? "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        : "bg-white border-zinc-200 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    }
  `;

  // ✅ Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.post("/user/profile", {
          token: localStorage.getItem("token"),
        });

        if (res.data.success) {
          setName(res.data.user.name);
          setUsername(res.data.user.username);
          setBio(res.data.user.description);
          setImage(res.data.user.image_url);
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchUser();
  }, []);

  // ✅ Handle Update
const handleUpdate = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("token", localStorage.getItem("token"));
    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await api.put("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      toast.success("Profile updated successfully");
      nav("/profile");
    }

  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className={`min-h-screen pt-25 transition-colors duration-300 ${
        dark ? "bg-zinc-950" : "bg-zinc-50"
      }`}
    >
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div
          className={`flex flex-col md:flex-row rounded-3xl overflow-hidden border
          ${
            dark
              ? "bg-zinc-900/30 border-zinc-800"
              : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50"
          }`}
        >
          {/* Sidebar */}
          <aside
            className={`md:w-64 border-r p-6 ${
              dark ? "border-zinc-800" : "border-zinc-100"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-8 ${
                dark ? "text-white" : "text-zinc-900"
              }`}
            >
              Edit Profile
            </h2>

            <button
              onClick={() => {
                setUser(null);
                localStorage.clear();
                logout();
                nav("/");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-2 text-sm font-medium transition-all
                ${
                  dark
                    ? "text-red-400 hover:bg-zinc-800"
                    : "text-zinc-500 hover:bg-zinc-50"
                }`}
            >
              <CiLogout /> Logout
            </button>
          </aside>

          {/* Form Section */}
          <section className="flex-1 p-8 md:p-12">
            <div className="max-w-xl">
              {/* Profile Image */}
              <div className="flex items-center gap-6 mb-10">
                <div className="relative">
                  <img
                    src={image}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/10"
                    alt="Avatar"
                  />
                  <input
  type="file"
  hidden
  id="profileImageInput"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  }}
/>

<label
  htmlFor="profileImageInput"
  className="absolute -bottom-2 -right-2 p-2 bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-600 transition-colors cursor-pointer"
>
  <FiCamera size={16} />
</label>

                </div>
                <div>
                  <h3
                    className={`font-bold ${
                      dark ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    {username}
                  </h3>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                  <label
                    className={`text-sm font-bold ${
                      dark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    Name
                  </label>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                  <label
                    className={`text-sm font-bold ${
                      dark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    Username
                  </label>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
                  <label
                    className={`text-sm font-bold pt-2 ${
                      dark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    Bio
                  </label>
                  <div className="md:col-span-3">
                    <textarea
                      rows="3"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                </div>

                {/* Save */}
                <div className="md:grid md:grid-cols-4 gap-2">
                  <div />
                  <div className="md:col-span-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-8 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default EditProfile;
