function Overview({
  documents,
  backendStatus,
  onAddDocument
}) {

  const totalDocuments =
    documents.length;

  const totalPages =
    documents.reduce(
      (total, document) =>
        total + (document.pages || 0),
      0
    );

  const totalCharacters =
    documents.reduce(
      (total, document) =>
        total + (document.characters || 0),
      0
    );

  const indexedDocuments =
    documents.filter(
      (document) =>
        document.status === "indexed"
    ).length;


  return (
    <section className="overview">

      <div className="overview-heading">

        <div>
          <p className="overview-eyebrow">
            WORKSPACE OVERVIEW
          </p>

          <h1>
            Document intelligence dashboard
          </h1>

          <p className="overview-description">
            Monitor your indexed documents and
            knowledge workspace.
          </p>
        </div>


        <button
          className="overview-upload-button"
          onClick={onAddDocument}
        >
          + Add document
        </button>

      </div>


      <div className="overview-stats">

        <div className="overview-stat-card">

          <span className="stat-label">
            DOCUMENTS
          </span>

          <strong>
            {totalDocuments}
          </strong>

          <span className="stat-description">
            Uploaded files
          </span>

        </div>


        <div className="overview-stat-card">

          <span className="stat-label">
            INDEXED
          </span>

          <strong>
            {indexedDocuments}
          </strong>

          <span className="stat-description">
            Ready for RAG
          </span>

        </div>


        <div className="overview-stat-card">

          <span className="stat-label">
            PAGES
          </span>

          <strong>
            {totalPages}
          </strong>

          <span className="stat-description">
            Processed pages
          </span>

        </div>


        <div className="overview-stat-card">

          <span className="stat-label">
            BACKEND
          </span>

          <strong className={`overview-health ${backendStatus}`}>
            {backendStatus === "connected"
              ? "Online"
              : backendStatus === "checking"
                ? "Checking"
                : "Offline"}
          </strong>

          <span className="stat-description">
            API connection
          </span>

        </div>

      </div>


      <div className="overview-grid">

        <div className="overview-panel">

          <div className="overview-panel-header">

            <div>
              <p className="panel-eyebrow">
                RECENT DOCUMENTS
              </p>

              <h2>
                Knowledge base
              </h2>
            </div>

            <span>
              {totalDocuments}
            </span>

          </div>


          {documents.length > 0 ? (

            <div className="overview-document-list">

              {documents
                .slice(0, 5)
                .map((document) => (

                  <div
                    className="overview-document"
                    key={document.id}
                  >

                    <div className="overview-document-icon">
                      PDF
                    </div>


                    <div className="overview-document-info">

                      <strong>
                        {document.name}
                      </strong>

                      <span>
                        {document.pages || 0} pages
                      </span>

                    </div>


                    <span
                      className={`overview-document-status ${
                        document.status || ""
                      }`}
                    >
                      {document.status || "unknown"}
                    </span>

                  </div>

                ))}

            </div>

          ) : (

            <div className="overview-empty">

              <p>
                No documents uploaded yet.
              </p>

              <button onClick={onAddDocument}>
                Upload your first document
              </button>

            </div>

          )}

        </div>


        <div className="overview-panel overview-storage">

          <p className="panel-eyebrow">
            KNOWLEDGE BASE
          </p>

          <h2>
            Processing summary
          </h2>


          <div className="processing-summary">

            <div>

              <span>
                Total characters
              </span>

              <strong>
                {totalCharacters.toLocaleString()}
              </strong>

            </div>


            <div>

              <span>
                Indexed documents
              </span>

              <strong>
                {indexedDocuments}
                /
                {totalDocuments}
              </strong>

            </div>


            <div>

              <span>
                Vector search
              </span>

              <strong>
                FAISS
              </strong>

            </div>


            <div>

              <span>
                AI model
              </span>

              <strong>
                Groq
              </strong>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


export default Overview;