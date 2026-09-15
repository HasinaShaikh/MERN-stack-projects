import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiLayers,
  FiHelpCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowLeft,
  FiAward
} from "react-icons/fi";

import { serverUrl } from "../config";
import "./Progress.css";


const Progress = () => {

  const navigate = useNavigate();

  const [progress, setProgress] = useState({
    totalMaterials: 0,
    totalFlashcardSets: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ================= GET PROGRESS =================

  const fetchProgress = async () => {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        alert("Please login again.");

        navigate("/auth");

        return;
      }


      setLoading(true);
      setError("");


      const response = await fetch(
        `${serverUrl}/api/progress`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load progress"
        );
      }


      setProgress(data);

    } catch (error) {

      console.error(
        "Progress Error:",
        error
      );

      setError(
        error.message ||
        "Unable to load progress"
      );

    } finally {

      setLoading(false);
    }
  };


  // ================= LOAD PAGE =================

  useEffect(() => {

    fetchProgress();

  }, []);


  // ================= SCORE =================

  const averageScore =
    progress.averageScore || 0;


  return (

    <div className="progress-page">


      {/* ================= HEADER ================= */}

      <header className="progress-header">

        <div className="progress-logo">

          <div className="progress-logo-icon">
            AI
          </div>

          <div>

            <h2>
              AI StudyMate
            </h2>

            <p>
              Smart Study Assistant
            </p>

          </div>

        </div>


        <button
          className="progress-dashboard-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Dashboard
        </button>

      </header>


      {/* ================= MAIN ================= */}

      <main className="progress-container">


        {/* ================= TOP ================= */}

        <div className="progress-top">

          <div>

            <p className="progress-label">
              LEARNING JOURNEY
            </p>

            <h1>
              Your Progress
            </h1>

            <p className="progress-description">
              Track your study materials,
              flashcards and quiz performance
              in one place.
            </p>

          </div>


          <button
            className="progress-back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>

        </div>


        {/* ================= LOADING ================= */}

        {loading && (

          <div className="progress-loading">

            <div className="progress-spinner"></div>

            <h3>
              Loading your progress...
            </h3>

            <p>
              Getting your latest study
              activity.
            </p>

          </div>

        )}


        {/* ================= ERROR ================= */}

        {!loading && error && (

          <div className="progress-error">

            <h3>
              Unable to load progress
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchProgress}
            >
              Try Again
            </button>

          </div>

        )}


        {/* ================= CONTENT ================= */}

        {!loading && !error && (

          <>

            {/* ================= STAT CARDS ================= */}

            <div className="progress-stats">


              {/* MATERIALS */}

              <div className="progress-card">

                <div className="progress-card-icon">
                  <FiBookOpen />
                </div>

                <div>

                  <p>
                    Study Materials
                  </p>

                  <h2>
                    {progress.totalMaterials}
                  </h2>

                </div>

              </div>


              {/* FLASHCARDS */}

              <div className="progress-card">

                <div className="progress-card-icon">
                  <FiLayers />
                </div>

                <div>

                  <p>
                    Flashcard Sets
                  </p>

                  <h2>
                    {progress.totalFlashcardSets}
                  </h2>

                </div>

              </div>


              {/* QUIZZES */}

              <div className="progress-card">

                <div className="progress-card-icon">
                  <FiHelpCircle />
                </div>

                <div>

                  <p>
                    Total Quizzes
                  </p>

                  <h2>
                    {progress.totalQuizzes}
                  </h2>

                </div>

              </div>


              {/* COMPLETED */}

              <div className="progress-card">

                <div className="progress-card-icon">
                  <FiCheckCircle />
                </div>

                <div>

                  <p>
                    Completed Quizzes
                  </p>

                  <h2>
                    {progress.completedQuizzes}
                  </h2>

                </div>

              </div>

            </div>


            {/* ================= QUIZ PERFORMANCE ================= */}

            <div className="performance-section">


              <div className="performance-header">

                <div>

                  <p className="section-label">
                    QUIZ PERFORMANCE
                  </p>

                  <h2>
                    Average Score
                  </h2>

                </div>


                <div className="performance-icon">
                  <FiTrendingUp />
                </div>

              </div>


              <div className="score-content">


                <div className="score-circle">

                  <div>

                    <strong>
                      {averageScore}%
                    </strong>

                    <span>
                      Average
                    </span>

                  </div>

                </div>


                <div className="score-details">

                  <h3>
                    Keep improving!
                  </h3>

                  <p>
                    Your average score is based
                    on your completed quizzes.
                  </p>


                  <div className="score-progress">

                    <div
                      className="score-progress-fill"
                      style={{
                        width:
                          `${averageScore}%`
                      }}
                    ></div>

                  </div>


                  <span>
                    {progress.completedQuizzes}{" "}
                    completed quiz
                    {progress.completedQuizzes !== 1
                      ? "zes"
                      : ""}
                  </span>

                </div>

              </div>

            </div>


            {/* ================= STUDY JOURNEY ================= */}

            <div className="journey-section">

              <div className="journey-header">

                <div>

                  <p className="section-label">
                    STUDY JOURNEY
                  </p>

                  <h2>
                    Your Learning Activity
                  </h2>

                </div>

              </div>


              <div className="journey">


                <div className="journey-step">

                  <div className="journey-icon">
                    <FiBookOpen />
                  </div>

                  <div>

                    <h3>
                      Study Materials
                    </h3>

                    <p>
                      {progress.totalMaterials}{" "}
                      material
                      {progress.totalMaterials !== 1
                        ? "s"
                        : ""}{" "}
                      uploaded
                    </p>

                  </div>

                </div>


                <div className="journey-line"></div>


                <div className="journey-step">

                  <div className="journey-icon">
                    <FiLayers />
                  </div>

                  <div>

                    <h3>
                      Flashcards
                    </h3>

                    <p>
                      {progress.totalFlashcardSets}{" "}
                      flashcard set
                      {progress.totalFlashcardSets !== 1
                        ? "s"
                        : ""}{" "}
                      created
                    </p>

                  </div>

                </div>


                <div className="journey-line"></div>


                <div className="journey-step">

                  <div className="journey-icon">
                    <FiAward />
                  </div>

                  <div>

                    <h3>
                      Quiz Practice
                    </h3>

                    <p>
                      {progress.completedQuizzes}{" "}
                      quiz
                      {progress.completedQuizzes !== 1
                        ? "zes"
                        : ""}{" "}
                      completed
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* ================= ACTIONS ================= */}

            <div className="progress-actions">

              <button
                onClick={() =>
                  navigate("/library")
                }
              >
                <FiBookOpen />
                Study Materials
              </button>


              <button
                onClick={() =>
                  navigate("/quiz")
                }
              >
                <FiHelpCircle />
                Take a Quiz
              </button>


              <button
                onClick={() =>
                  navigate("/flashcards")
                }
              >
                <FiLayers />
                Flashcards
              </button>

            </div>

          </>

        )}

      </main>

    </div>
  );
};


export default Progress;