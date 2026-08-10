import { useState, useRef, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Send, Mic, MicOff, Sparkles, MessageSquare, Volume2 } from "lucide-react";
import { cn } from "../utils/cn";
import { API_BASE_URL } from "../config";

const suggestedQuestions = [
  "How much did I spend this month?",
  "Which customer hasn't paid?",
  "Show my profit.",
  "Predict next month's cash flow.",
  "Give cost-saving suggestions.",
];

export function CopilotPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hello! I'm your AI Finance Copilot connected live to your MySQL database. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API for voice input
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendQuestion = async (userQuestion) => {
    if (!userQuestion.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: userQuestion };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion })
      });

      if (res.ok) {
        const data = await res.json();
        const ans = data.answer || "I have analyzed your financial records.";
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: "assistant",
          content: ans
        }]);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "assistant",
        content: `Error connecting to backend API: ${err.message}. Please ensure FastAPI backend is running.`
      }]);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendQuestion(input);
  };

  const handleSuggest = (q) => {
    sendQuestion(q);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar - Suggestions */}
      <div className="hidden lg:flex w-64 flex-col gap-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Suggested queries
        </h3>
        <div className="flex flex-col gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSuggest(q)}
              className="text-left text-sm p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-primary/30 transition-colors text-slate-700"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <Card className="flex-1 flex flex-col h-full bg-slate-50/50 shadow-sm border-slate-200 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-5 py-3 shadow-sm relative group",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">Copilot</span>
                    </div>
                    <button
                      onClick={() => speakText(msg.content)}
                      className="text-slate-400 hover:text-primary transition-colors p-1"
                      title="Read response aloud"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Click to speak"}
              className={cn(
                "shrink-0 transition-all rounded-full",
                isListening
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse ring-4 ring-red-200"
                  : "text-slate-500 hover:text-primary hover:bg-slate-100"
              )}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening... Speak your financial question..." : "Ask anything about your finances..."}
                className={cn(
                  "w-full rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary focus-visible:bg-white px-4 transition-all",
                  isListening && "border-red-400 bg-red-50/50 text-red-900 placeholder:text-red-400"
                )}
              />
              {isListening && (
                <span className="absolute right-4 top-2.5 text-xs text-red-500 font-medium animate-pulse">
                  Listening...
                </span>
              )}
            </div>

            <Button type="submit" size="icon" className="shrink-0 rounded-full bg-primary hover:bg-primary/90 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
