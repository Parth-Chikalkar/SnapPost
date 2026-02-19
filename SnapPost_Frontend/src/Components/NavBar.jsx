import { FiSearch, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../Context/ThemeContext";
import { useAppContext } from "../Context/AppContext";
import { useState, useEffect } from "react";
import api from "../API/api";

function NavBar() {
  const { dark } = useTheme();
  const { token, user, setUser } = useAppContext();

  const [loading, setLoading] = useState(true);

  // 🔍 Search States
  const [apires, setapires] = useState([]);
  const [dropdown, setdropdown] = useState(false);
  const [apiloading, setapiloading] = useState(false);
  const [que, setque] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  /* ===================== SEARCH LOGIC ===================== */
  useEffect(() => {
    if (!que.trim()) {
      setapires([]);
      setdropdown(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setapiloading(true);
        const res = await api.get(`/user/search?query=${que}`);

        if (res.data.success) {
          setapires(res.data.users || res.data.result || []);
          setdropdown(true);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setapiloading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [que]);

  /* ===================== PROFILE FETCH ===================== */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/user/profile", { token });
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Profile fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, setUser]);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 h-20 px-6 w-full flex items-center justify-between
        ${dark ? "bg-zinc-950/80 text-zinc-100" : "bg-white/80 text-zinc-900"}
        backdrop-blur-md transition-colors duration-300`}
      >
        {/* LOGO */}
        <Link to="/">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="font-bold text-xl italic tracking-tight">
              SNAP<span className="text-indigo-500">POST</span>
            </h1>
          </div>
        </Link>

        {/* ================= DESKTOP SEARCH ================= */}
        {token && (
          <div
            className={`hidden md:flex relative items-center px-4 py-2 rounded-full w-1/3
            ${dark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-transparent"}
            border focus-within:ring-2 ring-indigo-500/50`}
          >
            <FiSearch className="text-zinc-400" />
            <input
              type="text"
              value={que}
              onChange={(e) => setque(e.target.value)}
              onFocus={() => apires.length > 0 && setdropdown(true)}
              placeholder="Search creators..."
              className="bg-transparent outline-none px-3 w-full text-sm"
            />

            {/* Desktop Dropdown */}
            {dropdown && (
              <div
                className={`absolute top-full mt-2 w-full rounded-xl shadow-xl border z-50
                ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}
              >
                {apiloading && (
                  <div className="p-4 text-sm text-zinc-400">Searching...</div>
                )}

                {!apiloading && apires.length === 0 && (
                  <div className={`p-4 text-sm text-zinc-500 ${dark ? "bg-zinc-900" : "bg-whit"}`}>
                    No users found
                  </div>
                )}

                {apires.map((u) => (
                  <Link
                    key={u._id}
                    to={`/profile/${u.username}`}
                    onClick={() => {
                      setdropdown(false);
                      setque("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-500/10 transition"
                  >
                    <img
                      src={u.image_url}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="profile"
                    />
                    <p className={`${dark ? "bg-zinc-900" : "bg-white"} text-sm font-semibold`}>{u.username}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5 text-xl text-zinc-500">

          {/* 📱 Mobile Search Icon */}
          {token && (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden hover:text-indigo-500 transition"
            >
              <FiSearch />
            </button>
          )}

          {token && (
            <Link to="/createPost">
              <FiPlus className="hover:text-indigo-500 transition" />
            </Link>
          )}

          <ThemeToggle />

          {token ? (
            <Link to="/profile" className="flex items-center gap-3">
              <img
                src={loading ? "https://api.dicebear.com/7.x/avataaars/svg?seed=User" : user?.image_url}
                className="w-10 h-10 rounded-full border-2 border-indigo-500 p-0.5"
                alt="profile"
              />
            </Link>
          ) : (
            <Link to="/login">
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

     
      {mobileSearchOpen && (
        <div
          className={`fixed inset-0 z-[100] transition-all duration-300
          ${dark ? "bg-zinc-950/95" : "bg-white/95"} backdrop-blur-md`}
        >
          <div className="p-6 space-y-6">

            <div className="flex items-center justify-between">
              <h2 className={`text-lg ${!dark ? "text-zinc-950/95" : "text-white/95"}  font-bold`}>Search</h2>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="text-zinc-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div
              className={`flex items-center px-4 py-3 rounded-xl border
              ${dark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"}`}
            >
              <FiSearch className="text-zinc-400" />
              <input
                type="text"
                value={que}
                onChange={(e) => setque(e.target.value)}
                placeholder="Search creators..."
                className={`bg-transparent outline-none px-3 w-full text-sm  ${!dark ? "text-zinc-950/95" : "text-white/95"} `}
              />
            </div>

            <div className="space-y-3">
              {apiloading && (
                <p className="text-sm text-zinc-400">Searching...</p>
              )}

              {!apiloading && apires.length === 0 && que && (
                <p className={`${!dark ? "text-zinc-950/95" : "text-white/95"}  text-sm text-zinc-500`}>No users found</p>
              )}

              {apires.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u.username}`}
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setque("");
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition
                  ${dark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
                >
                  <img
                    src={u.image_url}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="profile"
                  />
                  <p className={`${!dark ? "text-zinc-950/95" : "text-white/95"}  text-sm font-semibold`}>{u.username}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
