import React, { useEffect, useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { FiSearch, FiTrash2, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../API/api";
import Loader from "../Components/Loader";

function Admin() {
  const { dark } = useTheme();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [que, setQue] = useState("");
  const [apires, setApires] = useState([]);
  const [apiloading, setApiloading] = useState(false);
 const [delLoading,setdelLoading] = useState(false);
const deleteAcc = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    setdelLoading(true);
    const res = await api.delete(`/user/deleteacc/${id}`);

    if (res.data.success) {
      toast.success(res.data.message);
      setData((prev) => prev.filter((u) => u._id !== id));
      setApires((prev) => prev.filter((u) => u._id !== id));
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    toast.error("Delete failed");
  } finally {
    setdelLoading(false);
  }
};
  const getData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.get(`/user/admin/${token}`);

      if (res.data.success) {
        setData(res.data.user); 
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  useEffect(() => {
    if (!que.trim()) {
      setApires([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setApiloading(true);

        const res = await api.get(`/user/search?query=${que}`);

        if (res.data.success) {
          setApires(res.data.users || res.data.result || []);
        }
      } catch (error) {
        toast.error("Search failed");
      } finally {
        setApiloading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [que]);

  if (loading) return <Loader />;

  const displayUsers = que.trim() ? apires : data;

  return (
    <div
      className={`min-h-screen pt-24 pb-12 px-4 md:px-12 transition-colors duration-300 ${
        dark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight italic flex items-center gap-3">
              <FiShield className="text-indigo-500" />
              ADMIN<span className="text-indigo-500">PANEL</span>
            </h1>
            <p className="text-zinc-500 mt-2 font-medium">
              Managing {displayUsers.length} registered creators.
            </p>
          </div>

        
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border w-full md:w-96 ${
              dark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-zinc-200 shadow-sm"
            }`}
          >
            <FiSearch className="text-zinc-400" />
            <input
              type="text"
              value={que}
              onChange={(e) => setQue(e.target.value)}
              placeholder="Search by username or email..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>


        <div
          className={`rounded-[2rem] border overflow-hidden shadow-2xl ${
            dark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200"
          }`}
        >
          <div className="overflow-x-auto">

            {apiloading && (
              <div className="px-8 py-4 text-sm text-zinc-400">
                Searching...
              </div>
            )}

            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr
                  className={`text-[11px] uppercase tracking-[0.2em] font-black border-b ${
                    dark
                      ? "bg-zinc-900/60 text-zinc-500 border-zinc-800"
                      : "bg-zinc-50 text-zinc-400 border-zinc-100"
                  }`}
                >
                  
                  <th className="px-8 py-5">User info</th>
                  <th className="px-8 py-5">Email Address</th>
                  <th className="px-8 py-5">Description</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/10">
                {displayUsers.map((u, index) => (
                  <tr
                    key={u._id}
                    className="group hover:bg-indigo-500/5 transition-colors"
                  >

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={u.image_url}
                          className="w-12 h-12 rounded-2xl object-cover border border-zinc-800/20"
                          alt=""
                        />
                        <div>
                          <p className="text-sm font-black tracking-tight">
                            @{u.username}
                          </p>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                            {u.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-sm text-zinc-400">
                      {u.email}
                    </td>

                    <td className="px-8 py-5 text-xs text-zinc-500 max-w-[200px] truncate group-hover:text-zinc-300 transition-colors">
                      {u.description}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <button
  disabled={delLoading}
  onClick={() => deleteAcc(u._id)}
  className={`p-3 rounded-xl transition-all
    ${delLoading 
      ? "bg-zinc-400 cursor-not-allowed" 
      : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"}
  `}
>
  <FiTrash2 size={18} />
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-t ${
              dark ? "border-zinc-800" : "border-zinc-100"
            }`}
          >
            End of records — Total Users: {displayUsers.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;