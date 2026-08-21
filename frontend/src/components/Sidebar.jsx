function Sidebar({
  documents,
  selectedDocument,
  onSelectDocument,
  onAddDocument,
  onDeleteDocument,
  uploading,
  deletingDocumentId
}) {

  return (
    <aside className="sidebar">

      <button
        className="add-document"
        onClick={onAddDocument}
        disabled={uploading}
      >
        <span className="add-document-icon">
          +
        </span>

        <span>
          {uploading
            ? "Processing..."
            : "Add document"}
        </span>
      </button>


      <div className="sidebar-section">

        <p className="section-label">
          WORKSPACE
        </p>

        <nav className="sidebar-nav">

          <button
            className="nav-item nav-item-muted"
            type="button"
            disabled
            title="Overview — coming soon"
          >
            <span className="nav-label">
              Overview
            </span>
          </button>

          <button
            className="nav-item active"
            type="button"
            aria-current="page"
          >
            <span className="nav-label">
              Documents
            </span>
          </button>

          <button
            className="nav-item nav-item-muted"
            type="button"
            disabled
            title="Collections — coming soon"
          >
            <span className="nav-label">
              Collections
            </span>
          </button>

        </nav>

      </div>


      <div className="sidebar-divider" />


      <div className="sidebar-section recent-section">

        <p className="section-label">
          RECENT
        </p>


        <div className="recent-list">

          {documents.map((document) => {

            const isSelected =
              selectedDocument?.id === document.id;

            const isDeleting =
              deletingDocumentId === document.id;

            return (

              <div
                key={document.id}
                className={`recent-document-row ${
                  isSelected
                    ? "selected-document"
                    : ""
                }`}
              >

                <button
                  className="recent-document"
                  onClick={() =>
                    onSelectDocument(document)
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
                  className="document-delete-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteDocument(document.id);
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

          })}

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
