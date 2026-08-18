function DocumentPreview({ document }) {
  return (
    <section className="document-preview">

      <div className="preview-header">
        <span>DOCUMENT PREVIEW</span>

        <span>
          Page {document.page}
        </span>
      </div>

      <div className="document-page">

        <div className="page-content">

          <div className="document-title">
            {document.name.replace(".pdf", "")}
          </div>

          <div className="document-line large" />
          <div className="document-line" />
          <div className="document-line" />
          <div className="document-line medium" />

          <br />

          <div className="document-line" />
          <div className="document-line large" />
          <div className="document-line" />
          <div className="document-line medium" />

        </div>

        <div className="page-number">
          {document.page}
        </div>

      </div>

    </section>
  );
}

export default DocumentPreview;