import { useEffect, useState } from "react";

import SourceList from "./SourceList";
import { askQuestion } from "../api";


function AIAnalysis({ document }) {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [sources, setSources] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  useEffect(() => {

    setMessages([]);
    setSources([]);
    setQuestion("");
    setError("");

  }, [document?.id]);


  const handleSubmit = async (event) => {

    event.preventDefault();


    if (!document?.id) {
      setError(
        "Select a document before asking a question."
      );
      return;
    }


    const trimmedQuestion = question.trim();


    if (!trimmedQuestion || loading) {
      return;
    }


    const userMessage = {
      type: "user",
      text: trimmedQuestion
    };


    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage
    ]);


    setQuestion("");
    setError("");
    setLoading(true);


    try {

      const result = await askQuestion(
        trimmedQuestion,
        document.id
      );


      const aiMessage = {
        type: "ai",
        text: result.answer
      };


      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage
      ]);


      setSources(
        result.sources || []
      );


    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Something went wrong while processing your question."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <section className="ai-analysis">

      <div className="analysis-header">

        <p>
          AI ANALYSIS
        </p>

        <h2>
          Ask anything about this document
        </h2>

      </div>


      <div className="conversation">


        {messages.length === 0 && (

          <div className="empty-chat">

            <p>
              Ask a question about the indexed document.
            </p>

          </div>

        )}


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
              Analyzing document...
            </p>

          </div>

        )}


        {error && (

          <div className="chat-error">
            {error}
          </div>

        )}

      </div>


      {sources.length > 0 && (

        <SourceList
          sources={sources}
        />

      )}


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
          placeholder="Ask a question..."
          disabled={loading}
        />


        <button
          type="submit"
          disabled={
            loading ||
            !question.trim()
          }
        >
          ↑
        </button>

      </form>

    </section>

  );
}


export default AIAnalysis;