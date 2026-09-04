import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUploadCloud,
  FiFileText,
  FiBookOpen,
  FiZap,
  FiCheckCircle,
  FiArrowRight,
  FiPlayCircle,
} from "react-icons/fi";
import { MdAutoAwesome } from "react-icons/md";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}
      <nav className="home-navbar">

        <div className="home-logo">
          <div className="logo-icon">
            <MdAutoAwesome />
          </div>

          <span>
            AI<span>StudyMate</span>
          </span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button
            className="nav-login"
            onClick={() => navigate("/auth")}
          >
            Login
          </button>

          <button
            className="nav-signup"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </button>
        </div>

      </nav>


      {/* ================= HERO ================= */}
      <section className="hero">

        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="hero-content">

          <div className="ai-badge">
            <MdAutoAwesome />
            AI-Powered Learning Assistant
          </div>

          <h1>
            Turn Your PDFs Into
            <span> Smart Study Notes</span>
          </h1>

          <p>
            Upload your study material and let AI transform
            lengthy PDFs into clear, concise and exam-ready
            notes in seconds.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/notes")}
            >
              <FiUploadCloud />
              Generate AI Notes
              <FiArrowRight />
            </button>

            <button className="secondary-btn">
              <FiPlayCircle />
              See How It Works
            </button>

          </div>

          <div className="hero-trust">
            <FiCheckCircle />
            Fast AI processing
            <FiCheckCircle />
            Exam focused
            <FiCheckCircle />
            Easy to use
          </div>

        </div>


        {/* ================= AI PREVIEW ================= */}
        <div className="hero-preview">

          <div className="preview-window">

            <div className="window-top">
              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="window-title">
                AI Notes Generator
              </div>
            </div>

            <div className="preview-body">

              <div className="upload-card">

              
             <label className="upload-btn">
  <FiUploadCloud />
  <input
    type="file"
    accept="application/pdf"
    hidden
  />
  Upload your PDF
</label>

                <p>
                  Drop your study material here
                </p>

                <label>
                  Choose PDF
                </label>

              </div>

              <div className="ai-processing">

                <div className="processing-header">
                  <MdAutoAwesome />
                  AI Generated Notes
                </div>

                <div className="fake-line long"></div>
                <div className="fake-line medium"></div>
                <div className="fake-line short"></div>

                <div className="note-box">
                  <FiCheckCircle />

                  <div>
                    <strong>Key Concepts</strong>
                    <p>
                      Important concepts extracted from
                      your study material.
                    </p>
                  </div>
                </div>

                <div className="note-box">
                  <FiZap />

                  <div>
                    <strong>Quick Revision</strong>
                    <p>
                      Concise points for faster exam preparation.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="features-section" id="features">

        <div className="section-heading">

          <div className="small-heading">
            <MdAutoAwesome />
            POWERFUL FEATURES
          </div>

          <h2>
            Everything You Need To
            <span> Study Smarter</span>
          </h2>

          <p>
            AIStudyMate helps you convert your study material
            into useful exam preparation resources.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <FiFileText />
            </div>

            <h3>PDF to Notes</h3>

            <p>
              Upload your PDF and automatically generate
              structured study notes using AI.
            </p>

            <a href="#how-it-works">
              Learn more <FiArrowRight />
            </a>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <FiZap />
            </div>

            <h3>AI Summarization</h3>

            <p>
              Convert lengthy chapters into short and
              easy-to-understand summaries.
            </p>

            <a href="#how-it-works">
              Learn more <FiArrowRight />
            </a>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <FiBookOpen />
            </div>

            <h3>Exam Ready Notes</h3>

            <p>
              Get important concepts, definitions and
              key points designed for quick revision.
            </p>

            <a href="#how-it-works">
              Learn more <FiArrowRight />
            </a>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <FiCheckCircle />
            </div>

            <h3>Quick Revision</h3>

            <p>
              Save time with concise notes that help you
              revise important topics quickly.
            </p>

            <a href="#how-it-works">
              Learn more <FiArrowRight />
            </a>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section" id="how-it-works">

        <div className="section-heading">

          <div className="small-heading">
            <MdAutoAwesome />
            SIMPLE PROCESS
          </div>

          <h2>
            Study In
            <span> 3 Easy Steps</span>
          </h2>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <FiUploadCloud />

            <h3>Upload</h3>

            <p>
              Upload your lecture notes, textbook or
              study PDF.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <MdAutoAwesome />

            <h3>Let AI Work</h3>

            <p>
              Our AI analyzes your document and extracts
              the most important information.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <FiBookOpen />

            <h3>Start Studying</h3>

            <p>
              Read your generated notes and prepare
              for your exams.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="cta-box">

          <div className="cta-icon">
            <MdAutoAwesome />
          </div>

          <h2>
            Ready To Study
            <span> Smarter?</span>
          </h2>

          <p>
            Upload your first PDF and let AI create
            your study notes.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/notes")}
          >
            Start Generating Notes
            <FiArrowRight />
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="home-footer">

        <div className="footer-logo">
          <div className="logo-icon">
            <MdAutoAwesome />
          </div>

          AI<span>StudyMate</span>
        </div>

        <p>
          Your intelligent AI-powered study companion.
        </p>

        <div className="footer-bottom">
          © 2026 AIStudyMate. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;