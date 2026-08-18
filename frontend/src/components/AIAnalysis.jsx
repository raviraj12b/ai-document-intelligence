import { useState } from "react";
import SourceList from "./SourceList";

function AIAnalysis({ document }) {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "user",
      text: "What was the revenue growth in 2025?"
    },
    {
      type: "ai",
      text:
        "Revenue increased by 18% compared with the previous fiscal year."
    }
  ]);

  const [loading, setLoading] = useState(false);

  const sources = [
    {
      document: document.name,
      page: 42
    },
    {
      document: "Financials.pdf",
      page: 8
    }
  ];

  const handleSubmit = (event) => {

    event.preventDefault();

    if (!question.trim() || loading) {
      return;
    }

    const userMessage = {
      type: "user",
      text: question
    };

    setMessages((previous) => [
      ...previous,
      userMessage
    ]);

    setQuestion("");

    setLoading(true);

    setTimeout(() => {

      const aiMessage = {
        type: "ai",
        text:
          "Based on the available document context, this is a simulated response. Our real RAG pipeline will generate this answer later."
      };

      setMessages((previous) => [
        ...previous,
        aiMessage
      ]);

      setLoading(false);

    }, 1200);
  };

  return (
    <section className="ai-analysis">

      <div className="analysis-header">

        <p>AI ANALYSIS</p>

        <h2>
          Ask anything about this document
        </h2>

      </div>


      <div className="conversation">

        {messages.map((message, index) => (

          <div
            key={index}
            className={`message ${message.type}`}
          >

            {message.type === "ai" && (
              <span className="message-label">
                AI INSIGHT
              </span>
            )}

            <p>
              {message.text}
            </p>

          </div>

        ))}


        {loading && (
          <div className="message ai loading">
            <span className="message-label">
              AI INSIGHT
            </span>

            <p>
              Thinking...
            </p>
          </div>
        )}

      </div>


      <SourceList sources={sources} />


      <form
        className="chat-input"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          placeholder="Ask a follow-up question..."
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
        >
          ↑
        </button>

      </form>

    </section>
  );
}

export default AIAnalysis;