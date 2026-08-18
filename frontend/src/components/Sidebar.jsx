function Sidebar({
  documents,
  selectedDocument,
  onSelectDocument,
  onAddDocument,
  uploading
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

          <button
            key={document.id}
            className={`recent-document ${
              selectedDocument?.id === document.id
                ? "selected-document"
                : ""
            }`}
            onClick={() =>
              onSelectDocument(document)
            }
          >
            {document.name}
          </button>

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