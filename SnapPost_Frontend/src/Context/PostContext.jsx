import { createContext, useContext, useState } from "react";
import api from "../API/api";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const getAllPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await api.get("/posts"); 
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const createPost = async (formData) => {
    const res = await api.post("/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setPosts((prev) => [res.data.post, ...prev]);
    return res.data;
  };


  const deletePost = async (id) => {
    await api.delete(`/post/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loadingPosts,
        getAllPosts,
        createPost,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
