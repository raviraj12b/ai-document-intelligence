export const API_BASE_URL = "http://127.0.0.1:8000";


export async function checkBackendHealth() {

  const response = await fetch(
    `${API_BASE_URL}/health`
  );

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
}


export async function uploadDocument(file) {

  const formData = new FormData();

  formData.append("file", file);


  const response = await fetch(
    `${API_BASE_URL}/documents/upload`,
    {
      method: "POST",
      body: formData
    }
  );


  if (!response.ok) {

    const errorData = await response.json();

    throw new Error(
      errorData.detail || "Document upload failed"
    );
  }


  return response.json();
}

export async function askQuestion(question, documentId ) {

  const response = await fetch(
    "http://127.0.0.1:8000/api/chat",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        question: question,
        document_id: documentId
      })
    }
  );


  if (!response.ok) {

    const errorData =
      await response.json();

    throw new Error(
      errorData.detail ||
      "Failed to get AI response."
    );
  }


  return await response.json();
}

export async function getDocuments() {

  const response = await fetch(
    "http://127.0.0.1:8000/documents"
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load documents."
    );
  }

  return await response.json();
}

export async function deleteDocument(documentId) {

  const response = await fetch(
    `http://127.0.0.1:8000/documents/${documentId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {

    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
      "Failed to delete document."
    );
  }

  return await response.json();
}