import { useState } from 'react';
import Login from './page/Login.jsx';
import Register from './page/Register.jsx';

export default function App() {
    // React remembers which page we are looking at (defaults to 'login')
    const [currentPage, setCurrentPage] = useState('login');

    return (
        <div style={{ fontFamily: 'sans-serif' }}>

            {/* Navigation Buttons */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    onClick={() => setCurrentPage('login')}
                    style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}
                >
                    Go to Login
                </button>

                <button
                    onClick={() => setCurrentPage('register')}
                    style={{ padding: '10px', cursor: 'pointer' }}
                >
                    Go to Sign Up
                </button>
            </div>

            {/* The Magic Switch: Show the correct component based on the button clicked */}
            {currentPage === 'login' ? <Login /> : <Register />}

        </div>
    );
}