import { useState } from 'react';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // To show "User Created" or errors

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // We send the username, password, and give them the default role of "USER"
                body: JSON.stringify({ username: username, password: password, role: "USER" })
            });

            const data = await response.text(); // Spring Boot sends back a simple string message
            setMessage(data); // Show the message on the screen!

        } catch (error) {
            console.error("The truck crashed!", error);
            setMessage("Error connecting to the server.");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', border: '1px solid black', borderRadius: '10px', width: '350px', margin: '50px auto' }}>
            <h2>Sign Up for the Toy Store</h2>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Choose a Username"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Choose a Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}