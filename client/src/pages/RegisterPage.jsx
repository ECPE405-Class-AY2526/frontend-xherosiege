import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import api from "../utils/axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await api.post("/users/register", {
        username,
        email,
        password,
      });
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
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
        onSubmit={handleSubmit}
        className="relative z-10 bg-slate-900 bg-opacity-80 rounded-xl shadow-xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Register
        </h2>
        <input
          type="text"
          placeholder="Username"
          className="px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Register
        </button>
        <div className="text-center mt-4 text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
