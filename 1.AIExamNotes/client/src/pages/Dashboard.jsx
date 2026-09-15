import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiHome,
  FiFileText,
  FiBookOpen,
  FiBookmark,
  FiHelpCircle,
  FiLayers,
  FiBarChart2,
  FiLogOut,
  FiUpload,
  FiSend,
  FiMessageSquare,
  FiFile,
  FiArrowRight,
  FiTrendingUp,
  FiClock
} from "react-icons/fi";

import "./Dashboard.css";

import { serverUrl } from "../config";


function Dashboard() {

  const navigate = useNavigate();


  // ================= USER =================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};


  // ================= STATES =================

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [stats, setStats] = useState({
    pdfCount: 0,
    notesCount: 0,
    quizCount: 0,
    studyStreak: 0
  });

  const [userPrompt, setUserPrompt] =
    useState("");

  const [generationStatus, setGenerationStatus] =
    useState("");


  // =====================================================
  // ================= STATS =============================
  // =====================================================

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {
          return;
        }


        // ================= AI STATS =================

        const statsResponse =
          await fetch(
            `${serverUrl}/api/ai/stats`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              },

              credentials: "include"
            }
          );


        const statsData =
          await statsResponse.json();


        console.log(
          "AI Stats:",
          statsData
        );


        // ================= PROGRESS =================

        const progressResponse =
          await fetch(
            `${serverUrl}/api/progress`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              },

              credentials: "include"
            }
          );


        const progressData =
          await progressResponse.json();


        console.log(
          "Progress:",
          progressData
        );


        // ================= SET STATS =================

        setStats({

          pdfCount:
            statsData.pdfCount || 0,

          notesCount:
            statsData.notesCount || 0,

          quizCount:
            progressData.totalQuizzes || 0,

          studyStreak:
            progressData.studyStreak || 0

        });


      } catch (error) {

        console.error(
          "Dashboard Stats Error:",
          error
        );

      }

    };


    fetchStats();

  }, []);


  // =====================================================
  // ================= LOGOUT =============================
  // =====================================================

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );


    if (!confirmLogout) {
      return;
    }


    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem(
      "latestStudyMaterial"
    );


    alert(
      "Logged out successfully!"
    );


    navigate("/auth");

  };


  // =====================================================
  // ================= PDF SELECT ========================
  // =====================================================

  const handleFileChange = (e) => {

    const file =
      e.target.files[0];


    if (!file) {
      return;
    }


    if (
      file.type !==
      "application/pdf"
    ) {

      alert(
        "Please select a PDF file."
      );

      return;
    }


    setSelectedFile(file);


    setGenerationStatus(
      "PDF selected and ready."
    );

  };


  // =====================================================
  // ================= AI GENERATE ========================
  // =====================================================

  const handleGenerate = async (
    prompt = null
  ) => {

    // ================= CHECK FILE =================

    if (!selectedFile) {

      alert(
        "Please choose a PDF first."
      );

      return;
    }


    // ================= CHECK PROMPT =================

    const finalPrompt =
      prompt ||
      userPrompt.trim();


    if (!finalPrompt) {

      alert(
        "Please enter a prompt."
      );

      return;
    }


    try {

      setIsUploading(true);


      setGenerationStatus(
        "Uploading your PDF..."
      );


      // ================= FORM DATA =================

      const formData =
        new FormData();


      formData.append(
        "pdf",
        selectedFile
      );


      formData.append(
        "prompt",
        finalPrompt
      );


      // ================= TOKEN =================

      const token =
        localStorage.getItem("token");


      if (!token) {

        alert(
          "Please login again."
        );

        navigate("/auth");

        return;
      }


      // ================= AI REQUEST =================

      setGenerationStatus(
        "AI is analyzing your study material..."
      );


      const response =
        await fetch(
          `${serverUrl}/api/ai/upload`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            credentials: "include",

            body: formData
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to generate AI response"
        );

      }


      // ================= AI RESPONSE =================

      const aiResponse =
        data.response ||
        data.notes?.response ||
        data.notes?.summary ||
        "";


      console.log(
        "AI Response:",
        aiResponse
      );


      setGenerationStatus(
        "Your AI answer is ready! ✓"
      );


      // =================================================
      // SAVE LATEST STUDY MATERIAL
      // =================================================

   localStorage.setItem(
  "latestStudyMaterial",
  JSON.stringify({
    materialId: data.materialId,
    fileName: data.fileName,
    prompt: data.prompt,
    response: data.response
  })
);

navigate("/notes", {
  state: {
    materialId: data.materialId,
    fileName: data.fileName,
    prompt: data.prompt,
    response: data.response
  }
});

    } catch (error) {

      console.error(
        "AI Generation Error:",
        error
      );


      alert(
        error.message ||
        "Unable to generate AI response."
      );


      setGenerationStatus(
        "Generation failed."
      );


    } finally {

      setIsUploading(false);

    }

  };


  // =====================================================
  // ================= QUICK ACTIONS =====================
  // =====================================================

  const quickActions = [

    {
      icon: <FiBookOpen />,

      title: "Summary",

      description:
        "Get a simple summary",

      prompt:
        "Give me a short and simple summary covering all the major topics from this study material."
    },

    {
      icon: <FiTrendingUp />,

      title: "Important Points",

      description:
        "Find important exam points",

      prompt:
        "Give me the most important exam points from this study material in simple bullet points."
    },

    {
      icon: <FiFileText />,

      title: "Definitions",

      description:
        "Learn key definitions",

      prompt:
        "Give me the important definitions from this study material in simple and exam-friendly language."
    },

    {
      icon: <FiHelpCircle />,

      title: "Exam Questions",

      description:
        "Prepare for your exam",

      prompt:
        "Give me important exam questions from this study material. Include short answer, medium answer and long answer questions."
    }

  ];


  // =====================================================
  // ================= SIDEBAR ===========================
  // =====================================================

  const menuItems = [

    {
      icon: <FiHome />,
      title: "Dashboard",
      path: "/dashboard"
    },

    {
      icon: <FiFileText />,
      title: "My Notes",
      path: "/notes"
    },

    {
      icon: <FiBookOpen />,
      title: "Library",
      path: "/library"
    },

    {
      icon: <FiBookmark />,
      title: "Saved Materials",
      path: "/savedMaterial"
    },

    {
      icon: <FiHelpCircle />,
      title: "Quiz",
      path: "/quiz"
    },

    {
      icon: <FiClock />,
      title: "Quiz History",
      path: "/quiz-history"
    },

    {
      icon: <FiLayers />,
      title: "Flashcards",
      path: "/flashcards"
    },

    {
      icon: <FiBarChart2 />,
      title: "Progress",
      path: "/progress"
    }

  ];


  // =====================================================
  // ================= RETURN ============================
  // =====================================================

  return (

    <div className="dashboard">


      {/* ================= TOP NAVBAR ================= */}

      <nav className="dashboard-navbar">


        <div
          className="brand"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          <div className="brand-logo">
            ✦
          </div>


          <div>

            <strong>
              AI StudyMate
            </strong>

            <span>
              Smart Study Assistant
            </span>

          </div>

        </div>


        {/* ================= TOP NAV ================= */}

        <div className="top-nav-links">


          <button
            onClick={() =>
              navigate("/")
            }
          >
            Home
          </button>


          <button
            className="top-active-dashboard"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>


          <button
            onClick={() =>
              navigate("/notes")
            }
          >
            Notes
          </button>


          <button
            onClick={() =>
              navigate("/quiz")
            }
          >
            Quiz
          </button>


          <button
            onClick={() =>
              navigate("/flashcards")
            }
          >
            Flashcards
          </button>


          <button
            onClick={() =>
              navigate("/progress")
            }
          >
            Progress
          </button>


        </div>


        {/* ================= USER ================= */}

        <div className="nav-user">


          <div className="user-avatar">

            {(user.name || "U")
              .split(" ")
              .map(
                (word) =>
                  word[0]
              )
              .join("")
              .slice(0, 2)
              .toUpperCase()}

          </div>


          <span>
            {user.name || "Student"}
          </span>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            <FiLogOut />

            Logout

          </button>


        </div>


      </nav>


      {/* ================= BODY ================= */}

      <div className="dashboard-layout">


        {/* ================= SIDEBAR ================= */}

        <aside className="sidebar">


          <div className="sidebar-title">
            STUDY SPACE
          </div>


          <div className="sidebar-menu">


            {menuItems.map(
              (item) => (

                <button
                  key={item.title}

                  className={
                    item.title ===
                    "Dashboard"
                      ? "sidebar-item active"
                      : "sidebar-item"
                  }

                  onClick={() =>
                    navigate(
                      item.path
                    )
                  }
                >

                  <span className="sidebar-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.title}
                  </span>

                </button>

              )
            )}


          </div>


          <div className="sidebar-bottom">

            <div className="study-tip">

              <span>
                ✦
              </span>

              <div>

                <strong>
                  Study Tip
                </strong>

                <p>
                  Ask AI questions directly
                  from your PDF.
                </p>

              </div>

            </div>

          </div>


        </aside>


        {/* ================= MAIN CONTENT ================= */}

        <main className="dashboard-content">


          {/* ================= WELCOME ================= */}

          <section className="welcome">

            <div>

              <span className="welcome-label">
                STUDENT DASHBOARD
              </span>


              <h1>

                Welcome back,{" "}

                <span>
                  {user.name ||
                    "Student"}
                </span>{" "}

                👋

              </h1>


              <p>
                Turn your study material into
                smart learning resources with AI.
              </p>

            </div>

          </section>


          {/* ================= STATS ================= */}

          <section className="stats">


            {/* STUDY MATERIALS */}

            <div className="stat-card">

              <div className="stat-icon purple">

                <FiFile />

              </div>


              <div>

                <span>
                  Study Materials
                </span>

                <h3>
                  {stats.pdfCount}
                </h3>

                <small>
                  PDFs uploaded
                </small>

              </div>

            </div>


            {/* MY NOTES */}

            <div className="stat-card">

              <div className="stat-icon blue">

                <FiFileText />

              </div>


              <div>

                <span>
                  My Notes
                </span>

                <h3>
                  {stats.notesCount}
                </h3>

                <small>
                  AI answers created
                </small>

              </div>

            </div>


            {/* QUIZ */}

            <div className="stat-card">

              <div className="stat-icon pink">

                <FiHelpCircle />

              </div>


              <div>

                <span>
                  Quiz
                </span>

                <h3>
                  {stats.quizCount}
                </h3>

                <small>
                  Quizzes created
                </small>

              </div>

            </div>


            {/* STUDY STREAK */}

            <div className="stat-card">

              <div className="stat-icon orange">

                <FiTrendingUp />

              </div>


              <div>

                <span>
                  Study Streak
                </span>

                <h3>
                  {stats.studyStreak}
                </h3>

                <small>
                  Days studied
                </small>

              </div>

            </div>


          </section>


          {/* ================= AI ASSISTANT ================= */}

          <section className="ai-section">


            <div className="ai-header">


              <div className="ai-title">


                <div className="ai-logo">
                  ✦
                </div>


                <div>

                  <span>
                    AI STUDY ASSISTANT
                  </span>


                  <h2>
                    What do you want to learn?
                  </h2>


                  <p>
                    Upload your study material
                    and ask AI anything about it.
                  </p>

                </div>


              </div>


              <div className="ai-status">

                <span>
                </span>

                AI Ready

              </div>


            </div>


            {/* ================= PDF UPLOAD ================= */}

            <div className="upload-area">


              <input
                type="file"
                id="pdf"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                hidden
              />


              <label
                htmlFor="pdf"
                className="upload-box"
              >


                <div className="upload-icon">

                  <FiUpload />

                </div>


                <div>

                  <strong>

                    {selectedFile
                      ? selectedFile.name
                      : "Upload your PDF"}

                  </strong>


                  <span>

                    {selectedFile
                      ? "PDF selected and ready"
                      : "Click to choose your study material"}

                  </span>

                </div>


                <div className="upload-arrow">

                  <FiArrowRight />

                </div>


              </label>


            </div>


            {/* ================= SELECTED FILE ================= */}

            {selectedFile && (

              <div className="selected-file">


                <div className="selected-file-icon">

                  <FiFileText />

                </div>


                <div>

                  <strong>
                    {selectedFile.name}
                  </strong>


                  <span>
                    PDF • Ready to process
                  </span>

                </div>


                <span className="file-check">
                  ✓
                </span>


              </div>

            )}


            {/* ================= PROMPT ================= */}

            <div className="prompt-area">


              <div className="prompt-label">

                <FiMessageSquare />

                <span>
                  Ask AI anything about your PDF
                </span>

              </div>


              <textarea

                value={userPrompt}

                onChange={(e) =>
                  setUserPrompt(
                    e.target.value
                  )
                }

                placeholder="Example: Explain this chapter in simple language with examples..."

                disabled={isUploading}

              />


              <div className="prompt-footer">


                <span>

                  {userPrompt.length}
                  {" "}
                  characters

                </span>


                <button

                  className="ask-ai-btn"

                  onClick={() =>
                    handleGenerate()
                  }

                  disabled={isUploading}

                >

                  {isUploading ? (

                    <>

                      <span className="spinner">
                      </span>

                      Generating...

                    </>

                  ) : (

                    <>

                      <FiSend />

                      Ask AI

                    </>

                  )}

                </button>


              </div>


            </div>


            {/* ================= STATUS ================= */}

            {generationStatus && (

              <div className="generation-status">

                <span>
                </span>

                {generationStatus}

              </div>

            )}


            {/* ================= QUICK ACTIONS ================= */}

            <div className="quick-actions-section">


              <div className="quick-heading">

                <div>

                  <h3>
                    Quick Actions
                  </h3>

                  <p>
                    Choose what you want AI to
                    generate from your PDF.
                  </p>

                </div>

              </div>


              <div className="quick-actions">


                {quickActions.map(
                  (action) => (

                    <button

                      key={action.title}

                      className="quick-action"

                      onClick={() =>
                        handleGenerate(
                          action.prompt
                        )
                      }

                      disabled={isUploading}

                    >


                      <div className="quick-icon">

                        {action.icon}

                      </div>


                      <div className="quick-info">

                        <strong>
                          {action.title}
                        </strong>

                        <span>
                          {action.description}
                        </span>

                      </div>


                      <FiArrowRight
                        className="quick-arrow"
                      />


                    </button>

                  )
                )}


              </div>


            </div>


          </section>


        </main>


      </div>


    </div>

  );

}


export default Dashboard;