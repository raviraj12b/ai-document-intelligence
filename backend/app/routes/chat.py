from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.rag.rag_chain import ask_document


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    question: str


@router.post("")
async def chat(request: ChatRequest):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:

        result = ask_document(
            request.question
        )

        return result

    except Exception as error:

        print(f"Chat error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Failed to process the question."
        )