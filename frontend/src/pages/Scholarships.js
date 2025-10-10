// src/pages/Scholarships.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [newScholarship, setNewScholarship] = useState({
    title: "",
    eligibility: "",
    deadline: "",
    amount: "",
    description: "",
    brochure: null,
  });

  const navigate = useNavigate();

  // ✅ Fetch available scholarships
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/scholarships")
      .then((res) => setScholarships(res.data))
      .catch((err) => console.error("Error fetching scholarships:", err));
  }, []);

  // ✅ Handle posting new scholarship
  const handleAddScholarship = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(newScholarship).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/scholarships", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.scholarship) {
        setScholarships([...scholarships, res.data.scholarship]);
      }

      alert("✅ Scholarship added successfully!");
      setNewScholarship({
        title: "",
        eligibility: "",
        deadline: "",
        amount: "",
        description: "",
        brochure: null,
      });
    } catch (err) {
      console.error("Error adding scholarship:", err);
      alert("❌ Failed to add scholarship");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-yellow-100 to-orange-100 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎓 Scholarship Information</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          🏠 Back to Dashboard
        </button>
      </div>

      {/* Post Scholarship Form */}
      <form
        onSubmit={handleAddScholarship}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">➕ Post New Scholarship</h2>

        <input
          type="text"
          placeholder="Scholarship Title"
          value={newScholarship.title}
          onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Eligibility"
          value={newScholarship.eligibility}
          onChange={(e) => setNewScholarship({ ...newScholarship, eligibility: e.target.value })}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="date"
          value={newScholarship.deadline}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Amount"
          value={newScholarship.amount}
          onChange={(e) => setNewScholarship({ ...newScholarship, amount: e.target.value })}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={newScholarship.description}
          onChange={(e) =>
            setNewScholarship({ ...newScholarship, description: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setNewScholarship({ ...newScholarship, brochure: e.target.files[0] })}
          className="border p-2 w-full mb-4 rounded"
        />

        {/* ✅ Big, Visible Button */}
        <button
  type="submit"
  className="w-full bg-blue-600 text-white font-bold px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all
       hover:bg-blue-700 active:bg-blue-800 
             focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
>
  📢 Post Scholarship
</button>
      </form>

      {/* Scholarship List */}
      <h2 className="text-xl font-semibold mb-4">📋 Available Scholarships</h2>
      {scholarships.length === 0 ? (
        <p className="text-gray-600">No scholarships available yet.</p>
      ) : (
        scholarships.map((scholarship, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold">{scholarship.title}</h2>
            <p className="text-gray-600">📝 Eligibility: {scholarship.eligibility}</p>
            <p className="text-gray-600">
              📅 Deadline:{" "}
              {new Date(scholarship.deadline).toLocaleDateString()}
            </p>
            <p className="text-gray-600">💰 Amount: {scholarship.amount}</p>
            <p className="mt-2">{scholarship.description}</p>

            {scholarship.brochure && (
              <a
                href={`http://localhost:5000${scholarship.brochure}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 block"
              >
                📎 View Brochure
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}
