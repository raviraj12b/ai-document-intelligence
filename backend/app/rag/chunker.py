def chunk_pages(
    pages,
    chunk_size=1000,
    chunk_overlap=200
):
    chunks = []

    for page in pages:

        text = page["text"].strip()

        if not text:
            continue

        start = 0

        while start < len(text):

            end = start + chunk_size

            chunk_text = text[start:end].strip()

            if chunk_text:

                chunks.append({
                    "text": chunk_text,
                    "page": page["page"]
                })

            start += chunk_size - chunk_overlap

    return chunks