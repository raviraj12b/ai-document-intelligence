# DOCUAI

DOCUAI is a full-stack RAG application for working with PDF documents. Users can upload a PDF, ask questions about its content, view the supporting sources, and jump directly to the referenced page in the document.

**Live app:** https://docuai-virid.vercel.app  
**Backend API:** https://ai-document-intelligence-production-5466.up.railway.app  
**API docs:** https://ai-document-intelligence-production-5466.up.railway.app/docs

## Features

- Upload and index PDF documents
- Ask document-specific questions using RAG
- Semantic retrieval with Sentence Transformers and FAISS
- Grounded answers generated with Groq
- Source references with exact PDF page navigation
- Multiple document support with persistent storage
- Document deletion with FAISS index rebuilding
- Overview dashboard, upload progress, toasts, and custom delete confirmation

## Tech Stack

**Frontend:** React, Vite, JavaScript, CSS, React PDF  
**Backend:** FastAPI, Python, Uvicorn  
**RAG:** LangChain, Groq, Sentence Transformers, FAISS  
**PDF processing:** PyMuPDF  
**Deployment:** Vercel + Railway

## How It Works

```text
PDF Upload
    ↓
PyMuPDF text extraction
    ↓
Chunking
    ↓
Sentence Transformer embeddings
    ↓
FAISS indexing
    ↓
User question
    ↓
Relevant chunk retrieval
    ↓
LangChain + Groq
    ↓
Answer + sources
    ↓
Open exact PDF page
```

## Screenshots

### Overview

![DOCUAI Overview](docs/screenshots/overview.png)

### Document Workspace

![DOCUAI Document Workspace](docs/screenshots/document-uploaded.png)

### RAG Answer

![DOCUAI RAG Answer](docs/screenshots/rag-answer.png)

## Project Structure

```text
ai-document-intelligence/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   └── rag/
│   ├── tests/
│   ├── data/
│   ├── uploads/
│   ├── vector_store/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── api.js
│   └── package.json
│
├── docs/
│   └── screenshots/
│
├── .gitignore
└── README.md
```

## Local Setup

Clone the repository:

```bash
git clone https://github.com/raviraj12b/ai-document-intelligence.git
cd ai-document-intelligence
```

### Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

```bash
# Windows
venv\Scripts\activate

# Git Bash
source venv/Scripts/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Run the API:

```bash
uvicorn app.main:app --reload
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to the local backend at:

```text
http://127.0.0.1:8000
```

You can also create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Backend health check |
| `GET` | `/documents` | List documents |
| `POST` | `/documents/upload` | Upload and index a PDF |
| `GET` | `/documents/{id}/file` | Serve the original PDF |
| `DELETE` | `/documents/{id}` | Delete a document |
| `POST` | `/api/chat` | Ask a question about a document |

## Testing

The backend includes pytest coverage for the RAG and retrieval layers.

```bash
cd backend
pytest -v
```

Current test suite:

```text
6 passed
```

## Deployment

The frontend is deployed on **Vercel** and the FastAPI backend is deployed on **Railway**.

Railway persistent storage is used for:

```text
/data/uploads/
/data/data/documents.json
/data/vector_store/
```

This keeps uploaded PDFs, document metadata, and the FAISS index available across backend restarts and redeployments.

## Current Limitations

- PDFs must contain extractable text; OCR for scanned PDFs is not implemented yet.
- Collections are currently a UI preview for a future multi-document RAG workflow.
- The current vector store uses FAISS with document-level filtering.

## Author

**Rajesh Borkar**  
AI & Data Science Student

- GitHub: https://github.com/raviraj12b
- LinkedIn: https://www.linkedin.com/in/rajeshborkar01
- Email: rajeshborkar04@gmail.com
