from app.rag.rag_chain import ask_document


question = "What is CSS Flexbox?"


result = ask_document(
    question
)


print("\nANSWER")
print("=" * 60)

print(result["answer"])


print("\nSOURCES")
print("=" * 60)


for source in result["sources"]:

    print(
        f"{source['source']} "
        f"| Page {source['page']} "
        f"| Score {source['score']:.4f}"
    )