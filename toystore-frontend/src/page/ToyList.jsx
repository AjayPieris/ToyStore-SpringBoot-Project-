import { useState, useEffect } from "react";

export default function ToyList() {
  const [toys, setToys] = useState([]);
  const [error, setError] = useState("");

  // Memory for Adding a Toy
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [addMessage, setAddMessage] = useState("");

  // NEW: Memory for Updating a Toy
  const [editingToyId, setEditingToyId] = useState(null); // Remembers WHICH toy is being edited
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchToys();
  }, []);

  // --- 1. THE GET TRUCK (Fetch Toys) ---
  const fetchToys = async () => {
    const token = localStorage.getItem("vip_token");
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8080/toys", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setToys(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 2. THE POST TRUCK (Add Toy) ---
  const handleAddToy = async (e) => {
    e.preventDefault();
    setAddMessage("");
    const token = localStorage.getItem("vip_token");
    try {
      const response = await fetch("http://localhost:8080/toys", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName, price: parseFloat(newPrice) }),
      });
      if (response.ok) {
        setAddMessage("Toy added successfully!");
        setNewName("");
        setNewPrice("");
        fetchToys();
      } else {
        const errorMessage = await response.text();
        setAddMessage("Error: " + errorMessage);
      }
    } catch (err) {
      setAddMessage("Failed to connect.");
    }
  };

  // --- 3. THE DELETE TRUCK (Remove Toy) ---
  const handleDeleteToy = async (id) => {
    const token = localStorage.getItem("vip_token");
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this toy?")) return;
    try {
      const response = await fetch(`http://localhost:8080/toys/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setAddMessage("Toy deleted successfully! 🗑️");
        fetchToys();
      } else {
        setAddMessage("Error: Could not delete toy.");
      }
    } catch (err) {
      setAddMessage("Failed to connect.");
    }
  };

  // --- 4. THE UPDATE TRUCK (Edit Toy) ---

  // A. Turn on Edit Mode
  const startEditing = (toy) => {
    setEditingToyId(toy.id); // Tell React which box to open
    setEditName(toy.name); // Fill the box with the old name
    setEditPrice(toy.price); // Fill the box with the old price
  };

  // B. Send the PUT Request
  const handleUpdateToy = async (id) => {
    const token = localStorage.getItem("vip_token");
    if (!token) return;

    try {
      // Notice it's a PUT request and we put the ID in the URL!
      const response = await fetch(`http://localhost:8080/toys/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName, price: parseFloat(editPrice) }),
      });

      if (response.ok) {
        setAddMessage("Toy updated successfully! ✏️");
        setEditingToyId(null); // Close the edit box
        fetchToys(); // Refresh the toys
      } else {
        const errorMessage = await response.text();
        setAddMessage("Update Error: " + errorMessage);
      }
    } catch (err) {
      setAddMessage("Failed to connect.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in">
      {/* Add Toy Form Card */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 transform transition-all relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <svg
              className="w-6 h-6 text-indigo-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight m-0 drop-shadow-sm">
            New Store
          </h3>
        </div>

        <form
          onSubmit={handleAddToy}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Toy Name"
            value={newName}
            required
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-5 py-3 text-white placeholder-white/70 bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-black/50 transition-all duration-200"
          />
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-bold">
              $
            </span>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newPrice}
              required
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full sm:w-32 pl-8 pr-4 py-3 text-white bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-black/50 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 font-bold text-white transition-all duration-300 transform bg-indigo-600/90 rounded-xl hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 border border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-400 whitespace-nowrap"
          >
            Add Toy
          </button>
        </form>

        {addMessage && (
          <div
            className={`p-4 mt-6 text-sm font-medium border rounded-xl flex items-center gap-3 animate-fade-in ${
              addMessage.includes("Error") || addMessage.includes("Failed")
                ? "bg-red-500/20 text-red-200 border-red-500/30"
                : "bg-green-500/20 text-green-200 border-green-500/30"
            }`}
          >
            <span>{addMessage}</span>
          </div>
        )}
      </div>

      {/* Toy List Section */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10">
        <h2 className="mb-6 text-2xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-sm">
          <svg
            className="w-8 h-8 text-pink-400 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
          Top Inventory
        </h2>

        {error && (
          <div className="p-4 mb-6 text-sm flex items-center gap-2 font-medium text-red-200 bg-red-500/20 border border-red-500/30 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {toys.length === 0 && !error ? (
            <div className="py-12 text-center text-white/50 border-2 border-dashed border-white/20 rounded-xl">
              <p className="text-lg font-bold">
                No toys found. Let's add some! 🚀
              </p>
            </div>
          ) : null}

          {toys.map((toy) => (
            <div
              key={toy.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm hover:shadow-lg hover:bg-white/10 transition-all gap-4 backdrop-blur-sm"
            >
              {/* THE MAGIC SWITCH: Is this toy currently being edited? */}
              {editingToyId === toy.id ? (
                /* --- YES: Show the Input Boxes --- */
                <div className="flex flex-col sm:flex-row gap-3 w-full animate-fade-in">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-4 py-2 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full sm:w-28 pl-7 pr-3 py-2 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleUpdateToy(toy.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white font-bold rounded-lg border border-green-500/50 transition-all shadow-md hover:shadow-green-500/30"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingToyId(null)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/20 transition-all shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* --- NO: Show the normal text and buttons --- */
                <>
                  <div className="text-left w-full sm:w-auto flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-sm">
                      {toy.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-black rounded-full border border-green-500/30 shadow-inner">
                        ${toy.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto gap-3 mt-2 sm:mt-0">
                    <button
                      onClick={() => startEditing(toy)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl border border-amber-500/30 transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteToy(toy.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-xl border border-red-500/30 transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
