from app.rag.embeddings import create_embeddings
from app.rag.vector_store import load_vector_store


def search_documents(
    query: str,
    top_k: int = 5,
    document_id: str | None = None
):
    index, metadata = load_vector_store()

    if index is None:
        return []

    query_embedding = create_embeddings(
        [query]
    )

    search_k = max(
        top_k * 5,
        top_k
    )

    scores, indices = index.search(
        query_embedding,
        search_k
    )

    results = []

    for score, index_id in zip(
        scores[0],
        indices[0]
    ):

        if index_id == -1:
            continue

        item = metadata[index_id]

        if (
            document_id is not None
            and item.get("document_id") != document_id
        ):
            continue

        result = item.copy()

        result["score"] = float(score)

        results.append(result)

        if len(results) >= top_k:
            break

    return results