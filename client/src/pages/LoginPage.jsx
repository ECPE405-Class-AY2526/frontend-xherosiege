import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuthStore from "../utils/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) {
      //setError("Invalid credentials");
      toast.error("Invalid credentials");
    } else {
      setError("");
      toast.success("Login successful!");
      navigate("/dashboard");
      // you may declare or place the role in this line. once you have it from the backend
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950">
      <div
        className="absolute inset-0 -z-10 h-full w-full
        bg-[linear-gradient(to_right,#6b7280_1px,transparent_1px),linear-gradient(to_bottom,#6b7280_1px,transparent_1px)]
        bg-[size:20px_20px]
        [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]"
      />
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-slate-900 bg-opacity-80 rounded-xl shadow-xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-error text-center mb-2">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center mt-4 text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-400 underline">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
