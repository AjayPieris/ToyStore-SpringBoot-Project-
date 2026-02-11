import { useState, useEffect } from 'react';

export default function ToyList() {
    const [toys, setToys] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchToys();
    }, []);

    const fetchToys = async () => {
        // Grab the VIP token from the safe
        const token = localStorage.getItem('vip_token');

        if (!token) {
            setError("You don't have a VIP Token! Please log in first.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/toys', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Show the Bouncer the token!
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setToys(data);
            } else {
                setError("The Bouncer didn't like your token. (Error " + response.status + ")");
            }
        } catch (err) {
            console.error("The truck crashed!", err);
            setError("Could not connect to the server.");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <h2>Available Toys</h2>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                {toys.length === 0 && !error ? <p>Loading toys (or no toys in database)...</p> : null}

                {toys.map((toy) => (
                    <div key={toy.id} style={{ border: '2px solid #333', padding: '15px', borderRadius: '8px', width: '300px', backgroundColor: '#f9f9f9' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{toy.name}</h3>
                        <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>${toy.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}