import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiFileText,
  FiCopy,
  FiBookmark,
  FiCheck
} from "react-icons/fi";
import "./Notes.css";
import { serverUrl } from "../App";

const Notes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);

  // Get latest material from localStorage
  const savedData =
    JSON.parse(
      localStorage.getItem("latestStudyMaterial")
    ) || {};

  // Navigation data has priority
  const data =
    location.state || savedData || {};

  const fileName =
    data.fileName || "Study Material";

  const prompt =
    data.prompt || "";

  const response =
    data.response ||
    data.notes?.response ||
    data.notes?.summary ||
    "No AI response available.";

  // Check whether material is already saved
  useEffect(() => {
    const savedMaterials =
      JSON.parse(
        localStorage.getItem("savedMaterials")
      ) || [];

    if (
      data.materialId &&
      savedMaterials.some(
        (item) =>
          item.materialId === data.materialId
      )
    ) {
      setIsSaved(true);
    }
  }, [data.materialId]);

  // Save material
 const handleSaveMaterial = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/auth");
      return;
    }

    if (!data.materialId) {
      alert("Material ID not found.");
      return;
    }

    const response = await fetch(
      `${serverUrl}/api/ai/materials/${data.materialId}/save`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        "Unable to save material"
      );
    }

    setIsSaved(true);

    alert("Material saved successfully!");

  } catch (error) {
    console.error(
      "Save Material Error:",
      error
    );

    alert(
      error.message ||
      "Unable to save material"
    );
  }
};

  // Copy answer
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        response
      );

      alert("Answer copied!");
    } catch (error) {
      console.log(error);
      alert("Unable to copy answer.");
    }
  };

  return (
    <div className="notes-page">

      {/* Navbar */}

      <nav className="notes-nav">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <FiArrowLeft />
          Dashboard
        </button>

        <div className="notes-brand">
          <span>✦</span>
          AI StudyMate
        </div>

      </nav>


      {/* Main */}

      <main className="notes-container">

        {/* Heading */}

        <div className="notes-heading">

          <div>

            <p className="notes-label">
              AI RESPONSE
            </p>

            <h1>
              Your Study Answer
            </h1>

            <p className="file-name">
              <FiFileText />
              {fileName}
            </p>

          </div>

          <button
            className="copy-btn"
            onClick={handleCopy}
          >
            <FiCopy />
            Copy Answer
          </button>

        </div>


        {/* User Prompt */}

        {prompt && (
          <div className="user-prompt-card">

            <span>
              Your request
            </span>

            <p>
              {prompt}
            </p>

          </div>
        )}


        {/* AI Answer */}

        <section className="answer-card">

          <div className="answer-header">

            <div className="ai-icon">
              ✦
            </div>

            <div>

              <h2>
                AI StudyMate
              </h2>

              <span>
                Generated from your study material
              </span>

            </div>

          </div>


          <div className="answer-content">

            {response
              .split("\n")
              .map(
                (line, index) => (
                  <p key={index}>
                    {line ||
                      "\u00A0"}
                  </p>
                )
              )}

          </div>

        </section>


        {/* Save */}

        <div className="notes-actions">

          <button
            className="save-material-btn"
            onClick={
              handleSaveMaterial
            }
            disabled={isSaved}
          >

            {isSaved ? (
              <>
                <FiCheck />
                Saved
              </>
            ) : (
              <>
                <FiBookmark />
                Save Material
              </>
            )}

          </button>

          <button
            onClick={() =>
              navigate(
                "/savedMaterial"
              )
            }
          >
            👀 View Saved Materials
          </button>

        </div>


        {/* Other actions */}

        <div className="notes-actions">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Ask Another Question
          </button>

          <button
  className="quiz-btn"
  onClick={() =>
    navigate("/quiz", {
      state: {
        materialId: data.materialId,
        fileName: fileName
      }
    })
  }
>
  Take Quiz
</button>

          <button
            onClick={() =>
              navigate("/flashcards")
            }
          >
            Go to Flashcards
          </button>

        </div>

      </main>

    </div>
  );
};

export default Notes;