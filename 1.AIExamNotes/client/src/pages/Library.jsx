import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiEye,
  FiTrash2,
  FiArrowLeft,
  FiRefreshCw,
  FiSearch,
  FiBookOpen,
  FiUpload,
  FiCalendar
} from "react-icons/fi";
import { serverUrl } from "../config";
import "./Library.css";

const Library = () => {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD LIBRARY MATERIALS
  // =========================
  const loadMaterials = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await fetch(
        `${serverUrl}/api/ai/materials`,
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
          data.message || "Unable to load materials"
        );
      }

      setMaterials(data.materials || []);
    } catch (error) {
      console.error("Library Error:", error);

      alert(
        error.message ||
          "Unable to load materials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  // =========================
  // VIEW MATERIAL
  // =========================
  const handleView = (material) => {
    const response =
      material.notes?.response ||
      material.response ||
      "";

    const selectedMaterial = {
      materialId: material._id,
      fileName: material.fileName,
      prompt: material.prompt || "",
      response: response,
      isSaved: material.isSaved || false
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
  // DELETE MATERIAL
  // =========================
  const handleDelete = async (materialId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this PDF from your library?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      const response = await fetch(
        `${serverUrl}/api/ai/materials/${materialId}`,
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
          data.message || "Unable to delete material"
        );
      }

      setMaterials((previous) =>
        previous.filter(
          (material) => material._id !== materialId
        )
      );

      alert("Material deleted successfully.");
    } catch (error) {
      console.error("Delete Error:", error);

      alert(
        error.message ||
          "Unable to delete material."
      );
    }
  };

  // =========================
  // FILTER MATERIALS
  // =========================
  const filteredMaterials = materials.filter((material) =>
    material.fileName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "Recently added";

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
      return "Recently added";
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="library-page">

      {/* HEADER */}
      <div className="library-header">

        <div className="library-header-left">
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FiArrowLeft />
            Back
          </button>

          <div>
            <h1>My Library</h1>
            <p>
              Manage your generated study materials
            </p>
          </div>
        </div>

        <button
          className="refresh-btn"
          onClick={loadMaterials}
          disabled={loading}
        >
          <FiRefreshCw
            className={loading ? "spinning" : ""}
          />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="library-stats">

        <div className="library-stat-card">
          <div className="stat-icon">
            <FiFileText />
          </div>

          <div>
            <span>Total PDFs</span>
            <strong>{materials.length}</strong>
          </div>
        </div>

        <div className="library-stat-card">
          <div className="stat-icon">
            <FiBookOpen />
          </div>

          <div>
            <span>Study Materials</span>
            <strong>{materials.length}</strong>
          </div>
        </div>

      </div>

      {/* SEARCH */}
      <div className="library-toolbar">

        <div className="search-box">
          <FiSearch />

          <input
            type="text"
            placeholder="Search your PDFs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button
          className="upload-new-btn"
          onClick={() => navigate("/dashboard")}
        >
          <FiUpload />
          Generate New
        </button>

      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="library-empty">
          <div className="loading-spinner"></div>
          <p>Loading your library...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="library-empty">

          <div className="empty-icon">
            <FiFileText />
          </div>

          {search ? (
            <>
              <h2>No materials found</h2>
              <p>
                Try searching with a different PDF name.
              </p>
            </>
          ) : (
            <>
              <h2>Your library is empty</h2>
              <p>
                Upload a PDF and generate your first
                AI study material.
              </p>

              <button
                className="generate-btn"
                onClick={() => navigate("/dashboard")}
              >
                <FiUpload />
                Generate Study Material
              </button>
            </>
          )}

        </div>
      ) : (
        <div className="materials-grid">

          {filteredMaterials.map((material) => (

            <div
              className="material-card"
              key={material._id}
            >

              <div className="material-card-top">

                <div className="pdf-icon">
                  <FiFileText />
                </div>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(material._id)
                  }
                  title="Delete"
                >
                  <FiTrash2 />
                </button>

              </div>

              <div className="material-info">

                <h3 title={material.fileName}>
                  {material.fileName ||
                    "Untitled PDF"}
                </h3>

                <p className="material-date">
                  <FiCalendar />
                  {formatDate(
                    material.createdAt ||
                      material.updatedAt
                  )}
                </p>

                {material.prompt && (
                  <p className="material-prompt">
                    {material.prompt}
                  </p>
                )}

              </div>

              <button
                className="view-material-btn"
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

export default Library;