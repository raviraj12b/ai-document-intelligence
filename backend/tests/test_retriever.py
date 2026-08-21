import numpy as np

import app.rag.retriever as retriever


class FakeIndex:
    """Small FAISS-like index used to test retrieval without a real vector store."""

    def __init__(self, scores, indices):
        self._scores = np.array([scores], dtype=np.float32)
        self._indices = np.array([indices], dtype=np.int64)

    def search(self, query_embedding, k):
        return self._scores[:, :k], self._indices[:, :k]


def test_search_documents_returns_expected_results(monkeypatch):
    """Retriever should return ranked metadata plus similarity scores."""

    metadata = [
        {
            "document_id": "doc-1",
            "source": "CSS Notes.pdf",
            "page": 52,
            "text": "Flexbox is a one-dimensional layout system.",
        },
        {
            "document_id": "doc-1",
            "source": "CSS Notes.pdf",
            "page": 54,
            "text": "The flex container controls the layout of flex items.",
        },
    ]

    fake_index = FakeIndex(
        scores=[0.91, 0.82],
        indices=[0, 1],
    )

    monkeypatch.setattr(
        retriever,
        "load_vector_store",
        lambda: (fake_index, metadata),
    )

    monkeypatch.setattr(
        retriever,
        "create_embeddings",
        lambda texts: np.array([[1.0, 0.0]], dtype=np.float32),
    )

    results = retriever.search_documents(
        "How does CSS Flexbox work?",
        top_k=2,
    )

    assert isinstance(results, list)
    assert len(results) == 2

    first = results[0]

    assert first["source"] == "CSS Notes.pdf"
    assert first["page"] == 52
    assert first["document_id"] == "doc-1"
    assert first["text"]
    assert isinstance(first["score"], float)
    assert first["score"] == pytest_approx(0.91)


def test_search_documents_filters_by_document_id(monkeypatch):
    """Results should only come from the document selected by the user."""

    metadata = [
        {
            "document_id": "doc-css",
            "source": "CSS Notes.pdf",
            "page": 10,
            "text": "CSS Grid is a two-dimensional layout system.",
        },
        {
            "document_id": "doc-python",
            "source": "Python Notes.pdf",
            "page": 7,
            "text": "Python lists are mutable sequences.",
        },
        {
            "document_id": "doc-css",
            "source": "CSS Notes.pdf",
            "page": 12,
            "text": "Grid tracks are rows and columns.",
        },
    ]

    fake_index = FakeIndex(
        scores=[0.95, 0.93, 0.88],
        indices=[0, 1, 2],
    )

    monkeypatch.setattr(
        retriever,
        "load_vector_store",
        lambda: (fake_index, metadata),
    )

    monkeypatch.setattr(
        retriever,
        "create_embeddings",
        lambda texts: np.array([[1.0, 0.0]], dtype=np.float32),
    )

    results = retriever.search_documents(
        "Explain CSS Grid",
        top_k=2,
        document_id="doc-css",
    )

    assert len(results) == 2
    assert all(
        result["document_id"] == "doc-css"
        for result in results
    )

    assert [result["page"] for result in results] == [10, 12]


def test_search_documents_returns_empty_when_vector_store_is_missing(monkeypatch):
    """A missing/empty FAISS store should return an empty result list."""

    monkeypatch.setattr(
        retriever,
        "load_vector_store",
        lambda: (None, []),
    )

    results = retriever.search_documents(
        "Any question",
        top_k=5,
    )

    assert results == []


def pytest_approx(value):
    """
    Local helper keeps this file lightweight while still handling
    float32 -> Python float conversion from the fake FAISS scores.
    """
    import pytest

    return pytest.approx(value, rel=1e-5)