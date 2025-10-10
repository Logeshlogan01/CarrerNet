import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [newOpp, setNewOpp] = useState({ role: "", location: "", details: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/opportunities")
      .then((res) => res.json())
      .then((data) => setOpportunities(data))
      .catch((err) => console.error(err));
  }, []);

  const handlePostOpp = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ token required
        },
        body: JSON.stringify(newOpp),
      });
      const data = await res.json();
      if (data.opp) {
        setOpportunities([...opportunities, data.opp]);
      }
      setNewOpp({ role: "", location: "", details: "" });
    } catch (err) {
      alert("❌ Error posting opportunity");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-yellow-100 to-red-100">
      {/* Header with Home button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">💼 Opportunities</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          🏠 Home
        </button>
      </div>

      {/* Post Opportunity */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Post New Opportunity</h2>
        <input
          type="text"
          placeholder="Role"
          value={newOpp.role}
          onChange={(e) => setNewOpp({ ...newOpp, role: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={newOpp.location}
          onChange={(e) => setNewOpp({ ...newOpp, location: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <textarea
          placeholder="Details"
          value={newOpp.details}
          onChange={(e) => setNewOpp({ ...newOpp, details: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <button
          onClick={handlePostOpp}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Post Opportunity
        </button>
      </div>

      {/* Opportunities List */}
      {opportunities.map((opp, idx) => (
        <div key={idx} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold">{opp.role}</h2>
          <p className="text-gray-600">📍 {opp.location}</p>
          <p className="mt-2">{opp.details}</p>
        </div>
      ))}
    </div>
  );
}
