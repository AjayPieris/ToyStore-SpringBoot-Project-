import { useState } from "react";

// THE FIX: We accept the onRegisterSuccess walkie-talkie here
export default function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          role: "USER",
        }),
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
    <div className="w-full p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 transform transition-all relative z-10">
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            ></path>
          </svg>
        </div>
      </div>

      <h2 className="mb-8 text-3xl font-black text-center text-white tracking-tight drop-shadow-sm">
        Create Account
      </h2>

      <form onSubmit={handleRegister} className="flex flex-col space-y-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Choose a Username"
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 text-white placeholder-white/70 bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-black/50 transition-all duration-200"
          />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Choose a Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 text-white placeholder-white/70 bg-black/30 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-black/50 transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-2 font-bold text-pink-900 transition-all duration-300 transform bg-white rounded-xl hover:bg-pink-50 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] focus:outline-none focus:ring-4 focus:ring-pink-300"
        >
          Sign Up
        </button>
      </form>

      {message && (
        <div
          className={`p-4 mt-6 text-sm font-medium border rounded-xl flex items-center gap-3 animate-fade-in shadow-lg ${
            message.includes("Redirecting")
              ? "bg-green-500/80 text-white border-green-400/50 backdrop-blur-sm"
              : "bg-red-500/80 text-white border-red-400/50 backdrop-blur-sm"
          }`}
        >
          {message.includes("Redirecting") ? (
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          ) : (
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
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
