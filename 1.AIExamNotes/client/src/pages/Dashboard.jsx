import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  alert("Logged out successfully!");

  navigate("/auth");
};

  return (
    <div className="dashboard">

      {/* Navbar */}

      <nav className="dashboard-nav">

        <h2>✨ AI StudyMate</h2>

        <div>
          <span>
            {user?.name || "Student"}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

      </nav>


      {/* Main */}

      <main className="dashboard-main">

        <div className="welcome">

          <div>
            <p>Welcome back 👋</p>

            <h1>
              {user?.name || "Student"}
            </h1>

            <span>
              Turn your study material into
              smart learning resources.
            </span>
          </div>

        </div>


        {/* Stats */}

        <div className="stats">

          <div className="stat-card">
            <span>📄</span>
            <h3>0</h3>
            <p>PDFs Uploaded</p>
          </div>

          <div className="stat-card">
            <span>📝</span>
            <h3>0</h3>
            <p>Notes Created</p>
          </div>

          <div className="stat-card">
            <span>🧠</span>
            <h3>0</h3>
            <p>Questions Generated</p>
          </div>

        </div>


        {/* Upload */}

        <section className="upload-section">

          <div className="upload-icon">
            📄
          </div>

          <h2>
            Create AI-Powered Notes
          </h2>

          <p>
            Upload your study PDF and let
            AI turn it into easy-to-revise notes.
          </p>

          <input
            type="file"
            id="pdf"
            accept=".pdf"
          />

          <label htmlFor="pdf">
            Choose PDF
          </label>

          <button className="generate-btn">
            ✨ Generate AI Notes
          </button>

        </section>


        {/* Quick Actions */}

        <section className="quick-section">

          <h2>Quick Actions</h2>

          <div className="quick-cards">

            <div className="quick-card">
              <span>📝</span>
              <h3>My Notes</h3>
              <p>
                View your previously generated notes.
              </p>
            </div>

            <div className="quick-card">
              <span>🧠</span>
              <h3>Practice Questions</h3>
              <p>
                Practice questions from your material.
              </p>
            </div>

            <div className="quick-card">
              <span>📚</span>
              <h3>Study History</h3>
              <p>
                View your previous study activity.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;