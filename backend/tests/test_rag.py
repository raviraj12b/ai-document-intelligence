from types import SimpleNamespace

import app.rag.rag_chain as rag_module


FAKE_RETRIEVAL_RESULTS = [
    {
        "document_id": "doc-css",
        "source": "CSS Notes.pdf",
        "page": 52,
        "text": "CSS Flexbox is a one-dimensional layout method.",
        "score": 0.91,
    },
    {
        "document_id": "doc-css",
        "source": "CSS Notes.pdf",
        "page": 54,
        "text": "Flex items can be arranged in rows or columns.",
        "score": 0.84,
    },
]


class FakeRunnable:
    """LangChain-like runnable that returns a deterministic LLM response."""

    def invoke(self, payload):
        return SimpleNamespace(
            content=(
                "CSS Flexbox is a one-dimensional layout method "
                "for arranging items in rows or columns."
            )
        )


class FakePrompt:
    """Minimal prompt object supporting LangChain's prompt | llm syntax."""

    def __or__(self, other):
        return FakeRunnable()


class FakeLLM:
    """Minimal LLM replacement supporting direct .invoke() calls."""

    def invoke(self, payload):
        return SimpleNamespace(
            content=(
                "CSS Flexbox is a one-dimensional layout method "
                "for arranging items in rows or columns."
            )
        )


def patch_generation_layer(monkeypatch):
    """
    Patch the common generation objects used by the DOCUAI RAG module.

    This keeps the test offline:
    no Groq request is made and no API key is required.
    """

    fake_llm = FakeLLM()
    fake_runnable = FakeRunnable()
    fake_prompt = FakePrompt()

    # Common module-level names.
    monkeypatch.setattr(
        rag_module,
        "llm",
        fake_llm,
        raising=False,
    )

    monkeypatch.setattr(
        rag_module,
        "get_llm",
        lambda: fake_llm,
        raising=False,
    )

    monkeypatch.setattr(
        rag_module,
        "prompt",
        fake_prompt,
        raising=False,
    )

    monkeypatch.setattr(
        rag_module,
        "chain",
        fake_runnable,
        raising=False,
    )

    # Some implementations name the composed chain `rag_chain`.
    monkeypatch.setattr(
        rag_module,
        "rag_chain",
        fake_runnable,
        raising=False,
    )

    # Covers implementations that construct the prompt inside ask_document().
    if hasattr(rag_module, "ChatPromptTemplate"):
        monkeypatch.setattr(
            rag_module.ChatPromptTemplate,
            "from_messages",
            lambda *args, **kwargs: fake_prompt,
        )


def test_ask_document_returns_answer_and_sources(monkeypatch):
    """RAG should return a grounded answer together with source metadata."""

    monkeypatch.setattr(
        rag_module,
        "search_documents",
        lambda query, top_k=5, document_id=None: FAKE_RETRIEVAL_RESULTS,
    )

    patch_generation_layer(monkeypatch)

    result = rag_module.ask_document(
        "What is CSS Flexbox?",
        document_id="doc-css",
        top_k=2,
    )

    assert isinstance(result, dict)

    assert "answer" in result
    assert "sources" in result

    assert isinstance(result["answer"], str)
    assert result["answer"].strip()

    assert isinstance(result["sources"], list)
    assert len(result["sources"]) == 2

    first_source = result["sources"][0]

    assert first_source["source"] == "CSS Notes.pdf"
    assert first_source["page"] == 52
    assert first_source["score"] == 0.91


def test_ask_document_passes_selected_document_to_retriever(monkeypatch):
    """The selected document ID must be forwarded to document-scoped retrieval."""

    captured = {}

    def fake_search_documents(
        query,
        top_k=5,
        document_id=None,
    ):
        captured["query"] = query
        captured["top_k"] = top_k
        captured["document_id"] = document_id

        return FAKE_RETRIEVAL_RESULTS

    monkeypatch.setattr(
        rag_module,
        "search_documents",
        fake_search_documents,
    )

    patch_generation_layer(monkeypatch)

    rag_module.ask_document(
        "Explain Flexbox",
        document_id="doc-css",
        top_k=3,
    )

    assert captured["query"] == "Explain Flexbox"
    assert captured["top_k"] == 3
    assert captured["document_id"] == "doc-css"


def test_sources_only_expose_source_page_and_score(monkeypatch):
    """
    The public RAG response should expose citation information
    rather than leaking full retrieved chunk text into the source list.
    """

    monkeypatch.setattr(
        rag_module,
        "search_documents",
        lambda query, top_k=5, document_id=None: FAKE_RETRIEVAL_RESULTS,
    )

    patch_generation_layer(monkeypatch)

    result = rag_module.ask_document(
        "What is CSS Flexbox?",
        document_id="doc-css",
    )

    for source in result["sources"]:
        assert "source" in source
        assert "page" in source
        assert "score" in source
        assert "text" not in source