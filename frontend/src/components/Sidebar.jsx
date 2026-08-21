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

      <div className="sidebar-section">

        <p className="section-label">
          WORKSPACE
        </p>

        <nav>
          <button className="nav-item active">
            Overview
          </button>

          <button className="nav-item">
            Documents
          </button>

          <button className="nav-item">
            Collections
          </button>
        </nav>

      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">

        <p className="section-label">
          RECENT
        </p>

        {documents.map((document) => (
          <div
            key={document.id}
            className={`recent-document-row ${
              selectedDocument?.id === document.id
                ? "selected-document"
                : ""
            }`}
          >

            <button
              className="recent-document"
              onClick={() =>
                onSelectDocument(document)
              }
            >
              {document.name}
            </button>

            <button
              className="document-delete-button"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteDocument(document.id);
              }}
              disabled={
                deletingDocumentId === document.id
              }
              aria-label={`Delete ${document.name}`}
            >
              {deletingDocumentId === document.id
                ? "..."
                : "×"}
            </button>

          </div>
        ))}

      </div>

      <button
        className="add-document"
        onClick={onAddDocument}
        disabled={uploading}
      >
        {uploading
          ? "Processing..."
          : "+ Add document"}
      </button>

    </aside>
  );
}

export default Sidebar;