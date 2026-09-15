import React, { useState } from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import { serverUrl } from "../config";

import "./Quiz.css";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const materialId =
    location.state?.materialId;

  const fileName =
    location.state?.fileName ||
    "Study Material";

  const [quiz, setQuiz] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [answers, setAnswers] =
    useState([]);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);


  // ================= GENERATE QUIZ =================

  const generateQuiz = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      if (!materialId) {
        alert("Please select a material first.");
        navigate("/library");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${serverUrl}/api/quiz/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            materialId: materialId
          })
        }
      );

      const data =
        await response.json();

      console.log(
        "========== QUIZ GENERATE RESPONSE =========="
      );

      console.log(data);

      console.log(
        "Quiz object:",
        data.quiz
      );

      console.log(
        "Quiz ID:",
        data.quiz?._id
      );

      console.log(
        "============================================="
      );


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to generate quiz"
        );
      }


      if (!data.quiz) {
        throw new Error(
          "Quiz was generated but quiz data was not returned."
        );
      }


      if (!data.quiz._id) {
        console.error(
          "Backend response does not contain quiz._id:",
          data
        );

        throw new Error(
          "Quiz ID was not returned by the backend."
        );
      }


      // SAVE QUIZ ID

      localStorage.setItem(
        "currentQuizId",
        data.quiz._id
      );


      console.log(
        "Saved Quiz ID:",
        localStorage.getItem(
          "currentQuizId"
        )
      );


      // SET QUESTIONS

      setQuiz(
        data.quiz.questions || []
      );

      setAnswers([]);

      setCurrentQuestion(0);

      setSelectedAnswer("");

      setScore(0);

      setFinished(false);

    } catch (error) {

      console.error(
        "Quiz Generate Error:",
        error
      );

      alert(
        error.message ||
        "Unable to generate quiz"
      );

    } finally {

      setLoading(false);
    }
  };


  // ================= PREVIOUS QUESTION =================

  const handlePrevious = () => {

    if (currentQuestion === 0) {
      return;
    }

    const previousQuestion =
      currentQuestion - 1;

    setCurrentQuestion(
      previousQuestion
    );

    setSelectedAnswer(
      answers[previousQuestion] || ""
    );
  };


  // ================= NEXT / FINISH =================

  const handleNext = async () => {

    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }


    // Make a copy of answers

    const updatedAnswers = [
      ...answers
    ];


    // Save current answer

    updatedAnswers[
      currentQuestion
    ] = selectedAnswer;


    // ================= NEXT QUESTION =================

    if (
      currentQuestion <
      quiz.length - 1
    ) {

      setAnswers(
        updatedAnswers
      );

      const nextQuestion =
        currentQuestion + 1;

      setCurrentQuestion(
        nextQuestion
      );

      setSelectedAnswer(
        updatedAnswers[nextQuestion] || ""
      );

      return;
    }


    // ================= FINISH QUIZ =================

    try {

      const token =
        localStorage.getItem("token");

      const quizId =
        localStorage.getItem(
          "currentQuizId"
        );


      console.log(
        "Quiz ID:",
        quizId
      );

      console.log(
        "Final Answers:",
        updatedAnswers
      );


      if (!quizId) {

        alert(
          "Quiz ID not found. Please generate the quiz again."
        );

        return;
      }


      if (!token) {

        alert(
          "Please login again."
        );

        navigate("/auth");

        return;
      }


      setLoading(true);


      const response = await fetch(
        `${serverUrl}/api/quiz/${quizId}/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            answers:
              updatedAnswers
          })
        }
      );


      const data =
        await response.json();


      console.log(
        "Submit Quiz Response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to submit quiz"
        );
      }


      setAnswers(
        updatedAnswers
      );

      setScore(
        data.score
      );

      setFinished(true);

    } catch (error) {

      console.error(
        "Submit Quiz Error:",
        error
      );

      alert(
        error.message ||
        "Unable to submit quiz"
      );

    } finally {

      setLoading(false);
    }
  };


  // ================= UI =================

  return (

    <div className="quiz-page">


      {/* HEADER */}

      <header className="quiz-header">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ⬅ Back
        </button>


        <div>

          <h1>
            AI Quiz
          </h1>

          <p>
            {fileName}
          </p>

        </div>

      </header>


      {/* MAIN */}

      <main className="quiz-container">


        {/* ================= START ================= */}

        {quiz.length === 0 &&
          !loading &&
          !finished && (

            <div className="quiz-start">

              <h2>
                Test Your Knowledge
              </h2>

              <p>
                Generate 10 multiple-choice
                questions from this study
                material.
              </p>


              <button
                onClick={generateQuiz}
              >
                Generate Quiz
              </button>

            </div>

          )}


        {/* ================= LOADING ================= */}

        {loading && (

          <div className="quiz-loading">

            <h2>
              {finished
                ? "Submitting Quiz..."
                : "Generating Quiz..."
              }
            </h2>

            <p>
              {finished
                ? "Checking your answers..."
                : "AI is creating questions from your study material."
              }
            </p>

          </div>

        )}


        {/* ================= QUESTION ================= */}

        {quiz.length > 0 &&
          !loading &&
          !finished && (

            <div className="question-card">


              <div className="question-number">

                Question{" "}

                {currentQuestion + 1}

                {" "}of{" "}

                {quiz.length}

              </div>


              <h2>

                {
                  quiz[
                    currentQuestion
                  ]?.question
                }

              </h2>


              <div className="quiz-options">

                {
                  quiz[
                    currentQuestion
                  ]?.options?.map(
                    (option, index) => (

                      <button
                        key={index}

                        className={
                          selectedAnswer ===
                          option
                            ? "quiz-option selected"
                            : "quiz-option"
                        }

                        onClick={() => {

                          setSelectedAnswer(
                            option
                          );


                          const updatedAnswers =
                            [
                              ...answers
                            ];


                          updatedAnswers[
                            currentQuestion
                          ] = option;


                          setAnswers(
                            updatedAnswers
                          );

                        }}
                      >

                        {option}

                      </button>

                    )
                  )
                }

              </div>


              {/* ================= NAVIGATION ================= */}

              <div className="quiz-navigation">


                <button
                  className="previous-btn"

                  onClick={
                    handlePrevious
                  }

                  disabled={
                    currentQuestion === 0
                  }
                >
                  ← Previous
                </button>


                <button
                  className="next-btn"

                  onClick={
                    handleNext
                  }
                >

                  {currentQuestion ===
                  quiz.length - 1
                    ? "Finish Quiz"
                    : "Next Question →"
                  }

                </button>


              </div>


            </div>

          )}


        {/* ================= RESULT ================= */}

        {finished &&
          !loading && (

            <div className="quiz-result">

              <h2>
                Quiz Completed
              </h2>


              <div className="score">

                {score} / {quiz.length}

              </div>


              <p>
                You completed the quiz.
              </p>


              <button
                onClick={
                  generateQuiz
                }
              >
                Retry Quiz
              </button>


              <button
                className="back-result"

                onClick={() =>
                  navigate(
                    "/quiz-history"
                  )
                }
              >
                View Quiz History
              </button>


              <button
                className="back-result"

                onClick={() =>
                  navigate(
                    "/dashboard"
                  )
                }
              >
                Back to Dashboard
              </button>

            </div>

          )}

      </main>

    </div>

  );
};


export default Quiz;