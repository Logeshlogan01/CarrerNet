// Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth";
import axios from "axios";
import { authAxios } from "../auth";
import Events from "./Events";
import ScholarshipInfo from "./Scholarships";
import { 
  FaHome, 
  FaUser, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCog, 
  FaSignOutAlt,
  FaBell,
  FaGoogle,
  FaRobot,
  FaChartLine,
  FaStar,
  FaChevronRight,
  FaSearch,
  FaFilter
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("home");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [protectedMsg, setProtectedMsg] = useState("");
  const [user, setUser] = useState(null);

  // ✅ Recommendation states
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recError, setRecError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProtectedMsg(res.data.msg);
        const currentUser = res.data.user || JSON.parse(atob(token.split(".")[1]));
        setUser(currentUser);

        // ✅ Fetch AI recommendations
        if (currentUser?._id) {
          try {
            const recRes = await authAxios.get(
              `http://localhost:5000/api/recommendations/${currentUser._id}`
            );
            setRecommendations(recRes.data);
          } catch (err) {
            console.error("Recommendation fetch error:", err);
            setRecError("Failed to load recommendations");
          } finally {
            setLoadingRecs(false);
          }
        }
      } catch (err) {
        console.error(err);
        setProtectedMsg("⚠️ Error fetching dashboard data");
        navigate("/");
      }
    };

    fetchDashboard();
  }, [navigate]);

  const sendNotification = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "CareerCampus Notification",
          text: message,
        }),
      });

      const data = await res.json();
      alert(data.msg);
    } catch {
      alert("❌ Error sending notification");
    }
  };

  const addToCalendar = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/calendar/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: "CareerCampus Event",
          description: "This is a test event created from Dashboard",
          startTime: "2025-09-08T10:00:00+05:30",
          endTime: "2025-09-08T11:00:00+05:30",
        }),
      });

      const data = await res.json();
      alert(data.msg);
    } catch {
      alert("❌ Error adding event to Google Calendar");
    }
  };

  // Navigation items with icons
  const navItems = [
    { id: "home", label: "Dashboard", icon: <FaHome className="text-lg" /> },
    { id: "profile", label: "Profile", icon: <FaUser className="text-lg" /> },
    { id: "events", label: "Events", icon: <FaCalendarAlt className="text-lg" /> },
    { id: "opportunities", label: "Opportunities", icon: <FaBriefcase className="text-lg" /> },
    { id: "scholarship", label: "Scholarships", icon: <FaGraduationCap className="text-lg" /> },
    { id: "settings", label: "Settings", icon: <FaCog className="text-lg" /> },
  ];

  // Stats data
  const stats = [
    { label: "Events Attended", value: "12", color: "from-blue-500 to-cyan-500" },
    { label: "Applications", value: "8", color: "from-green-500 to-emerald-500" },
    { label: "Scholarships", value: "3", color: "from-purple-500 to-pink-500" },
    { label: "Skills", value: "15", color: "from-orange-500 to-red-500" },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "events":
        return <Events />;
      case "scholarship":
        return <ScholarshipInfo />;
      case "profile":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
            <p className="text-gray-700">You can update your personal details here.</p>
            <button
              onClick={() => navigate("/feed")}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Feed
            </button>
          </div>
        );
      case "opportunities":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">💼 Opportunities</h2>
            <p className="text-gray-700">Browse internships and job openings near you.</p>
            <button
              onClick={() => navigate("/opportunities")}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              View Opportunities
            </button>
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">⚙️ Settings</h2>
            <p className="text-gray-700">Change your account preferences or password here.</p>
            <button
              onClick={() => navigate("/settings")}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Update Settings
            </button>
          </div>
        );
      default:
        return (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CareerCampus
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-lg">
                      👋 Welcome back, {user?.name || "User"}!
                    </p>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300`}
                >
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-blue-100 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Complete your profile to get better recommendations</p>
                  <button
                    onClick={() => setActivePage("profile")}
                    className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    View Profile <FaChevronRight className="text-xs" />
                  </button>
                </div>

                {/* Events Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Events</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Discover hackathons, workshops and meetups</p>
                  <button
                    onClick={() => setActivePage("events")}
                    className="w-full bg-green-50 text-green-600 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Browse Events <FaChevronRight className="text-xs" />
                  </button>
                </div>

                {/* Opportunities Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaBriefcase className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Opportunities</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Find internships and jobs near you</p>
                  <button
                    onClick={() => setActivePage("opportunities")}
                    className="w-full bg-purple-50 text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Explore Jobs <FaChevronRight className="text-xs" />
                  </button>
                </div>

                {/* Scholarships Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FaGraduationCap className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Scholarships</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Browse scholarships and funding opportunities</p>
                  <button
                    onClick={() => setActivePage("scholarship")}
                    className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    View Scholarships <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Notifications Panel */}
              <div className="space-y-6">
                {/* Calendar Integration */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FaGoogle className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Google Calendar</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Sync your events and deadlines</p>
                  <button
                    onClick={addToCalendar}
                    className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    Connect Calendar
                  </button>
                </div>

                {/* Quick Notifications */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FaBell className="text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Send Notification</h3>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Your message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                    <button
                      onClick={sendNotification}
                      className="w-full bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                    >
                      Send Notification
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <FaRobot className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">AI Recommendations</h3>
                    <p className="text-gray-600 text-sm">Personalized just for you</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <FaFilter className="text-sm" />
                  Filter
                </button>
              </div>

              {loadingRecs ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recError ? (
                <div className="text-center py-8 text-red-500">
                  {recError}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recommendations available yet. Complete your profile to get personalized suggestions.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {item.title || item.name}
                        </h4>
                        <FaStar className="text-yellow-400 flex-shrink-0" />
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description?.substring(0, 120) || "No description available"}
                      </p>
                      {item.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white shadow-xl transition-all duration-300 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CareerCampus
            </h2>
          </div>
          <div className="lg:hidden flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                activePage === item.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={`${activePage === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </span>
              <span className="hidden lg:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
          >
            <FaSignOutAlt className="text-gray-400 group-hover:text-red-600" />
            <span className="hidden lg:block font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
        {renderPage()}
      </main>
    </div>
  );
}