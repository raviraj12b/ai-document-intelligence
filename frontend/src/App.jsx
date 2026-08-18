import { useState } from "react";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DocumentPreview from "./components/DocumentPreview";
import AIAnalysis from "./components/AIAnalysis";


function App() {

  const documents = [
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
  ];


  const [selectedDocument, setSelectedDocument] =
    useState(documents[0]);


  return (

    <div className="app">

      <Header />


      <div className="app-body">

        <Sidebar
          documents={documents}
          selectedDocument={selectedDocument}
          onSelectDocument={setSelectedDocument}
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