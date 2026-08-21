import { useEffect, useState } from "react";

import {
  Document,
  Page,
  pdfjs
} from "react-pdf";

import {
  API_BASE_URL
} from "../api";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";


pdfjs.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();


function DocumentPreview({
  document,
  currentPage,
  onPageChange
}) {

  const [numPages, setNumPages] =
    useState(null);

  const [loadingError, setLoadingError] =
    useState("");


  useEffect(() => {

    setNumPages(null);
    setLoadingError("");

  }, [document?.id]);


  if (!document) {
    return null;
  }


  const fileUrl =
    `${API_BASE_URL}/documents/${document.id}/file`;


  const handleDocumentLoad = ({
    numPages
  }) => {

    setNumPages(numPages);
    setLoadingError("");

  };


  const previousPage = () => {

    if (currentPage > 1) {

      onPageChange(
        currentPage - 1
      );

    }

  };


  const nextPage = () => {

    if (
      numPages &&
      currentPage < numPages
    ) {

      onPageChange(
        currentPage + 1
      );

    }

  };


  return (

    <section className="document-preview">


      <div className="preview-header">

        <span className="preview-title">
          DOCUMENT PREVIEW
        </span>

        <span className="preview-page-count">
          Page {currentPage}
          {numPages
            ? ` / ${numPages}`
            : ""}
        </span>

      </div>


      <div className="pdf-viewer-container">

        <div className="pdf-stage">

          {loadingError ? (

            <div className="pdf-error">
              {loadingError}
            </div>

          ) : (

            <Document
              file={fileUrl}
              onLoadSuccess={
                handleDocumentLoad
              }
              onLoadError={(error) => {

                console.error(error);

                setLoadingError(
                  "Unable to load PDF preview."
                );

              }}
              loading={
                <div className="pdf-loading">
                  Loading document...
                </div>
              }
            >

              <Page
                pageNumber={currentPage}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={560}
              />

            </Document>

          )}

        </div>

      </div>


      <div className="pdf-controls">

        <button
          className="pdf-control-button"
          onClick={previousPage}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          title="Previous page"
        >
          ←
        </button>


        <span className="pdf-page-indicator">

          {currentPage}

          {numPages
            ? ` / ${numPages}`
            : ""}

        </span>


        <button
          className="pdf-control-button"
          onClick={nextPage}
          disabled={
            !numPages ||
            currentPage >= numPages
          }
          aria-label="Next page"
          title="Next page"
        >
          →
        </button>

      </div>


    </section>

  );

}


export default DocumentPreview;
