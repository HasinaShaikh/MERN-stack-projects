import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import { serverUrl } from "../config";

import "./Flashcards.css";


const Flashcards = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);


  // ================= MATERIAL =================

  const materialId =
    location.state?.materialId;

  const [fileName, setFileName] =
    useState(
      location.state?.fileName ||
      ""
    );


  // ================= STATES =================

  const [flashcards, setFlashcards] =
    useState([]);

  const [currentCard, setCurrentCard] =
    useState(0);

  const [isFlipped, setIsFlipped] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ================= GENERATE FLASHCARDS =================

  const generateFlashcards = async (
    selectedMaterialId = materialId
  ) => {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        alert(
          "Please login again."
        );

        navigate("/auth");

        return;
      }


      if (!selectedMaterialId) {

        setError(
          "Study material not selected. Please upload or select a study material."
        );

        return;
      }


      setLoading(true);
      setError("");
      setCompleted(false);


      const response = await fetch(
        `${serverUrl}/api/flashcards/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            materialId:
              selectedMaterialId
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to generate flashcards"
        );
      }


      setFlashcards(
        data.flashcards || []
      );

      setCurrentCard(0);

      setIsFlipped(false);

      setCompleted(false);

    } catch (error) {

      console.error(
        "Generate Flashcards Error:",
        error
      );

      setError(
        error.message ||
        "Unable to generate flashcards"
      );

    } finally {

      setLoading(false);
    }
  };


  // ================= INITIAL LOAD =================

  useEffect(() => {

    if (materialId) {

      generateFlashcards(
        materialId
      );

    }

  }, [materialId]);


  // ================= NEXT =================

  const handleNext = () => {

    if (
      currentCard <
      flashcards.length - 1
    ) {

      setCurrentCard(
        (previous) =>
          previous + 1
      );

      setIsFlipped(false);

    } else {

      setCompleted(true);
    }
  };


  // ================= PREVIOUS =================

  const handlePrevious = () => {

    if (currentCard > 0) {

      setCurrentCard(
        (previous) =>
          previous - 1
      );

      setIsFlipped(false);
    }
  };


  // ================= FLIP =================

  const handleFlip = () => {

    setIsFlipped(
      (previous) =>
        !previous
    );
  };


  // ================= STUDY AGAIN =================

  const handleStudyAgain = () => {

    setCurrentCard(0);

    setIsFlipped(false);

    setCompleted(false);
  };


  // ================= UPLOAD NEW FILE =================

  const handleUploadNewFile = () => {

    if (fileInputRef.current) {

      fileInputRef.current.click();

    }
  };


  // ================= FILE SELECTED =================

  const handleFileSelected =
    async (event) => {

      const file =
        event.target.files[0];


      if (!file) {
        return;
      }


      const selectedFileName =
        file.name.toLowerCase();


      const isPDF =
        selectedFileName.endsWith(
          ".pdf"
        );


      const isDOCX =
        selectedFileName.endsWith(
          ".docx"
        );


      if (!isPDF && !isDOCX) {

        alert(
          "Please select a PDF or DOCX file."
        );

        event.target.value = "";

        return;
      }


      try {

        setLoading(true);

        setError("");

        setCompleted(false);


        const token =
          localStorage.getItem("token");


        if (!token) {

          alert(
            "Please login again."
          );

          navigate("/auth");

          return;
        }


        // ================= FORM DATA =================

        const formData =
          new FormData();


        formData.append(
          "pdf",
          file
        );


        formData.append(
          "prompt",
          "Do not generate notes. This material is being uploaded for AI flashcard generation."
        );


        console.log(
          "Uploading:",
          file.name
        );


        // ================= UPLOAD =================

        const uploadResponse =
          await fetch(
            `${serverUrl}/api/ai/upload`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`
              },

              body: formData
            }
          );


        const uploadData =
          await uploadResponse.json();


        if (!uploadResponse.ok) {

          throw new Error(
            uploadData.message ||
            "Unable to upload file"
          );
        }


        console.log(
          "Upload successful:",
          uploadData
        );


        // ================= UPDATE FILE NAME =================

        setFileName(
          uploadData.fileName ||
          file.name
        );


        // ================= GENERATE FLASHCARDS =================

        const flashcardResponse =
          await fetch(
            `${serverUrl}/api/flashcards/generate`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({
                materialId:
                  uploadData.materialId
              })
            }
          );


        const flashcardData =
          await flashcardResponse.json();


        if (!flashcardResponse.ok) {

          throw new Error(
            flashcardData.message ||
            "Unable to generate flashcards"
          );
        }


        console.log(
          "Flashcards generated:",
          flashcardData
        );


        setFlashcards(
          flashcardData.flashcards || []
        );


        setCurrentCard(0);

        setIsFlipped(false);

        setCompleted(false);

      } catch (error) {

        console.error(
          "Upload / Flashcard Error:",
          error
        );

        setError(
          error.message ||
          "Unable to process the file"
        );

      } finally {

        setLoading(false);

        // Allow same file to be selected again

        event.target.value = "";
      }
    };


  // ================= PAGE =================

  return (

    <div className="flashcards-page">


      {/* ================= HEADER ================= */}

      <header className="flashcards-header">

        <div className="flashcards-logo">

          <div className="flashcards-logo-icon">
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
          className="flashcards-dashboard-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Dashboard
        </button>

      </header>


      {/* ================= MAIN ================= */}

      <main className="flashcards-container">


        {/* ================= HIDDEN FILE INPUT ================= */}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{
            display: "none"
          }}
          onChange={
            handleFileSelected
          }
        />


        {/* ================= TOP ================= */}

        <div className="flashcards-top">

          <div>

            <p className="flashcards-label">
              MEMORY BOOST
            </p>


            <h1>
              Flashcards
            </h1>


            <p className="flashcards-description">
              Revise important concepts from
              your study material using
              AI-generated flashcards.
            </p>

          </div>

        </div>


        {/* ================= MATERIAL ================= */}

        {fileName && (

          <div className="flashcards-material">

            <span>
              Study Material:
            </span>

            <strong>
              {fileName}
            </strong>

          </div>

        )}


        {/* ================= LOADING ================= */}

        {loading && (

          <div className="flashcards-loading">

            <div className="loading-spinner"></div>


            <h3>
              Generating your flashcards...
            </h3>


            <p>
              AI is creating useful revision
              questions from your study material.
            </p>

          </div>

        )}


        {/* ================= ERROR ================= */}

        {!loading &&
          error && (

          <div className="flashcards-error">

            <h3>
              Unable to generate flashcards
            </h3>


            <p>
              {error}
            </p>


            <button
              onClick={() =>
                materialId
                  ? generateFlashcards(
                      materialId
                    )
                  : handleUploadNewFile()
              }
              className="retry-flashcards-btn"
            >
              Try Again
            </button>

          </div>

        )}


        {/* ================= FLASHCARDS ================= */}

        {!loading &&
          !error &&
          flashcards.length > 0 && (

          <>

            {/* ================= NOT COMPLETED ================= */}

            {!completed ? (

              <>

                {/* ================= PROGRESS ================= */}

                <div className="flashcards-progress">

                  <div className="progress-text">
                    Card{" "}
                    {currentCard + 1}{" "}
                    of{" "}
                    {flashcards.length}
                  </div>


                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width:
                          `${
                            (
                              (
                                currentCard + 1
                              ) /
                              flashcards.length
                            ) * 100
                          }%`
                      }}
                    ></div>

                  </div>

                </div>


                {/* ================= CARD ================= */}

                <div
                  className={`flashcard ${
                    isFlipped
                      ? "flipped"
                      : ""
                  }`}
                  onClick={handleFlip}
                >


                  {!isFlipped ? (

                    <div className="flashcard-content">

                      <span className="flashcard-type">
                        QUESTION
                      </span>


                      <h2>
                        {
                          flashcards[
                            currentCard
                          ]?.question
                        }
                      </h2>


                      <p className="flip-hint">
                        Click the card to reveal
                        the answer
                      </p>

                    </div>

                  ) : (

                    <div className="flashcard-content">

                      <span className="flashcard-type answer">
                        ANSWER
                      </span>


                      <p className="flashcard-answer">
                        {
                          flashcards[
                            currentCard
                          ]?.answer
                        }
                      </p>


                      <p className="flip-hint">
                        Click the card to see
                        the question
                      </p>

                    </div>

                  )}

                </div>


                {/* ================= NAVIGATION ================= */}

                <div className="flashcards-navigation">


                  <button
                    className="flashcard-nav-btn"
                    onClick={
                      handlePrevious
                    }
                    disabled={
                      currentCard === 0
                    }
                  >
                    ← Previous
                  </button>


                  <button
                    className="flashcard-nav-btn"
                    onClick={
                      handleNext
                    }
                  >

                    {currentCard ===
                    flashcards.length - 1
                      ? "Finish"
                      : "Next →"}

                  </button>


                </div>

              </>

            ) : (

              /* ================= COMPLETED ================= */

              <div className="flashcards-completed">


                <div className="completed-icon">
                  ✓
                </div>


                <h2>
                  Flashcards Completed!
                </h2>


                <p>
                  You have completed all{" "}
                  {flashcards.length}{" "}
                  flashcards.
                </p>


                <button
                  className="study-again-btn"
                  onClick={
                    handleStudyAgain
                  }
                >
                  Study Again
                </button>


              </div>

            )}

          </>

        )}


        {/* ================= NO MATERIAL ================= */}

        {!loading &&
          !error &&
          flashcards.length === 0 && (

          <div className="flashcards-empty">


            <h3>
              No study material selected
            </h3>


            <p>
              Upload a new PDF or DOCX file
              to create flashcards.
            </p>


            <div className="flashcards-empty-actions">


              <button
                className="upload-new-file-btn"
                onClick={
                  handleUploadNewFile
                }
              >
                Upload New Material
              </button>
            </div>


          </div>

        )}

      </main>

    </div>
  );
};


export default Flashcards;