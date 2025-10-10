import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    brochure: null, // ✅ add brochure
  });

  const navigate = useNavigate();

  // ✅ Fetch existing events
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Add new event with file upload
  const handleAddEvent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description);
    formData.append("date", newEvent.date);
    formData.append("location", newEvent.location);

    if (newEvent.brochure) {
      formData.append("brochure", newEvent.brochure); // ✅ include file
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.event) {
        setEvents([...events, res.data.event]);
      }

      alert("✅ Event added successfully!");
      setNewEvent({ title: "", date: "", location: "", description: "", brochure: null });
    } catch (err) {
      console.error("Error adding event:", err);
      alert("❌ Failed to add event");
    }
  };

  // ✅ Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-green-100 to-blue-100">
      {/* Header with Home button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📅 Upcoming Events</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          🏠 Home
        </button>
      </div>

      {/* Post Event Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Post New Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="date"
          value={newEvent.date}
          min={new Date().toISOString().split("T")[0]} // ✅ block past dates
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          className="border p-2 w-full mb-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
          className="border p-2 w-full mb-2 rounded"
        />

        {/* ✅ File Upload */}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setNewEvent({ ...newEvent, brochure: e.target.files[0] })}
          className="border p-2 w-full mb-2 rounded"
        />

        <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post Event
        </button>
      </div>

      {/* Event List */}
      {events.map((event, idx) => (
        <div key={idx} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-gray-600">📍 {event.location}</p>
          <p className="text-gray-600">📅 {formatDate(event.date)}</p>
          <p className="mt-2">{event.description}</p>

          {/* ✅ Show brochure if available */}
          {event.brochure && (
            <a
              href={`http://localhost:5000${event.brochure}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-2 block"
            >
              📎 View Brochure
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
