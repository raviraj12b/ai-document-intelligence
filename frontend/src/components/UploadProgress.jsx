function UploadProgress({
  fileName,
  stage,
  visible
}) {

  if (!visible) {
    return null;
  }


  const stages = [
    {
      id: "uploading",
      label: "Uploading PDF"
    },
    {
      id: "extracting",
      label: "Extracting text"
    },
    {
      id: "embedding",
      label: "Creating embeddings"
    },
    {
      id: "indexing",
      label: "Indexing with FAISS"
    },
    {
      id: "ready",
      label: "Ready"
    }
  ];


  const currentIndex =
    stages.findIndex(
      (item) =>
        item.id === stage
    );


  const failed =
    stage === "failed";


  return (

    <div className="upload-progress-overlay">

      <div className="upload-progress-card">

        <div className="upload-progress-heading">

          <div>

            <p>
              DOCUMENT PROCESSING
            </p>

            <h3>
              {failed
                ? "Processing failed"
                : "Preparing your document"}
            </h3>

          </div>


          <span
            className={`upload-progress-state ${
              failed ? "failed" : ""
            }`}
          >

            {failed
              ? "Failed"
              : stage === "ready"
                ? "Complete"
                : "Processing"}

          </span>

        </div>


        <div className="upload-file-name">
          {fileName}
        </div>


        {!failed && (

          <div className="upload-stage-list">

            {stages.map(
              (item, index) => {

                const completed =
                  index <
                  currentIndex;

                const active =
                  index ===
                  currentIndex;


                return (

                  <div
                    className={`upload-stage ${
                      completed
                        ? "completed"
                        : ""
                    } ${
                      active
                        ? "active"
                        : ""
                    }`}
                    key={
                      item.id
                    }
                  >

                    <span className="upload-stage-dot">

                      {completed
                        ? "✓"
                        : index + 1}

                    </span>


                    <span>
                      {item.label}
                    </span>

                  </div>

                );

              }
            )}

          </div>

        )}


        {failed && (

          <p className="upload-failed-message">
            DOCUAI could not process this
            document. Check the file and try
            again.
          </p>

        )}

      </div>

    </div>

  );

}


export default UploadProgress;