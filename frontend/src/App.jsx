import { useEffect, useState } from "react";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DocumentPreview from "./components/DocumentPreview";
import AIAnalysis from "./components/AIAnalysis";
import Overview from "./components/Overview";
import Collections from "./components/Collections";
import Toast from "./components/Toast";
import DeleteModal from "./components/DeleteModal";
import UploadProgress from "./components/UploadProgress";

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

  const [uploadStage, setUploadStage] =
    useState("");

  const [uploadFileName, setUploadFileName] =
    useState("");

  const [documents, setDocuments] =
    useState([]);

  const [selectedDocument, setSelectedDocument] =
    useState(null);

  const [deletingDocumentId, setDeletingDocumentId] =
    useState(null);

  const [documentPendingDelete, setDocumentPendingDelete] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [activeView, setActiveView] =
    useState("documents");

  const [toast, setToast] =
    useState({
      message: "",
      type: "success"
    });


  /* =========================================================
     TOAST
  ========================================================= */

  const showToast = (
    message,
    type = "success"
  ) => {

    setToast({
      message,
      type
    });

    setTimeout(() => {

      setToast({
        message: "",
        type: "success"
      });

    }, 3500);

  };


  /* =========================================================
     BACKEND HEALTH
  ========================================================= */

  useEffect(() => {

    async function checkConnection() {

      try {

        await checkBackendHealth();

        setBackendStatus(
          "connected"
        );

      } catch (error) {

        console.error(error);

        setBackendStatus(
          "offline"
        );

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

              id:
                document.id,

              name:
                document.filename,

              page:
                1,

              pages:
                document.pages,

              characters:
                document.characters,

              status:
                document.status

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
      document.createElement(
        "input"
      );

    input.type =
      "file";

    input.accept =
      ".pdf";


    input.onchange =
      async (event) => {

        const file =
          event.target.files[0];


        if (!file) {
          return;
        }


        let stageTimerOne;
        let stageTimerTwo;
        let stageTimerThree;


        try {

          setUploading(true);

          setUploadFileName(
            file.name
          );

          setUploadStage(
            "uploading"
          );


          stageTimerOne =
            setTimeout(() => {

              setUploadStage(
                "extracting"
              );

            }, 700);


          stageTimerTwo =
            setTimeout(() => {

              setUploadStage(
                "embedding"
              );

            }, 1700);


          stageTimerThree =
            setTimeout(() => {

              setUploadStage(
                "indexing"
              );

            }, 2900);


          const uploadedDocument =
            await uploadDocument(
              file
            );


          clearTimeout(
            stageTimerOne
          );

          clearTimeout(
            stageTimerTwo
          );

          clearTimeout(
            stageTimerThree
          );


          setUploadStage(
            "ready"
          );


          const newDocument = {

            id:
              uploadedDocument.id,

            name:
              uploadedDocument.filename,

            page:
              1,

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


          setCurrentPage(
            1
          );


          setActiveView(
            "documents"
          );


          showToast(
            `${uploadedDocument.filename} uploaded and indexed successfully.`,
            "success"
          );


          setTimeout(() => {

            setUploadStage(
              ""
            );

            setUploadFileName(
              ""
            );

          }, 900);


        } catch (error) {

          clearTimeout(
            stageTimerOne
          );

          clearTimeout(
            stageTimerTwo
          );

          clearTimeout(
            stageTimerThree
          );


          console.error(
            "Failed to upload document:",
            error
          );


          setUploadStage(
            "failed"
          );


          showToast(
            error.message ||
            "Failed to upload document.",
            "error"
          );


          setTimeout(() => {

            setUploadStage(
              ""
            );

            setUploadFileName(
              ""
            );

          }, 1800);


        } finally {

          setUploading(
            false
          );

        }

      };


    input.click();

  };


  /* =========================================================
     OPEN DELETE MODAL
  ========================================================= */

  const handleDeleteDocument = (
    documentId
  ) => {

    const documentToDelete =
      documents.find(
        (document) =>
          document.id ===
          documentId
      );


    if (!documentToDelete) {
      return;
    }


    setDocumentPendingDelete(
      documentToDelete
    );

  };


  /* =========================================================
     CONFIRM DELETE
  ========================================================= */

  const confirmDeleteDocument =
    async () => {

      if (!documentPendingDelete) {
        return;
      }


      const documentId =
        documentPendingDelete.id;


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
              document.id !==
              documentId
          );


        setDocuments(
          updatedDocuments
        );


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


          setCurrentPage(
            1
          );

        }


        showToast(
          `${documentPendingDelete.name} deleted successfully.`,
          "success"
        );


        setDocumentPendingDelete(
          null
        );


      } catch (error) {

        console.error(
          "Failed to delete document:",
          error
        );


        showToast(
          error.message ||
          "Failed to delete document.",
          "error"
        );


      } finally {

        setDeletingDocumentId(
          null
        );

      }

    };


  /* =========================================================
     CANCEL DELETE
  ========================================================= */

  const cancelDeleteDocument = () => {

    if (deletingDocumentId) {
      return;
    }


    setDocumentPendingDelete(
      null
    );

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


    setCurrentPage(
      1
    );


    setActiveView(
      "documents"
    );

  };


  /* =========================================================
     CLOSE TOAST
  ========================================================= */

  const handleCloseToast = () => {

    setToast({
      message: "",
      type: "success"
    });

  };


  /* =========================================================
     DOCUMENT WORKSPACE
  ========================================================= */

  const renderDocumentWorkspace = () => {

    return (

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
              Upload a document to get started.
            </p>

          </div>

        )}

      </>

    );

  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <div className="app">


      <Toast
        message={
          toast.message
        }

        type={
          toast.type
        }

        onClose={
          handleCloseToast
        }
      />


      <DeleteModal
        document={
          documentPendingDelete
        }

        deleting={
          deletingDocumentId ===
          documentPendingDelete?.id
        }

        onCancel={
          cancelDeleteDocument
        }

        onConfirm={
          confirmDeleteDocument
        }
      />


      <UploadProgress
        fileName={
          uploadFileName
        }

        stage={
          uploadStage
        }

        visible={
          Boolean(uploadStage)
        }
      />


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

          uploadStage={
            uploadStage
          }
        />


        <main className="main-content">


          {activeView ===
          "overview" ? (

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


          ) : activeView ===
            "collections" ? (

            <Collections />


          ) : (

            renderDocumentWorkspace()

          )}


        </main>

      </div>

    </div>

  );

}


export default App;