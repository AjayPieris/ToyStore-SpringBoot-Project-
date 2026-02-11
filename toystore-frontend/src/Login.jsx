import { useState } from 'react';

export default function Login() {
    // 1. React's Memory (State)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(''); // To show the token on the screen later

    // 2. The Delivery Truck (Sending data to Spring Boot)
    const handleLogin = async (e) => {
        e.preventDefault(); // Stops the page from refreshing when you click submit

        console.log("Sending the truck to Spring Boot...");

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Pack the box with the username and password React memorized
                body: JSON.stringify({ username: username, password: password })
            });

            // The API hands back the long token string
            const data = await response.text();

            console.log("The Factory said:", data);
            setToken(data); // Save the token to React's memory!
            localStorage.setItem('vip_token', data);

        } catch (error) {
            console.error("The truck crashed!", error);
        }
    };

    // 3. The Storefront UI (What the user sees)
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Welcome to the Toy Store!</h2>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Log In to get Token</button>
            </form>

            {/* If we get a token, show it on the screen! */}
            {token && (
                <div style={{ marginTop: '20px', color: 'green', wordWrap: 'break-word' }}>
                    <strong>Success! Your VIP Token:</strong> <br/> {token}
                </div>
            )}
        </div>
    );
}