export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


/* =========================================================
   RESPONSE HELPER
========================================================= */

async function handleResponse(response) {

  if (!response.ok) {

    let message = "Something went wrong.";

    try {

      const errorData =
        await response.json();

      message =
        errorData.detail ||
        errorData.message ||
        message;

    } catch {
      // Ignore JSON parsing failure.
    }


    throw new Error(message);

  }


  return response.json();

}


/* =========================================================
   HEALTH
========================================================= */

export async function checkBackendHealth() {

  const response = await fetch(
    `${API_BASE_URL}/health`
  );


  return handleResponse(response);

}


/* =========================================================
   GET DOCUMENTS
========================================================= */

export async function getDocuments() {

  const response = await fetch(
    `${API_BASE_URL}/documents`
  );


  return handleResponse(response);

}


/* =========================================================
   UPLOAD DOCUMENT
========================================================= */

export async function uploadDocument(file) {

  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  const response = await fetch(
    `${API_BASE_URL}/documents/upload`,
    {
      method: "POST",
      body: formData
    }
  );


  return handleResponse(response);

}


/* =========================================================
   DELETE DOCUMENT
========================================================= */

export async function deleteDocument(
  documentId
) {

  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}`,
    {
      method: "DELETE"
    }
  );


  return handleResponse(response);

}


/* =========================================================
   ASK QUESTION
========================================================= */

export async function askQuestion(
  question,
  documentId
) {

  const response = await fetch(
    `${API_BASE_URL}/api/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        question: question,
        document_id: documentId
      })
    }
  );


  return handleResponse(response);

}