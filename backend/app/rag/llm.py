import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from pydantic import SecretStr


load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")


if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is not configured."
    )


llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0,
    api_key=SecretStr(GROQ_API_KEY)
)