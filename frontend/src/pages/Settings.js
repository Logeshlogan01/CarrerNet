import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    institution: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setForm({
        name: storedUser.name,
        email: storedUser.email,
        phone: storedUser.phone || "",
        age: storedUser.age || "",
        gender: storedUser.gender || "",
        institution: storedUser.institution || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ Update Profile
  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updatedUser = await res.json();

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("❌ Failed to update profile");
    }
  };

  // ✅ Reset Password
  const handlePasswordReset = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("⚠️ New password and confirm password do not match!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${user._id}/reset-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(passwords),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("✅ Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert("❌ " + data.msg);
      }
    } catch (err) {
      alert("❌ Failed to reset password");
    }
  };

  if (!user) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-purple-100 to-pink-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">⚙️ Settings</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          🏠 Home
        </button>
      </div>

      {/* User Profile (Read Only) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">👤 Your Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
        <p><strong>Age:</strong> {user.age || "Not provided"}</p>
        <p><strong>Gender:</strong> {user.gender || "Not provided"}</p>
        <p><strong>Institution:</strong> {user.institution || "Not provided"}</p>
      </div>

      {/* Profile Settings (Editable) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">✏️ Update Profile</h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          placeholder="Name"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          placeholder="Email"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          placeholder="Phone"
        />

        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          placeholder="Age"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="institution"
          value={form.institution}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
          placeholder="Institution"
        />

        <button
          onClick={handleSaveProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Profile
        </button>
      </div>

      {/* Password Reset */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">🔒 Reset Password</h2>

        <input
          type="password"
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
          className="border p-2 w-full mb-4 rounded"
          placeholder="Current Password"
        />

        <input
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          className="border p-2 w-full mb-4 rounded"
          placeholder="New Password"
        />

        <input
          type="password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handlePasswordChange}
          className="border p-2 w-full mb-4 rounded"
          placeholder="Confirm New Password"
        />

        <button
          onClick={handlePasswordReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
