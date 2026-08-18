const API_BASE_URL = "http://localhost:8000";


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