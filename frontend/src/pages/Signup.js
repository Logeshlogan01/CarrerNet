import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../auth";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaBirthdayCake,
  FaUniversity,
  FaCode,
  FaHeart,
  FaBook,
  FaArrowLeft,
  FaUserPlus,
} from "react-icons/fa";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
    institution: "",
    skills: "",
    interests: "",
    completedCourses: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  // ✅ Update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // ✅ Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone number validation (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("📱 Phone number must be exactly 10 digits");
      triggerShake();
      return;
    }

    // Password strength check
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(formData.password)) {
      setError("🔐 Password must contain at least one letter and one number (min 6 characters)");
      triggerShake();
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Convert comma-separated values to arrays
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        institution: formData.institution,
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim())
          : [],
        interests: formData.interests
          ? formData.interests.split(",").map((i) => i.trim())
          : [],
        completedCourses: formData.completedCourses
          ? formData.completedCourses.split(",").map((c) => c.trim())
          : [],
      };

      // ✅ Send to backend
      const user = await signup(userData);
      alert(`🎉 Account created successfully! Welcome ${user.name || ""}`);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for shake animation
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div
        className={`w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 transform transition-all duration-500 hover:shadow-2xl ${
          shake ? "animate-shake" : ""
        } relative z-10 border border-white/50`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group bg-white/50 hover:bg-white px-4 py-2 rounded-xl shadow-sm"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Join Us Today
            </h2>
            <p className="text-gray-600 text-sm">
              Create your account and start your learning journey
            </p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200">
              Basic Information
            </h3>

            {/* Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
                required
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <FaBirthdayCake className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                  onChange={handleChange}
                />
              </div>
              <select
                name="gender"
                className="w-full p-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200">
              Additional Details
            </h3>

            {/* Institution */}
            <div className="relative">
              <FaUniversity className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="institution"
                placeholder="School / College / Organization"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
              />
            </div>

            {/* Skills */}
            <div className="relative">
              <FaCode className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="skills"
                placeholder="HTML, CSS, JavaScript..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
              />
            </div>

            {/* Interests */}
            <div className="relative">
              <FaHeart className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="interests"
                placeholder="AI, Design, Marketing..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
              />
            </div>

            {/* Completed Courses */}
            <div className="relative">
              <FaBook className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="completedCourses"
                placeholder="e.g. React Basics, AI Intro"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mt-4 animate-pulse">{error}</p>
        )}
      </div>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
