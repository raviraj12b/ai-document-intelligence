function Sidebar({
  documents,
  selectedDocument,
  onSelectDocument,
  onAddDocument,
  onDeleteDocument,
  uploading,
  deletingDocumentId,
  activeView,
  onViewChange,
  uploadStage
}) {

  const getUploadLabel = () => {

    if (!uploading) {
      return "Add document";
    }

    switch (uploadStage) {

      case "uploading":
        return "Uploading...";

      case "extracting":
        return "Extracting...";

      case "embedding":
        return "Embedding...";

      case "indexing":
        return "Indexing...";

      case "ready":
        return "Ready";

      default:
        return "Processing...";

    }

  };


  return (

    <aside className="sidebar">

      <button
        className={`add-document ${
          uploading
            ? "uploading"
            : ""
        }`}
        onClick={onAddDocument}
        disabled={uploading}
      >

        <span className="add-document-icon">

          {uploading
            ? "•"
            : "+"}

        </span>


        <span>
          {getUploadLabel()}
        </span>

      </button>


      <div className="sidebar-section">

        <p className="section-label">
          WORKSPACE
        </p>


        <nav className="sidebar-nav">

          <button
            type="button"
            className={`nav-item ${
              activeView === "overview"
                ? "active"
                : ""
            }`}
            onClick={() =>
              onViewChange("overview")
            }
          >
            <span className="nav-label">
              Overview
            </span>
          </button>


          <button
            type="button"
            className={`nav-item ${
              activeView === "documents"
                ? "active"
                : ""
            }`}
            onClick={() =>
              onViewChange("documents")
            }
          >
            <span className="nav-label">
              Documents
            </span>
          </button>


          <button
            type="button"
            className={`nav-item ${
              activeView === "collections"
                ? "active"
                : ""
            }`}
            onClick={() =>
              onViewChange("collections")
            }
          >
            <span className="nav-label">
              Collections
            </span>
          </button>

        </nav>

      </div>


      <div className="sidebar-divider">
      </div>


      <div className="sidebar-section recent-section">

        <p className="section-label">
          RECENT
        </p>


        <div className="recent-list">

          {documents.length === 0 ? (

            <div className="recent-empty">
              No documents yet
            </div>

          ) : (

            documents.map(
              (document) => {

                const isSelected =
                  selectedDocument?.id ===
                  document.id;

                const isDeleting =
                  deletingDocumentId ===
                  document.id;


                return (

                  <div
                    key={document.id}
                    className={`recent-document-row ${
                      isSelected &&
                      activeView === "documents"
                        ? "selected-document"
                        : ""
                    }`}
                  >

                    <button
                      type="button"
                      className="recent-document"
                      onClick={() =>
                        onSelectDocument(
                          document
                        )
                      }
                      title={document.name}
                    >

                      <span className="recent-document-dot">
                        •
                      </span>


                      <span className="recent-document-name">

                        {document.name}

                      </span>

                    </button>


                    <button
                      type="button"
                      className="document-delete-button"
                      onClick={(event) => {

                        event.stopPropagation();

                        onDeleteDocument(
                          document.id
                        );

                      }}
                      disabled={isDeleting}
                      aria-label={`Delete ${document.name}`}
                      title={`Delete ${document.name}`}
                    >

                      {isDeleting
                        ? "..."
                        : "×"}

                    </button>

                  </div>

                );

              }
            )

          )}

        </div>

      </div>

    </aside>

  );

}


export default Sidebar;