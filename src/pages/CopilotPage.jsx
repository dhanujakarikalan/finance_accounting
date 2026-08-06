import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Send, Mic, Sparkles, MessageSquare } from "lucide-react";
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userQuestion = input.trim();
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
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: "assistant",
          content: data.answer || "I have analyzed your invoice database."
        }]);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "assistant",
        content: `Error connecting to backend API: ${err.message}. Please ensure the FastAPI server is running on port 8000.`
      }]);
    }
  };

  const handleSuggest = (q) => {
    setInput(q);
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
                  "max-w-[80%] rounded-2xl px-5 py-3 shadow-sm",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">Copilot</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <Button type="button" variant="ghost" size="icon" className="shrink-0 text-slate-500 hover:text-primary">
              <Mic className="h-5 w-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your finances..."
              className="flex-1 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary focus-visible:bg-white px-4"
            />
            <Button type="submit" size="icon" className="shrink-0 rounded-full bg-primary hover:bg-primary/90 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
