import {useEffect, useState } from "react";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DocumentPreview from "./components/DocumentPreview";
import AIAnalysis from "./components/AIAnalysis";
import { checkBackendHealth, uploadDocument , getDocuments} from "./api";


function App() {

  const [backendStatus, setBackendStatus] =
    useState("checking");

  const [uploading, setUploading] =
    useState(false);
  
  const [documents, setDocuments] =
    useState([]);

  const [selectedDocument, setSelectedDocument] =
    useState(null);


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
            characters:
              document.characters,
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

  const handleAddDocument = () => {

  const input = document.createElement("input");

  input.type = "file";
  input.accept = ".pdf";


  input.onchange = async (event) => {

    const file = event.target.files[0];

    if (!file) {
      return;
    }


    try {

      setUploading(true);


      const uploadedDocument =
        await uploadDocument(file);


      const newDocument = {
        id: uploadedDocument.id,
        name: uploadedDocument.filename,
        page: 1,
        pages: uploadedDocument.pages,
        characters: uploadedDocument.characters,
        status: uploadDocument.status
      };

      setDocuments((previousDocuments) => [
        newDocument,
        ...previousDocuments
      ]);


      setSelectedDocument(newDocument);


      alert(
        `${uploadedDocument.filename} uploaded successfully.`
      );


    } catch (error) {

      console.error(error);

      alert(error.message);


    } finally {

      setUploading(false);

    }

  };


  input.click();
};


  return (

    <div className="app">

      <Header backendStatus={backendStatus} />


      <div className="app-body">

        <Sidebar
          documents={documents}
          selectedDocument={selectedDocument}
          onSelectDocument={setSelectedDocument}
          onAddDocument={handleAddDocument}
          uploading={uploading}
        />


        <main className="main-content">

          <div className="document-header">

            <div>
              <h1>
                {selectedDocument?.name || "No document selected"}
              </h1>
            </div>


            <span className="indexed-status">
              ● Indexed
            </span>

          </div>


        {selectedDocument ? (

          <div className="workspace">

            <DocumentPreview
              document={selectedDocument}
            />

            <AIAnalysis
              document={selectedDocument}
            />

          </div>

        ) : (

          <div className="empty-workspace">
            <p>Upload a document to get started.</p>
          </div>

        )}

        </main>

      </div>

    </div>
  );
}

export default App;