from app.rag.retriever import search_documents


query = "How does CSS Grid works?"

results = search_documents(
    query,
    top_k=5
)


print("\nSEARCH RESULTS")
print("=" * 60)


for i, result in enumerate(results, start=1):

    print(f"\nResult {i}")

    print(f"Score: {result['score']:.4f}")

    print(f"Source: {result['source']}")

    print(f"Page: {result['page']}")

    print("\nText:")

    print(result["text"][:500])

    print("-" * 60)