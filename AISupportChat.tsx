import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AISupportChat = () => {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `¡Hola! Soy Isabella, tu asistente IA de la Universidad UTAMV.

Puedo ayudarte con:
• Información sobre los programas (certificaciones, diplomados, másteres).
• Dudas sobre certificación y proceso de obtención.
• Preguntas sobre exámenes y evaluaciones.
• Información de pago y opciones de financiamiento.
• Contacto con soporte humano y docentes.
• Guía de estudios y procesos académicos.
• Seguridad social en la web y ciberseguridad.
• Tecnologías y programación: JavaScript, Python, Node.js.
• Requisitos de admisión y proceso de inscripción.

¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [quotaLimit, setQuotaLimit] = useState(10);
  const [limitReached, setLimitReached] = useState(false);

  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || limitReached) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-support", {
        body: {
          message: userMessage.content,
          history: messages.filter((m) => m.id !== "1").map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (error) throw error;

      if (data?.error === "AI_DAILY_LIMIT_REACHED") {
        setLimitReached(true);
        setQuotaUsed(data.quota_used);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      } else {
        setQuotaUsed(data.quota_used ?? quotaUsed);
        setQuotaLimit(data.quota_limit ?? 10);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("AI Support error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu pregunta. Intenta de nuevo o contacta soporte: tamvonlinenetwork@outlook.es",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "¿Cómo obtengo mi certificado?",
    "¿Cómo funcionan los exámenes?",
    "¿Cuál es el precio?",
    "¿Cómo contacto soporte?",
    "¿Qué es la seguridad social en la web?",
    "¿Qué tecnologías se enseñan?",
    "¿Cuál es el proceso de admisión?",
    "¿Hay opciones de financiamiento?",
  ];

  const remaining = quotaLimit - quotaUsed;

  return (
    <div className="card-elite flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Isabella IA</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Asistente académica UTAMV
            </p>
          </div>
        </div>
        {!isAdmin && (
          <div className="text-xs text-muted-foreground text-right">
            <span className={remaining <= 2 ? "text-destructive font-medium" : ""}>
              {remaining}/{quotaLimit} restantes hoy
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-primary/20" : "bg-muted"}`}>
                  {msg.role === "assistant" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"}`}>
                  <p className={`text-sm whitespace-pre-line ${msg.role === "user" ? "text-primary-foreground" : "text-foreground"}`}>
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={scrollBottomRef} />
        </div>
      </ScrollArea>

      {/* Limit warning */}
      {limitReached && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>Límite diario alcanzado (10 mensajes). Se reinicia mañana.</span>
        </div>
      )}

      {/* Quick questions */}
      {!limitReached && (
        <div className="px-4 py-2 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={limitReached ? "Límite diario alcanzado" : "Escribe tu pregunta..."}
            className="flex-1"
            disabled={isTyping || limitReached}
          />
          <Button type="submit" disabled={!input.trim() || isTyping || limitReached} size="icon">
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AISupportChat;
