from langchain_core.prompts import ChatPromptTemplate

from app.rag.llm import llm
from app.rag.retriever import search_documents


PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are DOCUAI, a document question-answering assistant.

Answer the user's question using ONLY the provided
document context.

If the answer cannot be found in the context,
say that the information was not found in the
provided documents.

Do not invent facts.

Always provide a concise and useful answer.
"""
        ),

        (
            "human",
            """
Document Context:

{context}

Question:

{question}
"""
        )
    ]
)


def ask_document(
    question: str,
    document_id: str | None = None,
    top_k: int = 5
):

    results = search_documents(
        question,
        top_k=top_k,
        document_id=document_id
)


    if not results:

        return {
            "answer": (
                "I couldn't find relevant information "
                "in the indexed documents."
            ),
            "sources": []
        }


    context_parts = []

    for result in results:

        context_parts.append(
            f"""
Source: {result['source']}
Page: {result['page']}

{result['text']}
"""
        )


    context = "\n\n".join(
        context_parts
    )


    messages = PROMPT.format_messages(
        context=context,
        question=question
    )


    response = llm.invoke(
        messages
    )


    sources = [

        {
            "source": result["source"],
            "page": result["page"],
            "score": result["score"]
        }

        for result in results

    ]


    return {

        "answer": response.content,

        "sources": sources

    }