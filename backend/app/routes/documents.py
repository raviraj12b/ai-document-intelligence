import os
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_service import extract_pdf_text
from app.services.document_registry import add_document, load_documents, delete_document

from app.rag.chunker import chunk_pages
from app.rag.embeddings import create_embeddings
from app.rag.vector_store import add_to_vector_store, get_metadata, rebuild_vector_store


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.get("")
def get_documents():

    documents = load_documents()

    return {
        "documents": documents
    }


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    filename = file.filename

    if not filename or not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )


    document_id = str(
        uuid.uuid4()
    )


    safe_filename = (
        f"{document_id}_{filename}"
    )


    file_path = os.path.join(
        UPLOAD_DIR,
        safe_filename
    )


    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    # 1. Extract PDF text

    pages = extract_pdf_text(
        file_path
    )


    # 2. Split text into chunks

    chunks = chunk_pages(
        pages
    )
    if not chunks:
        raise HTTPException(
        status_code=400,
        detail="No extractable text was found in the PDF."
    )


    # 3. Create embeddings

    texts = [
        chunk["text"]
        for chunk in chunks
    ]


    embeddings = create_embeddings(
        texts
    )


    # 4. Create metadata

    metadata = [
        {
            "document_id": document_id,
            "text": chunk["text"],
            "source": filename,
            "page": chunk["page"]
        }
        for chunk in chunks
    ]


    # 5. Add vectors to FAISS

    add_to_vector_store(
        embeddings,
        metadata
    )


    total_characters = sum(
        len(page["text"])
        for page in pages
    )


    document_record = {
        "id": document_id,
        "filename": filename,
        "stored_filename": safe_filename,
        "pages": len(pages),
        "characters": total_characters,
        "chunks": len(chunks),
        "status": "indexed"
    }


    add_document(
        document_record
    )


    return document_record

@router.delete("/{document_id}")
def remove_document(document_id: str):

    deleted_document = delete_document(
        document_id
    )

    if deleted_document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )


    metadata = get_metadata()


    remaining_metadata = [
        item
        for item in metadata
        if item.get("document_id") != document_id
    ]


    if remaining_metadata:

        texts = [
            item["text"]
            for item in remaining_metadata
        ]

        embeddings = create_embeddings(
            texts
        )

        rebuild_vector_store(
            embeddings,
            remaining_metadata
        )

    else:

        rebuild_vector_store(
            [],
            []
        )

    stored_filename = deleted_document.get(
    "stored_filename"
    )

    if not stored_filename:

        filename = deleted_document.get(
        "filename"
        )

    if filename:
        stored_filename = (
            f"{document_id}_{filename}"
        )


    if stored_filename:

        file_path = os.path.join(
        UPLOAD_DIR,
        stored_filename
         )

    if os.path.exists(file_path):

        os.remove(file_path)

    else:
        print(f"Uploaded file not found: {file_path}")

    return{
        "message": "Document deleted successfully.",
        "id": document_id
    }