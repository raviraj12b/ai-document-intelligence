import {useEffect, useState } from "react";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DocumentPreview from "./components/DocumentPreview";
import AIAnalysis from "./components/AIAnalysis";
import { checkBackendHealth, uploadDocument } from "./api";


function App() {

  const [backendStatus, setBackendStatus] =
    useState("checking");

  const [uploading, setUploading] =
    useState(false);




  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Research Report.pdf",
      page: 42
    },

    {
      id: 2,
      name: "Contract.pdf",
      page: 12
    },

    {
      id: 3,
      name: "Report.pdf",
      page: 7
    }  
  ]);


  const [selectedDocument, setSelectedDocument] = useState(documents[0]);


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
        characters: uploadedDocument.characters
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
                {selectedDocument.name}
              </h1>
            </div>


            <span className="indexed-status">
              ● Indexed
            </span>

          </div>


          <div className="workspace">

            <DocumentPreview
              document={selectedDocument}
            />

            <AIAnalysis
              document={selectedDocument}
            />

          </div>

        </main>

      </div>

    </div>
  );
}

export default App;