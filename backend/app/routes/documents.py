import os
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_service import extract_pdf_text


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )


    document_id = str(uuid.uuid4())

    safe_filename = f"{document_id}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_DIR,
        safe_filename
    )


    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    pages = extract_pdf_text(file_path)


    total_characters = sum(
        len(page["text"])
        for page in pages
    )


    return {
        "id": document_id,
        "filename": file.filename,
        "pages": len(pages),
        "characters": total_characters,
        "status": "processed"
    }