import { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (response.ok) {
        const data = await response.text();
        localStorage.setItem("vip_token", data);
        onLoginSuccess();
      } else {
        setError("Login failed. Check your username and password.");
      }
    } catch (error) {
      setError("Cannot connect to the server.");
    }
  };

  // --- THE MAGIC IS DOWN HERE ---
  return (
    <div className="w-full p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 transform transition-all relative z-10">
      {/* The main card with glassmorphism */}

      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border border-white/30 shadow-inner">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            ></path>
          </svg>
        </div>
      </div>

      <h2 className="mb-8 text-3xl font-black text-center text-white tracking-tight drop-shadow-sm">
        Welcome Back
      </h2>

      <form onSubmit={handleLogin} className="flex flex-col space-y-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 text-white placeholder-white/70 bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-black/50 transition-all duration-200"
          />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 text-white placeholder-white/70 bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-black/50 transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-2 font-bold text-indigo-900 transition-all duration-300 transform bg-white rounded-xl hover:bg-indigo-50 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Sign In
        </button>
      </form>

      {error && (
        <div className="p-4 mt-6 text-sm font-medium text-white bg-red-500/80 backdrop-blur-sm border border-red-400/50 rounded-xl flex items-center gap-3 animate-fade-in shadow-lg">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
