import { useState, useEffect } from "react";
import Login from "./page/Login";
import Register from "./page/Register";
import ToyList from "./page/ToyList";
import boxLogo from "./assets/box.png";
import backgroundImg from "./assets/background.jpg";
import insideImg from "./assets/inside.jpg";

export default function App() {
  // 1. We ask: "Is this user allowed inside?" (Defaults to false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. We ask: "Which parking lot line are they in?" (Login or Register)
  const [authPage, setAuthPage] = useState("login");

  // 3. React Superpower: When they first visit the website, check their pockets!
  useEffect(() => {
    const token = localStorage.getItem("vip_token");
    if (token) {
      setIsAuthenticated(true); // They have a token! Let them in immediately!
    }
  }, []);

  // 4. The Logout Button (Rips up the token and kicks them out)
  const handleLogout = () => {
    localStorage.removeItem("vip_token");
    setIsAuthenticated(false);
    setAuthPage("login");
  };

  // ==========================================
  // VIEW 1: THE PARKING LOT (NOT LOGGED IN)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center animate-fade-in p-6 bg-cover bg-center bg-fixed w-full"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-0"></div>

        <div className="z-10 flex flex-col items-center">
          <h1
            className="text-5xl md:text-6xl font-extrabold text-white mb-10 drop-shadow-md animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Welcome to The Toy Store
          </h1>

          {/* Toggle between Login and Sign Up */}
          <div
            className="flex space-x-4 mb-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <button
              onClick={() => setAuthPage("login")}
              className={`px-8 py-3 rounded-full font-bold shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300 border-2 ${authPage === "login" ? "bg-indigo-600 border-indigo-600 text-white" : "bg-black/50 border-white/30 backdrop-blur-md text-white hover:bg-black/70"}`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthPage("register")}
              className={`px-8 py-3 rounded-full font-bold shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-pink-300 border-2 ${authPage === "register" ? "bg-pink-600 border-pink-600 text-white" : "bg-black/50 border-white/30 backdrop-blur-md text-white hover:bg-black/70"}`}
            >
              Sign Up
            </button>
          </div>

          {/* Show the correct desk based on the button they clicked */}
          <div
            className="w-full max-w-md animate-slide-up mt-4"
            style={{ animationDelay: "0.3s" }}
          >
            {authPage === "login" ? (
              <Login onLoginSuccess={() => setIsAuthenticated(true)} />
            ) : (
              <Register onRegisterSuccess={() => setAuthPage("login")} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE REAL WEBSITE (LOGGED IN)
  // ==========================================
  return (
    <div
      className="min-h-screen flex flex-col font-sans animate-fade-in bg-cover bg-center bg-fixed w-full relative"
      style={{ backgroundImage: `url(${insideImg})` }}
    >
      {/* Darkened overlay to make white text perfectly clear */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* --- FLOATING WATER 3D NAVBAR --- */}
        <div className="sticky top-4 md:top-6 z-50 w-full px-4 md:px-8 max-w-7xl mx-auto">
          <nav className="bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-white/20 rounded-3xl transition-all duration-300 relative overflow-hidden">
            {/* Glossy inner reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-3xl pointer-events-none"></div>

            <div className="relative w-full mx-auto px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-black text-white drop-shadow-lg flex items-center gap-3">
                <img
                  src={boxLogo}
                  alt="Toy Box"
                  className="w-10 h-10 animate-bounce object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                  style={{ animationDuration: "2s" }}
                />
                Toy Store
              </h2>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.5)] transform hover:-translate-y-1 active:translate-y-0 border border-red-400/50 backdrop-blur-sm flex items-center justify-center group"
              >
                <svg
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* --- MAIN CONTENT (CENTER) --- */}
        <main
          className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <ToyList />
        </main>

        {/* --- FOOTER --- */}
        <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-auto shadow-inner">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-white/60 font-bold text-sm transition-opacity hover:opacity-100 opacity-80">
            <p>&copy; 2026 Toy Store API. Built by a Spring Boot Master.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
