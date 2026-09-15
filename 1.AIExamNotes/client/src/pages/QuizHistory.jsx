import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiBookOpen,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiRefreshCw
} from "react-icons/fi";

import { serverUrl } from "../config";

import "./QuizHistory.css";


const QuizHistory = () => {

  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ================= GET QUIZ HISTORY =================

  const fetchQuizzes = async () => {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        navigate("/auth");

        return;

      }


      setLoading(true);

      setError("");


      const response = await fetch(
        `${serverUrl}/api/quiz`,
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


      console.log(
        "Quiz History Response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to load quiz history"
        );

      }


      setQuizzes(
        data.quizzes || []
      );


    } catch (error) {

      console.error(
        "Quiz History Error:",
        error
      );


      setError(
        error.message ||
        "Unable to load quiz history"
      );


    } finally {

      setLoading(false);

    }

  };


  // ================= LOAD QUIZZES =================

  useEffect(() => {

    fetchQuizzes();

  }, []);


  // ================= VIEW RESULT =================

  const handleViewResult = (quizId) => {

    navigate(
      `/quiz-history/${quizId}`
    );

  };


  // ================= FORMAT DATE =================

  const formatDate = (date) => {

    if (!date) {
      return "Date unavailable";
    }


    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

  };


  // ================= SCORE =================

  const getScorePercentage = (
    score,
    total
  ) => {

    if (!total) {
      return 0;
    }

    return Math.round(
      (score / total) * 100
    );

  };

const handleDelete = async (quizId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this quiz?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/auth");
      return;
    }

    const response = await fetch(
      `${serverUrl}/api/quiz/${quizId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete quiz"
      );
    }

    // Remove deleted quiz from the screen
    setQuizzes((previousQuizzes) =>
      previousQuizzes.filter(
        (quiz) => quiz._id !== quizId
      )
    );

    alert("Quiz deleted successfully!");

  } catch (error) {
    console.error(
      "Delete Quiz Error:",
      error
    );

    alert(
      error.message ||
      "Unable to delete quiz"
    );
  }
};
  return (

    <div className="quiz-history-page">


      {/* ================= HEADER ================= */}

      <header className="quiz-history-header">

        <button
          className="history-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          <FiArrowLeft />

          Back to Dashboard

        </button>


        <div className="history-title">

          <div className="history-title-icon">

            <FiBookOpen />

          </div>


          <div>

            <h1>
              Quiz History
            </h1>

            <p>
              Review your previous quizzes
              and scores
            </p>

          </div>

        </div>


        <button
          className="history-refresh-btn"
          onClick={fetchQuizzes}
        >

          <FiRefreshCw />

          Refresh

        </button>

      </header>



      {/* ================= CONTENT ================= */}

      <main className="quiz-history-container">


        <div className="history-section-heading">

          <div>

            <h2>
              Your Quizzes
            </h2>

            <p>
              {quizzes.length} quiz
              {quizzes.length !== 1
                ? "zes"
                : ""} completed
            </p>

          </div>

        </div>



        {/* ================= LOADING ================= */}

        {loading && (

          <div className="history-message">

            <div className="history-spinner"></div>

            <p>
              Loading your quiz history...
            </p>

          </div>

        )}



        {/* ================= ERROR ================= */}

        {!loading && error && (

          <div className="history-message error">

            <h3>
              Unable to load quizzes
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchQuizzes}
            >
              Try Again
            </button>

          </div>

        )}



        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          quizzes.length === 0 && (

            <div className="history-empty">

              <div className="empty-icon">

                <FiBookOpen />

              </div>


              <h2>
                No quizzes yet
              </h2>


              <p>
                Generate a quiz from your
                study material and your
                completed quizzes will
                appear here.
              </p>


              <button
                onClick={() =>
                  navigate("/library")
                }
              >
                Start a Quiz
              </button>

            </div>

          )}



        {/* ================= QUIZ CARDS ================= */}

        {!loading &&
          !error &&
          quizzes.length > 0 && (

            <div className="quiz-history-grid">

              {quizzes.map((quiz) => {

                const percentage =
                  getScorePercentage(
                    quiz.score,
                    quiz.totalQuestions
                  );


                return (

                  <div
                    className="history-card"
                    key={quiz._id}
                  >


                    {/* CARD TOP */}

                    <div className="history-card-top">

                      <div className="history-card-icon">

                        <FiBookOpen />

                      </div>


                      <span
                        className={
                          quiz.completed
                            ? "completed-badge"
                            : "pending-badge"
                        }
                      >

                        {quiz.completed
                          ? "Completed"
                          : "Not Completed"}

                      </span>

                    </div>



                    {/* TITLE */}

                    <h3>
                      {quiz.title ||
                        "Study Quiz"}
                    </h3>



                    {/* MATERIAL */}

                    <p className="material-text">

                      Study Material Quiz

                    </p>



                    {/* DETAILS */}

                    <div className="history-details">


                      <div>

                        <FiCheckCircle />

                        <span>
                          {quiz.totalQuestions}
                          {" "}
                          Questions
                        </span>

                      </div>


                      <div>

                        <FiClock />

                        <span>
                          {formatDate(
                            quiz.createdAt
                          )}
                        </span>

                      </div>

                    </div>



                    {/* SCORE */}

                    <div className="score-section">

                      <div>

                        <span>
                          Score
                        </span>

                        <strong>
                          {quiz.score || 0}
                          {" / "}
                          {quiz.totalQuestions}
                        </strong>

                      </div>


                      <div className="percentage">

                        {percentage}%

                      </div>

                    </div>



                    {/* PROGRESS BAR */}

                    <div className="score-bar">

                      <div
                        className="score-fill"
                        style={{
                          width:
                            `${percentage}%`
                        }}
                      ></div>

                    </div>



                    {/* VIEW BUTTON */}

                    <div className="quiz-card-footer">
                     <button className="delete-quiz-btn"
                    onClick={() => handleDelete(quiz._id)} >
                  <FiTrash2 />
                Delete Quiz
                </button>
                </div>
                  </div>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
};


export default QuizHistory;