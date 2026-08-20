import json
import os

import faiss
import numpy as np


VECTOR_STORE_DIR = "vector_store"

INDEX_PATH = os.path.join(
    VECTOR_STORE_DIR,
    "documents.index"
)

METADATA_PATH = os.path.join(
    VECTOR_STORE_DIR,
    "metadata.json"
)


def load_vector_store():

    if not os.path.exists(INDEX_PATH):
        return None, []

    index = faiss.read_index(
        INDEX_PATH
    )

    if not os.path.exists(METADATA_PATH):
        return index, []

    with open(
        METADATA_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        metadata = json.load(file)

    return index, metadata


def add_to_vector_store(
    embeddings,
    new_metadata
):

    os.makedirs(
        VECTOR_STORE_DIR,
        exist_ok=True
    )

    embeddings = np.asarray(
        embeddings,
        dtype="float32"
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
        existing_metadata +
        new_metadata
    )

    faiss.write_index(
        index,
        INDEX_PATH
    )

    with open(
        METADATA_PATH,
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

    os.makedirs(
        VECTOR_STORE_DIR,
        exist_ok=True
    )

    if len(metadata) == 0:

        if os.path.exists(INDEX_PATH):
            os.remove(INDEX_PATH)

        if os.path.exists(METADATA_PATH):
            os.remove(METADATA_PATH)

        return


    embeddings = np.asarray(
        embeddings,
        dtype="float32"
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
        INDEX_PATH
    )

    with open(
        METADATA_PATH,
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