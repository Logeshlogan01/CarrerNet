<form onSubmit={handleAddEvent} className="bg-white p-4 rounded shadow-md">
  <input
    type="text"
    placeholder="Title"
    value={newEvent.title || ""}
    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
    className="border p-2 w-full mb-2 rounded"
  />

  <textarea
    placeholder="Description"
    value={newEvent.description || ""}
    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
    className="border p-2 w-full mb-2 rounded"
  />

  <input
    type="date"
    value={newEvent.date || ""}
    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
    className="border p-2 w-full mb-2 rounded"
  />

  <input
    type="text"
    placeholder="Location"
    value={newEvent.location || ""}
    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
    className="border p-2 w-full mb-2 rounded"
  />

  {/* ✅ File input for brochure */}
  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) =>
      setNewEvent({ ...newEvent, brochure: e.target.files[0] })
    }
    className="border p-2 w-full mb-2 rounded"
  />

  <button
    type="submit"
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Add Event
  </button>
</form>
