import { useState, useEffect } from 'react';
import Login from './page/Login';
import Register from './page/Register';
import ToyList from './page/ToyList';

export default function App() {
    // 1. We ask: "Is this user allowed inside?" (Defaults to false)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 2. We ask: "Which parking lot line are they in?" (Login or Register)
    const [authPage, setAuthPage] = useState('login');

    // 3. React Superpower: When they first visit the website, check their pockets!
    useEffect(() => {
        const token = localStorage.getItem('vip_token');
        if (token) {
            setIsAuthenticated(true); // They have a token! Let them in immediately!
        }
    }, []);

    // 4. The Logout Button (Rips up the token and kicks them out)
    const handleLogout = () => {
        localStorage.removeItem('vip_token');
        setIsAuthenticated(false);
        setAuthPage('login');
    };

    // ==========================================
    // VIEW 1: THE PARKING LOT (NOT LOGGED IN)
    // ==========================================
    if (!isAuthenticated) {
        return (
            <div style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                <h1>Welcome to The Toy Store</h1>

                {/* Toggle between Login and Sign Up */}
                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => setAuthPage('login')}
                        style={{ marginRight: '10px', padding: '10px', cursor: 'pointer', backgroundColor: authPage === 'login' ? '#ddd' : 'white' }}>
                        Front Desk (Login)
                    </button>
                    <button
                        onClick={() => setAuthPage('register')}
                        style={{ padding: '10px', cursor: 'pointer', backgroundColor: authPage === 'register' ? '#ddd' : 'white' }}>
                        New Member (Sign Up)
                    </button>
                </div>

                {/* Show the correct desk based on the button they clicked */}
                {authPage === 'login' ? (
                    <Login onLoginSuccess={() => setIsAuthenticated(true)} /> // Teleport inside!
                ) : (
                    <Register onRegisterSuccess={() => setAuthPage('login')} /> // Teleport to Login!
                )}
            </div>
        );
    }

    // ==========================================
    // VIEW 2: THE REAL WEBSITE (LOGGED IN)
    // ==========================================
    return (
        <div style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* --- NAVBAR --- */}
            <nav style={{ backgroundColor: '#333', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>🧸 Toy Store Dashboard</h2>
                <button
                    onClick={handleLogout}
                    style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Log Out
                </button>
            </nav>

            {/* --- MAIN CONTENT (CENTER) --- */}
            <main style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', backgroundColor: '#f4f4f9' }}>
                {/* We place the ToyList right in the middle of the room */}
                <ToyList />
            </main>

            {/* --- FOOTER --- */}
            <footer style={{ backgroundColor: '#222', color: '#aaa', textAlign: 'center', padding: '15px', marginTop: 'auto' }}>
                <p style={{ margin: 0 }}>&copy; 2026 Toy Store API. Built by a Spring Boot Master.</p>
            </footer>

        </div>
    );
}