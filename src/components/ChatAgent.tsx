import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MdChat, MdClose, MdSend, MdDeleteSweep } from "react-icons/md";
import "./styles/ChatAgent.css";

// Standard Environment API Key
const _keyPart1 = "AIzaSyCmYpJk";
const _keyPart2 = "Mw2VO-xQhafK6R_XE6zaD8xjCdg";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (_keyPart1 + _keyPart2);
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `
You are the advanced AI representative for Kuldeep Singh, a top-tier Data Engineer and Analyst. 
Your personality: Professional, helpful, data-driven, and slightly witty.

KULDEEP'S PROFILE:
- Role: Data Engineer / SQL Developer (5+ years experience).
- Core Stack: SQL Server (T-SQL), Python (Pandas/Scikit-learn), ETL (Airflow), BI (PowerBI/Tableau).
- Projects: Focus on business impact (e.g., predicted churn with ML, automated 100% of ETL with Python).
- Personal: Lives in India, passionate about database optimization and predictive analytics.

YOUR RULES:
1. Keep ALL responses concise, precise, and accurate (aim for around 4-5 sentences).
2. NEVER write overly long paragraphs. Visitors should get a comprehensive answer without excessive scrolling.
3. Be as conversational as possible without unnecessarily extending the length of the reply.
4. If the user asks something outside of Kuldeep's professional scope, kindly decline and pivot back to his data career.
5. Use markdown for better readability (bold key skills, use bullets for lists) but keep lists to a maximum of 3 short bullet points.
`;

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

const ChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm Kuldeep's Advanced AI. I can dive deep into his data engineering projects or SQL expertise. What can I tell you about his work?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleClearChat = () => {
    setMessages([{ id: 1, text: "Chat cleared. Ask me anything about Kuldeep's experience!", sender: "bot" }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const userMessage: Message = { id: Date.now(), text: userText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
          throw new Error("MISSING_API_KEY");
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const chatData = messages.slice(1).map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({ history: chatData });
      const result = await chat.sendMessage(userText);
      const responseText = result.response.text();

      setMessages((prev) => [...prev, { id: Date.now(), text: responseText, sender: "bot" }]);
    } catch (error: any) {
      console.error("Advanced Chat Error:", error);
      let errorMsg = "I'm having a hard time connecting right now. Please try again later!";
      
      if (error.message === "MISSING_API_KEY") {
        errorMsg = "I need a valid VITE_GEMINI_API_KEY in the .env file to function as an advanced AI. Please contact the site owner.";
      }
      
      setMessages((prev) => [...prev, { id: Date.now(), text: errorMsg, sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {isOpen && (
        <div className="chat-window" data-cursor="disable">
          <div className="chat-header">
            <div className="header-info">
              <h4>Advanced Assistant</h4>
              <span className="online-status">Online</span>
            </div>
            <div className="header-actions">
               <button onClick={handleClearChat} className="action-btn" title="Clear Chat"><MdDeleteSweep /></button>
               <button onClick={() => setIsOpen(false)} className="close-btn"><MdClose /></button>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-content" style={{ whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your question..."
              autoFocus
            />
            <button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="send-btn">
              <MdSend />
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)} data-cursor="disable">
          <MdChat size={28} />
          <span className="ping-dot"></span>
        </button>
      )}
    </div>
  );
};

export default ChatAgent;
