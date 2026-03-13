import { useState, useEffect } from 'react';

export default function ToyList() {
    const [toys, setToys] = useState([]);
    const [error, setError] = useState('');

    // Memory for Adding a Toy
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [addMessage, setAddMessage] = useState('');

    // NEW: Memory for Updating a Toy
    const [editingToyId, setEditingToyId] = useState(null); // Remembers WHICH toy is being edited
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');

    useEffect(() => {
        fetchToys();
    }, []);

    // --- 1. THE GET TRUCK (Fetch Toys) ---
    const fetchToys = async () => {
        const token = localStorage.getItem('vip_token');
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8080/toys', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setToys(data);
            }
        } catch (err) { console.error(err); }
    };

    // --- 2. THE POST TRUCK (Add Toy) ---
    const handleAddToy = async (e) => {
        e.preventDefault();
        setAddMessage('');
        const token = localStorage.getItem('vip_token');
        try {
            const response = await fetch('http://localhost:8080/toys', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, price: parseFloat(newPrice) })
            });
            if (response.ok) {
                setAddMessage("Toy added successfully!");
                setNewName(''); setNewPrice('');
                fetchToys();
            } else {
                const errorMessage = await response.text();
                setAddMessage("Error: " + errorMessage);
            }
        } catch (err) { setAddMessage("Failed to connect."); }
    };

    // --- 3. THE DELETE TRUCK (Remove Toy) ---
    const handleDeleteToy = async (id) => {
        const token = localStorage.getItem('vip_token');
        if (!token) return;
        if (!window.confirm("Are you sure you want to delete this toy?")) return;
        try {
            const response = await fetch(`http://localhost:8080/toys/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setAddMessage("Toy deleted successfully! 🗑️");
                fetchToys();
            } else { setAddMessage("Error: Could not delete toy."); }
        } catch (err) { setAddMessage("Failed to connect."); }
    };

    // --- 4. THE UPDATE TRUCK (Edit Toy) ---

    // A. Turn on Edit Mode
    const startEditing = (toy) => {
        setEditingToyId(toy.id); // Tell React which box to open
        setEditName(toy.name);   // Fill the box with the old name
        setEditPrice(toy.price); // Fill the box with the old price
    };

    // B. Send the PUT Request
    const handleUpdateToy = async (id) => {
        const token = localStorage.getItem('vip_token');
        if (!token) return;

        try {
            // Notice it's a PUT request and we put the ID in the URL!
            const response = await fetch(`http://localhost:8080/toys/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: editName, price: parseFloat(editPrice) })
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
        <div style={{ textAlign: 'center', marginTop: '10px', width: '100%', maxWidth: '500px' }}>

            {/* Add Toy Form */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <h3 style={{ marginTop: 0 }}>➕ Add a New Toy</h3>
                <form onSubmit={handleAddToy} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <input type="text" placeholder="Toy Name" value={newName} required onChange={(e) => setNewName(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <input type="number" step="0.01" placeholder="Price" value={newPrice} required onChange={(e) => setNewPrice(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }} />
                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                </form>
                {addMessage && <p style={{ color: addMessage.includes('Error') ? 'red' : 'green', fontWeight: 'bold', fontSize: '14px' }}>{addMessage}</p>}
            </div>

            {/* Toy List */}
            <h2>Available Toys</h2>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                {toys.length === 0 && !error ? <p>Loading toys (or no toys in database)...</p> : null}

                {toys.map((toy) => (
                    <div key={toy.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '100%', backgroundColor: '#fff', boxShadow: '0px 2px 4px rgba(0,0,0,0.05)' }}>

                        {/* THE MAGIC SWITCH: Is this toy currently being edited? */}
                        {editingToyId === toy.id ? (

                            /* --- YES: Show the Input Boxes --- */
                            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '5px', width: '100px' }} />
                                <input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} style={{ padding: '5px', width: '80px' }} />

                                <button onClick={() => handleUpdateToy(toy.id)} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Save</button>
                                <button onClick={() => setEditingToyId(null)} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                            </div>

                        ) : (

                            /* --- NO: Show the normal text and buttons --- */
                            <>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{toy.name}</h3>
                                    <p style={{ margin: '0', fontSize: '18px', color: '#28a745', fontWeight: 'bold' }}>${toy.price.toFixed(2)}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {/* Edit Button */}
                                    <button onClick={() => startEditing(toy)} style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        ✏️ Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button onClick={() => handleDeleteToy(toy.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        🗑️ Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}