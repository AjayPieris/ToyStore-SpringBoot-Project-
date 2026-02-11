import { useState } from 'react';

// 1. THE WALKIE-TALKIE: Notice the { onLoginSuccess } right here!
export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            });

            if (response.ok) {
                const data = await response.text();
                localStorage.setItem('vip_token', data);

                // 2. THE TELEPORT TRIGGER: This flips the switch in App.jsx!
                onLoginSuccess();
            } else {
                setError("Login failed. Check your username and password.");
            }
        } catch (error) {
            console.error("The truck crashed!", error);
            setError("Cannot connect to the server.");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Front Desk Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '10px' }}>
                <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>Log In</button>
            </form>
            {error && <div style={{ marginTop: '20px', color: 'red', fontWeight: 'bold' }}>{error}</div>}
        </div>
    );
}