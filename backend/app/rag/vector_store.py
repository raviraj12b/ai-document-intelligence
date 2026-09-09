import json

import faiss
import numpy as np

from app.config import (
    FAISS_INDEX_FILE,
    FAISS_METADATA_FILE,
    VECTOR_STORE_DIR
)


def load_vector_store():

    if not FAISS_INDEX_FILE.exists():
        return None, []

    index = faiss.read_index(
        str(FAISS_INDEX_FILE)
    )

    if not FAISS_METADATA_FILE.exists():
        return index, []

    with FAISS_METADATA_FILE.open(
        "r",
        encoding="utf-8"
    ) as file:

        metadata = json.load(file)

    return index, metadata


def add_to_vector_store(
    embeddings,
    new_metadata
):

    VECTOR_STORE_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    embeddings = np.asarray(
        embeddings,
        dtype="float32"
    )

    if (
        embeddings.ndim != 2
        or embeddings.shape[0] == 0
    ):
        raise ValueError(
            "Embeddings must be a non-empty 2D array."
        )

    existing_index, existing_metadata = (
        load_vector_store()
    )

    if existing_index is None:

        dimension = embeddings.shape[1]

        index = faiss.IndexFlatIP(
            dimension
        )

    else:

        index = existing_index

        if index.d != embeddings.shape[1]:
            raise ValueError(
                "Embedding dimension does not match "
                "the existing FAISS index."
            )

    index.add(
        embeddings
    )

    combined_metadata = (
        existing_metadata
        + new_metadata
    )

    faiss.write_index(
        index,
        str(FAISS_INDEX_FILE)
    )

    with FAISS_METADATA_FILE.open(
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            combined_metadata,
            file,
            ensure_ascii=False,
            indent=2
        )


def rebuild_vector_store(
    embeddings,
    metadata
):

    VECTOR_STORE_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    if len(metadata) == 0:

        if FAISS_INDEX_FILE.exists():
            FAISS_INDEX_FILE.unlink()

        if FAISS_METADATA_FILE.exists():
            FAISS_METADATA_FILE.unlink()

        return

    embeddings = np.asarray(
        embeddings,
        dtype="float32"
    )

    if (
        embeddings.ndim != 2
        or embeddings.shape[0] == 0
    ):
        raise ValueError(
            "Embeddings must be a non-empty 2D array."
        )

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatIP(
        dimension
    )

    index.add(
        embeddings
    )

    faiss.write_index(
        index,
        str(FAISS_INDEX_FILE)
    )

    with FAISS_METADATA_FILE.open(
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            metadata,
            file,
            ensure_ascii=False,
            indent=2
        )


def get_metadata():

    _, metadata = load_vector_store()

    return metadata
