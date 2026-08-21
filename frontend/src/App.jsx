import { useEffect, useState } from "react";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DocumentPreview from "./components/DocumentPreview";
import AIAnalysis from "./components/AIAnalysis";
import Overview from "./components/Overview";

import {
  checkBackendHealth,
  uploadDocument,
  getDocuments,
  deleteDocument
} from "./api";


function App() {

  const [backendStatus, setBackendStatus] =
    useState("checking");

  const [uploading, setUploading] =
    useState(false);

  const [documents, setDocuments] =
    useState([]);

  const [selectedDocument, setSelectedDocument] =
    useState(null);

  const [deletingDocumentId, setDeletingDocumentId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [activeView, setActiveView] =
    useState("documents");


  /* =========================================================
     BACKEND HEALTH
  ========================================================= */

  useEffect(() => {

    async function checkConnection() {

      try {

        await checkBackendHealth();

        setBackendStatus("connected");

      } catch (error) {

        console.error(error);

        setBackendStatus("offline");

      }

    }

    checkConnection();

  }, []);


  /* =========================================================
     LOAD DOCUMENTS
  ========================================================= */

  useEffect(() => {

    async function loadDocuments() {

      try {

        const data =
          await getDocuments();


        const formattedDocuments =
          data.documents.map(
            (document) => ({
              id: document.id,
              name: document.filename,
              page: 1,
              pages: document.pages,
              characters: document.characters,
              status: document.status
            })
          );


        setDocuments(
          formattedDocuments
        );


        if (
          formattedDocuments.length > 0
        ) {

          setSelectedDocument(
            formattedDocuments[0]
          );

        }


      } catch (error) {

        console.error(
          "Failed to load documents:",
          error
        );

      }

    }


    loadDocuments();

  }, []);


  /* =========================================================
     ADD DOCUMENT
  ========================================================= */

  const handleAddDocument = () => {

    const input =
      document.createElement("input");

    input.type = "file";

    input.accept = ".pdf";


    input.onchange = async (event) => {

      const file =
        event.target.files[0];


      if (!file) {
        return;
      }


      try {

        setUploading(true);


        const uploadedDocument =
          await uploadDocument(file);


        const newDocument = {

          id: uploadedDocument.id,

          name:
            uploadedDocument.filename,

          page: 1,

          pages:
            uploadedDocument.pages,

          characters:
            uploadedDocument.characters,

          status:
            uploadedDocument.status

        };


        setDocuments(
          (previousDocuments) => [

            newDocument,

            ...previousDocuments

          ]
        );


        setSelectedDocument(
          newDocument
        );


        setCurrentPage(1);


        /*
          If upload was started from Overview,
          automatically open the uploaded PDF.
        */

        setActiveView(
          "documents"
        );


        alert(
          `${uploadedDocument.filename} uploaded successfully.`
        );


      } catch (error) {

        console.error(
          "Failed to upload document:",
          error
        );


        alert(
          error.message ||
          "Failed to upload document."
        );


      } finally {

        setUploading(false);

      }

    };


    input.click();

  };


  /* =========================================================
     DELETE DOCUMENT
  ========================================================= */

  const handleDeleteDocument = async (
    documentId
  ) => {

    const documentToDelete =
      documents.find(
        (document) =>
          document.id === documentId
      );


    if (!documentToDelete) {
      return;
    }


    const confirmed =
      window.confirm(
        `Delete "${documentToDelete.name}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingDocumentId(
        documentId
      );


      await deleteDocument(
        documentId
      );


      const updatedDocuments =
        documents.filter(
          (document) =>
            document.id !== documentId
        );


      setDocuments(
        updatedDocuments
      );


      /*
        If the currently selected
        document was deleted,
        select the next available one.
      */

      if (
        selectedDocument?.id ===
        documentId
      ) {

        const nextDocument =
          updatedDocuments.length > 0
            ? updatedDocuments[0]
            : null;


        setSelectedDocument(
          nextDocument
        );


        setCurrentPage(1);

      }


    } catch (error) {

      console.error(
        "Failed to delete document:",
        error
      );


      alert(
        error.message ||
        "Failed to delete document."
      );


    } finally {

      setDeletingDocumentId(
        null
      );

    }

  };


  /* =========================================================
     SELECT DOCUMENT
  ========================================================= */

  const handleSelectDocument = (
    document
  ) => {

    setSelectedDocument(
      document
    );


    setCurrentPage(1);


    /*
      Selecting a PDF from Recent
      should always open the document
      workspace.
    */

    setActiveView(
      "documents"
    );

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="app">

      <Header
        backendStatus={
          backendStatus
        }
      />


      <div className="app-body">

        <Sidebar
          documents={
            documents
          }

          selectedDocument={
            selectedDocument
          }

          onSelectDocument={
            handleSelectDocument
          }

          onAddDocument={
            handleAddDocument
          }

          onDeleteDocument={
            handleDeleteDocument
          }

          uploading={
            uploading
          }

          deletingDocumentId={
            deletingDocumentId
          }

          activeView={
            activeView
          }

          onViewChange={
            setActiveView
          }
        />


        <main className="main-content">

          {activeView === "overview" ? (

            <Overview
              documents={
                documents
              }

              backendStatus={
                backendStatus
              }

              onAddDocument={
                handleAddDocument
              }
            />

          ) : (

            <>

              <div className="document-header">

                <h1>

                  {selectedDocument?.name ||
                    "No document selected"}

                </h1>


                {selectedDocument && (

                  <span
                    className={`indexed-status ${
                      selectedDocument.status ||
                      "unknown"
                    }`}
                  >

                    <span
                      className="status-dot"
                    >
                    </span>


                    {selectedDocument.status ===
                    "indexed"

                      ? "Indexed"

                      : selectedDocument.status ===
                        "processing"

                        ? "Processing"

                        : selectedDocument.status ===
                          "failed"

                          ? "Failed"

                          : selectedDocument.status ||
                            "Unknown"}

                  </span>

                )}

              </div>


              {selectedDocument ? (

                <div className="workspace">

                  <DocumentPreview
                    document={
                      selectedDocument
                    }

                    currentPage={
                      currentPage
                    }

                    onPageChange={
                      setCurrentPage
                    }
                  />


                  <AIAnalysis
                    document={
                      selectedDocument
                    }

                    onSourcePageSelect={
                      setCurrentPage
                    }
                  />

                </div>

              ) : (

                <div className="empty-workspace">

                  <p>
                    Upload a document to
                    get started.
                  </p>

                </div>

              )}

            </>

          )}

        </main>

      </div>

    </div>

  );

}


export default App;