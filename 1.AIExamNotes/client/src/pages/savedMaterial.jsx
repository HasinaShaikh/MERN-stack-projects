import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookmark,
  FiEye,
  FiTrash2,
  FiArrowLeft,
  FiClock,
  FiMessageSquare,
  FiRefreshCw,
  FiFileText
} from "react-icons/fi";
import { serverUrl } from "../config";
import "./savedMaterial.css";

const SavedMaterials = () => {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD SAVED MATERIALS
  // =========================
  const loadSavedMaterials = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await fetch(
        `${serverUrl}/api/ai/saved-materials`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load saved materials"
        );
      }

      setMaterials(data.materials || []);
    } catch (error) {
      console.error(
        "Saved Materials Error:",
        error
      );

      alert(
        error.message ||
          "Unable to load saved materials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedMaterials();
  }, []);

  // =========================
  // VIEW SAVED MATERIAL
  // =========================
  const handleView = (material) => {
    const selectedMaterial = {
      materialId: material._id,
      fileName: material.fileName,
      prompt: material.prompt || "",
      response:
        material.notes?.response ||
        material.response ||
        "",
      isSaved: true
    };

    localStorage.setItem(
      "latestStudyMaterial",
      JSON.stringify(selectedMaterial)
    );

    navigate("/notes", {
      state: selectedMaterial
    });
  };

  // =========================
  // REMOVE SAVED MATERIAL
  // =========================
  const handleRemove = async (materialId) => {
    const confirmRemove = window.confirm(
      "Remove this material from your saved collection?"
    );

    if (!confirmRemove) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await fetch(
        `${serverUrl}/api/ai/materials/${materialId}/save`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to remove material"
        );
      }

      setMaterials((previous) =>
        previous.filter(
          (material) => material._id !== materialId
        )
      );

      alert("Material removed from saved collection.");
    } catch (error) {
      console.error(
        "Remove Error:",
        error
      );

      alert(
        error.message ||
          "Unable to remove material."
      );
    }
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "Recently saved";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );
    } catch {
      return "Recently saved";
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="saved-materials-page">

      {/* HEADER */}
      <div className="saved-header">

        <div className="saved-header-left">

          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FiArrowLeft />
            Back
          </button>

          <div>
            <h1>Saved Materials</h1>
            <p>
              Quickly access your important study materials
            </p>
          </div>

        </div>

        <button
          className="refresh-btn"
          onClick={loadSavedMaterials}
          disabled={loading}
        >
          <FiRefreshCw
            className={loading ? "spinning" : ""}
          />
          Refresh
        </button>

      </div>

      {/* SAVED COUNT */}
      <div className="saved-count-card">

        <div className="saved-count-icon">
          <FiBookmark />
        </div>

        <div>
          <span>Saved Materials</span>
          <strong>{materials.length}</strong>
        </div>

      </div>

      {/* CONTENT */}
      {loading ? (

        <div className="saved-empty">

          <div className="loading-spinner"></div>

          <p>
            Loading saved materials...
          </p>

        </div>

      ) : materials.length === 0 ? (

        <div className="saved-empty">

          <div className="empty-icon">
            <FiBookmark />
          </div>

          <h2>No saved materials</h2>

          <p>
            Materials that you save will appear here.
          </p>

          <button
            className="browse-btn"
            onClick={() => navigate("/library")}
          >
            <FiFileText />
            Browse Library
          </button>

        </div>

      ) : (

        <div className="saved-materials-grid">

          {materials.map((material) => (

            <div
              className="saved-material-card"
              key={material._id}
            >

              {/* CARD TOP */}
              <div className="saved-card-top">

                <div className="saved-file-icon">
                  <FiBookmark />
                </div>

                <button
                  className="remove-saved-btn"
                  onClick={() =>
                    handleRemove(material._id)
                  }
                  title="Remove from saved"
                >
                  <FiTrash2 />
                </button>

              </div>

              {/* INFORMATION */}
              <div className="saved-material-info">

                <h3 title={material.fileName}>
                  {material.fileName ||
                    "Untitled Material"}
                </h3>

                <div className="saved-meta">

                  <span>
                    <FiClock />
                    {formatDate(
                      material.savedAt ||
                        material.updatedAt ||
                        material.createdAt
                    )}
                  </span>

                  {material.prompt && (
                    <span>
                      <FiMessageSquare />
                      AI Generated
                    </span>
                  )}

                </div>

                {material.prompt && (
                  <p className="saved-prompt">
                    {material.prompt}
                  </p>
                )}

              </div>

              {/* VIEW BUTTON */}
              <button
                className="view-saved-btn"
                onClick={() =>
                  handleView(material)
                }
              >
                <FiEye />
                View Material
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default SavedMaterials;