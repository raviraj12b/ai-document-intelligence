import json

from app.config import (
    DOCUMENT_DATA_DIR,
    DOCUMENT_REGISTRY_FILE
)


def load_documents():

    if not DOCUMENT_REGISTRY_FILE.exists():
        return []

    with DOCUMENT_REGISTRY_FILE.open(
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def save_documents(documents):

    DOCUMENT_DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    with DOCUMENT_REGISTRY_FILE.open(
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            documents,
            file,
            ensure_ascii=False,
            indent=2
        )


def add_document(document):

    documents = load_documents()

    documents.append(document)

    save_documents(documents)

    return document


def delete_document(document_id):

    documents = load_documents()

    updated_documents = [
        document
        for document in documents
        if document["id"] != document_id
    ]

    if len(updated_documents) == len(documents):
        return None

    deleted_document = next(
        document
        for document in documents
        if document["id"] == document_id
    )

    save_documents(
        updated_documents
    )

    return deleted_document


def get_document(document_id):

    documents = load_documents()

    for document in documents:

        if document["id"] == document_id:
            return document

    return None
