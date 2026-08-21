import json
import os


DATA_DIR = "data"
REGISTRY_PATH = os.path.join(
    DATA_DIR,
    "documents.json"
)


def load_documents():

    if not os.path.exists(REGISTRY_PATH):
        return []

    with open(
        REGISTRY_PATH,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def save_documents(documents):

    os.makedirs(
        DATA_DIR,
        exist_ok=True
    )

    with open(
        REGISTRY_PATH,
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

    save_documents(updated_documents)

    return deleted_document

def get_document(document_id):

    documents = load_documents()

    for document in documents:

        if document["id"] == document_id:
            return document

    return None