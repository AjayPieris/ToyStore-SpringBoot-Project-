import { useState } from 'react';

// THE FIX: We accept the onRegisterSuccess walkie-talkie here
export default function Register({ onRegisterSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password, role: "USER" })
            });

            if (response.ok) {
                const data = await response.text();
                setMessage(data + " Redirecting to login...");

                // THE FIX: Wait 1.5 seconds so they can read the message, then teleport!
                setTimeout(() => {
                    onRegisterSuccess();
                }, 1500);
            } else {
                setMessage("Registration failed. That username might be taken.");
            }

        } catch (error) {
            console.error("The truck crashed!", error);
            setMessage("Error connecting to the server.");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px', border: '1px solid black', borderRadius: '10px', width: '350px', margin: '50px auto' }}>
            <h2>Sign Up for the Toy Store</h2>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Choose a Username" required onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Choose a Password" required onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Create Account</button>
            </form>

            {message && <div style={{ marginTop: '20px', color: 'blue', fontWeight: 'bold' }}>{message}</div>}
        </div>
    );
}