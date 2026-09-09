import os
from pathlib import Path


# backend/
BACKEND_DIR = Path(__file__).resolve().parent.parent


# Local development:
#   DOCUAI_DATA_DIR is not set -> backend/
#
# Production:
#   DOCUAI_DATA_DIR=/data -> Railway persistent volume
DATA_ROOT = Path(
    os.getenv(
        "DOCUAI_DATA_DIR",
        str(BACKEND_DIR)
    )
).expanduser().resolve()


UPLOAD_DIR = DATA_ROOT / "uploads"

DOCUMENT_DATA_DIR = DATA_ROOT / "data"

VECTOR_STORE_DIR = DATA_ROOT / "vector_store"


DOCUMENT_REGISTRY_FILE = (
    DOCUMENT_DATA_DIR
    / "documents.json"
)

FAISS_INDEX_FILE = (
    VECTOR_STORE_DIR
    / "documents.index"
)

FAISS_METADATA_FILE = (
    VECTOR_STORE_DIR
    / "metadata.json"
)


def ensure_storage_directories():
    """Create all DOCUAI storage directories if they do not exist."""

    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    DOCUMENT_DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    VECTOR_STORE_DIR.mkdir(
        parents=True,
        exist_ok=True
    )


ensure_storage_directories()
