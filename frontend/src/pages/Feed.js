import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../auth";

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ name: "", title: "", content: "" });

  // ✅ Fetch feeds from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/feeds")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching feeds:", err));
  }, []);

  // ✅ Add post to DB
  const addPost = async () => {
    if (!newPost.title || !newPost.content) {
      alert("⚠️ Please enter both title and content");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/feeds", newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts([res.data, ...posts]); // update UI instantly
      setNewPost({ name: "", title: "", content: "" }); // Reset all fields including name
    } catch (err) {
      console.error("Error adding post:", err);
      alert("❌ Failed to add post");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-yellow-100 p-8">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow-lg p-4 rounded-xl mb-8">
        <h1 className="text-2xl font-bold text-gray-800">📢 Feed Page</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Add New Post */}
      <div className="max-w-3xl mx-auto mb-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-3">➕ Create a New Post</h2>
        <input
          type="text"
          placeholder="Name"
          value={newPost.name}
          onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          type="text"
          placeholder="Post Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />
        <textarea
          placeholder="Post Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />
        <button
          onClick={addPost}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Post
        </button>
      </div>

      {/* Posts Section */}
      <div className="max-w-3xl mx-auto space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-600 text-center">No posts yet. Be the first!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white shadow-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold">{post.name}</h2>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.content}</p>
              <p className="text-sm text-gray-500 mt-3">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
