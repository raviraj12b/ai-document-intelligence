import os

from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.routes.chat import (
    router as chat_router
)
from app.routes.documents import (
    router as documents_router
)
from app.routes.health import (
    router as health_router
)


app = FastAPI(
    title="DOCUAI API",
    description=(
        "AI Document Intelligence Backend"
    ),
    version="1.0.0"
)


allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


frontend_url = os.getenv(
    "FRONTEND_URL"
)

if frontend_url:

    normalized_frontend_url = (
        frontend_url.rstrip("/")
    )

    if (
        normalized_frontend_url
        not in allowed_origins
    ):
        allowed_origins.append(
            normalized_frontend_url
        )


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    health_router
)

app.include_router(
    documents_router
)

app.include_router(
    chat_router
)


@app.get("/")
def root():

    return {
        "message": (
            "DOCUAI API is running"
        )
    }
