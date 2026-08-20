from app.rag.embeddings import create_embeddings
from app.rag.vector_store import load_vector_store


def search_documents(
    query: str,
    top_k: int = 5
):
    index, metadata = load_vector_store()

    if index is None:
        return []

    query_embedding = create_embeddings(
        [query]
    )

    scores, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for score, index_id in zip(
        scores[0],
        indices[0]
    ):

        if index_id == -1:
            continue

        result = metadata[index_id].copy()

        result["score"] = float(score)

        results.append(result)

    return results