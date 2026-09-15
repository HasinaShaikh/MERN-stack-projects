import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiCpu,
  FiHelpCircle,
  FiLogIn,
  FiZap,
  FiFileText,
  FiCheckCircle,
  FiBookOpen,
  FiBarChart2,
  FiUploadCloud,
  FiLayers,
  FiArrowRight,
  FiShield,
  FiClock,
  FiTarget,
  FiMenu,
  FiX
} from "react-icons/fi";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const goToAuth = () => {
    navigate("/auth");
  };

  const faqs = [
    {
      question: "What can AI StudyMate do?",
      answer:
        "AI StudyMate helps students turn study material into notes, summaries, quizzes and flashcards."
    },
    {
      question: "Can I upload PDF study material?",
      answer:
        "Yes. After logging in, you can upload your study PDF from the dashboard."
    },
    {
      question: "Do I need an account?",
      answer:
        "Yes. Your account allows your study material and generated resources to stay organized."
    },
    {
      question: "Can I login with Google?",
      answer:
        "Yes. AI StudyMate supports Google authentication as well as normal email and password login."
    }
  ];

  const closeMobile = () => {
    setMobileMenu(false);
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="home-nav">

        <div className="home-logo" onClick={() => window.scrollTo(0, 0)}>
          <div className="logo-icon">
            <FiZap />
          </div>

          <div className="logo-text">
            <span>AI</span> StudyMate
          </div>
        </div>

        <div className={`home-nav-links ${mobileMenu ? "mobile-open" : ""}`}>

          <a
            href="#home"
            className="nav-item active"
            onClick={closeMobile}
          >
            <FiHome />
            <span>Home</span>
          </a>

          <a
            href="#features"
            className="nav-item"
            onClick={closeMobile}
          >
            <FiGrid />
            <span>Features</span>
          </a>

          <a
            href="#how"
            className="nav-item"
            onClick={closeMobile}
          >
            <FiCpu />
            <span>How It Works</span>
          </a>

          <a
            href="#faq"
            className="nav-item"
            onClick={closeMobile}
          >
            <FiHelpCircle />
            <span>FAQ</span>
          </a>

          <button
            className="mobile-login"
            onClick={() => {
              closeMobile();
              goToAuth();
            }}
          >
            <FiLogIn />
            Login
          </button>

        </div>

        <button className="nav-login" onClick={goToAuth}>
          <FiLogIn />
          <span>Login</span>
        </button>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <FiX /> : <FiMenu />}
        </button>

      </nav>

      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-content">

          <div className="hero-badge">
            <FiZap />
            AI POWERED STUDY ASSISTANT
          </div>

          <h1>
            Turn your study material
            <span> into smarter learning.</span>
          </h1>

          <p>
            Upload your study material and transform it into
            easy-to-understand notes, quizzes and flashcards.
            Study less randomly and prepare more effectively.
          </p>

          <div className="hero-actions">

            <button
              className="primary-btn"
              onClick={goToAuth}
            >
              Get Started
              <FiArrowRight />
            </button>

            <a
              href="#how"
              className="secondary-btn"
            >
              See How It Works
            </a>

          </div>

          <div className="hero-note">
            <FiShield />
            Your study experience stays organized in your account.
          </div>

        </div>

        {/* AI STUDY GENERATOR PREVIEW */}
        <div className="study-preview">

          <div className="preview-glow"></div>

          <div className="study-top">

            <div>
              <span className="preview-label">
                AI STUDY GENERATOR
              </span>

              <h3>
                Turn material into knowledge
              </h3>
            </div>

            <span className="ai-status">
              <i></i> AI Ready
            </span>

          </div>

          <div className="upload-box">

            <div className="upload-symbol">
              <FiUploadCloud />
            </div>

            <div className="upload-text">
              <strong>Upload your PDF</strong>

              <small>
                Lecture notes, textbook or study material
              </small>
            </div>

            <span className="pdf-badge">
              PDF
            </span>

          </div>

          <p className="generate-title">
            What would you like to generate?
          </p>

          <div className="generate-options">

            <div className="generate-option active">

              <span>
                <FiFileText />
              </span>

              <div>
                <strong>Smart Notes</strong>
                <small>Summarize important concepts</small>
              </div>

              <b>✓</b>

            </div>

            <div className="generate-option">

              <span>
                <FiTarget />
              </span>

              <div>
                <strong>Quiz</strong>
                <small>Practice your understanding</small>
              </div>

            </div>

            <div className="generate-option">

              <span>
                <FiLayers />
              </span>

              <div>
                <strong>Flashcards</strong>
                <small>Revise key information</small>
              </div>

            </div>

          </div>

          <button
            className="preview-generate"
            onClick={goToAuth}
          >
            <FiZap />
            Generate with AI
          </button>

          <div className="preview-footer">
            <span>
              <FiClock />
              Fast AI processing
            </span>

            <span>
              <FiCheckCircle />
              Organized results
            </span>
          </div>

        </div>

      </section>

      {/* INTRO */}
      <section className="intro">

        <p>
          Everything you need for smarter exam preparation
        </p>

        <div className="intro-items">

          <span>
            <FiUploadCloud />
            PDF Learning
          </span>

          <span>
            <FiFileText />
            AI Notes
          </span>

          <span>
            <FiTarget />
            Smart Quizzes
          </span>

          <span>
            <FiLayers />
            Flashcards
          </span>

          <span>
            <FiBarChart2 />
            Progress Tracking
          </span>

        </div>

      </section>

      {/* FEATURES */}
      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span style={{ fontSize: "28px" }}> FEATURES</span>

          <h2>
            One workspace.
            <br />
            Multiple ways to learn.
          </h2>

          <p>
            AI StudyMate brings your study tools together
            so you can focus on understanding instead of
            organizing everything manually.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card large">

            <div className="feature-icon">
              <FiFileText />
            </div>

            <h3>AI Notes</h3>

            <p>
              Turn long study material into concise,
              structured and revision-friendly notes.
            </p>

            <span className="feature-link">
              Generate smarter notes <FiArrowRight />
            </span>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              <FiTarget />
            </div>

            <h3>Practice Quiz</h3>

            <p>
              Test your understanding with questions
              based on your study material.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              <FiLayers />
            </div>

            <h3>Flashcards</h3>

            <p>
              Quickly revise definitions, concepts
              and important points.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              <FiBookOpen />
            </div>

            <h3>Study Library</h3>

            <p>
              Keep your generated learning material
              organized in one place.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              <FiBarChart2 />
            </div>

            <h3>Progress</h3>

            <p>
              Keep track of your learning activity
              and revision progress.
            </p>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section
        className="how-section"
        id="how"
      >

        <div className="section-heading center">

          <span style={{ fontSize: "28px" }}>HOW IT WORKS</span>

          <h2>
            From PDF to preparation
            <br />
            in a few simple steps.
          </h2>

        </div>

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              <FiUploadCloud />
            </div>

            <h3>Upload</h3>

            <p>
              Upload your lecture notes,
              textbook or study PDF.
            </p>

          </div>

          <div className="step-line"></div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              <FiCpu />
            </div>

            <h3>Generate</h3>

            <p>
              AI processes your material and
              creates useful learning resources.
            </p>

          </div>

          <div className="step-line"></div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              <FiBookOpen />
            </div>

            <h3>Study</h3>

            <p>
              Revise using notes, quizzes
              and flashcards.
            </p>

          </div>

        </div>

      </section>

      {/* BENEFITS */}
      <section className="benefits">

        <div className="benefit-content">

          <span>WHY AI STUDYMATE?</span>

          <h2>
            Spend less time
            organizing.
            <br />
            Spend more time
            learning.
          </h2>

          <p>
            Instead of switching between different tools,
            keep your study resources together and focus
            on your preparation.
          </p>

          <button
            className="primary-btn"
            onClick={goToAuth}
          >
            Start Learning
            <FiArrowRight />
          </button>

        </div>

        <div className="benefit-list">

          <div>
            <span>
              <FiCheckCircle />
            </span>

            <div>
              <strong>Save preparation time</strong>
              <p>
                Quickly turn large material into useful resources.
              </p>
            </div>

          </div>

          <div>
            <span>
              <FiCheckCircle />
            </span>

            <div>
              <strong>Learn in different ways</strong>
              <p>
                Use notes, quizzes and flashcards for revision.
              </p>
            </div>

          </div>

          <div>
            <span>
              <FiCheckCircle />
            </span>

            <div>
              <strong>Keep everything organized</strong>
              <p>
                Access your learning resources from your dashboard.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section
        className="faq-section"
        id="faq"
      >

        <div className="section-heading center">

          <span style={{ fontSize: "28px" }}>FAQ</span>
          <h2  style={{ fontSize: "20px" }}>
            Questions, answered.
          </h2>

        </div>

        <div className="faq-list">

          {faqs.map((faq, index) => (

            <div
              className={`faq-item ${
                openFaq === index ? "open" : ""
              }`}
              key={index}
            >

              <button
                onClick={() =>
                  setOpenFaq(
                    openFaq === index ? null : index
                  )
                }
              >

                <span>{faq.question}</span>

                <span className="faq-plus">
                  {openFaq === index ? "−" : "+"}
                </span>

              </button>

              {openFaq === index && (
                <p>{faq.answer}</p>
              )}

            </div>

          ))}

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="final-cta">

        <div>

          <span>READY TO STUDY SMARTER?</span>

          <h2>
            Your next study session
            can start here.
          </h2>

          <p>
            Create your account and start building
            smarter study resources.
          </p>

          <button
            className="primary-btn"
            onClick={goToAuth}
          >
            Get Started Free
            <FiArrowRight />
          </button>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-brand">

          <h3>
            <FiZap />
            AI StudyMate
          </h3>

          <p>
            Your intelligent study companion
            for better exam preparation.
          </p>

        </div>

        <div className="footer-links">

          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#faq">FAQ</a>

          <button onClick={goToAuth}>
            Login
          </button>

        </div>

        <div className="copyright">
          © 2026 AI StudyMate. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;