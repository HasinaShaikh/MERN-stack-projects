import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { serverUrl } from "../App";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleAuth = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // 1. Open Google login popup
      const response = await signInWithPopup(auth, provider);

      // 2. Get Google user
      const user = response.user;

      const name = user.displayName;
      const email = user.email;

      console.log("Google User:", user);
      console.log("Name:", name);
      console.log("Email:", email);

      // 3. Send user data to backend
      const result = await axios.post(
        serverUrl + "/api/auth/google",
        {
          name: name,
          email: email,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Backend Response:", result.data);

      // 4. Save token if backend sends one
      if (result.data.token) {
  localStorage.setItem("token", result.data.token);
}

if (result.data.user) {
  localStorage.setItem(
    "user",
    JSON.stringify(result.data.user)
  );
}

alert("Google login successful!");

navigate("/dashboard");
    } catch (error) {
      console.error("GOOGLE ERROR:", error);

      if (error.code === "auth/popup-closed-by-user") {
        console.log("Google popup was closed.");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.log("Google popup request was cancelled.");
      } else if (error.response) {
        console.log("Backend Error:", error.response.data);
      } else {
        console.log("Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // NORMAL LOGIN / REGISTER
  // =========================
 const handleSubmit = async (e) => {
  e.preventDefault();

  const url = isLogin
    ? serverUrl + "/api/auth/login"
    : serverUrl + "/api/auth/register";

  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(formData),
    });

    const data = await response.json();

    console.log("Backend response:", data);

    if (!response.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    // Save JWT
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // Save user information
    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    alert(
      isLogin
        ? "Login successful!"
        : "Account created successfully!"
    );

    // Go to dashboard
    navigate("/dashboard");

  } catch (error) {
    console.error("AUTH ERROR:", error);

    alert(
      "Unable to connect to server. Make sure the backend is running."
    );
  }
};


  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1>AI StudyMate</h1>

          <p>
            Your intelligent study companion for
            notes, revision and exam preparation.
          </p>

          <div className="feature">
            <span>✓</span>
            <p>Generate AI-powered study notes</p>
          </div>

          <div className="feature">
            <span>✓</span>
            <p>Create quick revision material</p>
          </div>

          <div className="feature">
            <span>✓</span>
            <p>Study smarter and save time</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">

          <h2>
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          <p className="subtitle">
            {isLogin
              ? "Login to continue your learning journey"
              : "Create your account to get started"}
          </p>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            {!isLogin && (
              <div className="input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            {/* EMAIL */}
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={
                  isLogin
                    ? "current-password"
                    : "new-password"
                }
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            className="google-button"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <FcGoogle />

            {loading
              ? "Signing in..."
              : "Continue with Google"}
          </button>

          {/* SWITCH */}
          <p className="switch-text">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              className="switch-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Auth;