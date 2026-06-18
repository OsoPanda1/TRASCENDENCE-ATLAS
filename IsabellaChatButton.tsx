import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AISupportChat from "./dashboard/AISupportChat";
import PublicVisitorChat from "./VisitorChat";

/**
 * IsabellaChatButton - Floating AI Chat Button
 * Provides access to Isabella AI assistant from anywhere in the application
 * - Authenticated users: Full chat with higher limits
 * - Visitors: Limited chat with rate limiting
 * Based on UTAMV AI Academic Core 2026 principles
 */
const IsabellaChatButton = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-silver to-silver-light hover:from-silver-light hover:to-silver text-primary-foreground animate-pulse-silver group relative"
              size="icon"
            >
              <Bot className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-primary-foreground animate-bounce">
                IA
              </span>
              <span className="sr-only">Abrir chat con Isabella IA</span>
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className="w-full sm:max-w-md p-0 border-l border-border bg-card"
          >
            <SheetHeader className="p-4 border-b border-border bg-gradient-to-r from-silver/10 to-teal/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-silver">
                    <Bot className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <SheetTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      Isabella Villaseñor
                      <Sparkles className="w-4 h-4 text-teal" />
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground">
                      {user ? "Guía Académica IA UTAMV" : "Chat para Visitantes"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Disclaimer based on AI Academic Core */}
              <div className="mt-3 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <p>
                  <strong>Nota:</strong> Isabella es una IA orientativa. 
                  No sustituye asesoría profesional ni evaluación académica oficial.
                </p>
              </div>
              
              {/* User status indicator */}
              {!user && (
                <div className="mt-2 flex items-center gap-2 text-xs text-teal">
                  <MessageCircle className="w-3 h-3" />
                  <span>Modo visitante - Regístrate para más mensajes</span>
                </div>
              )}
            </SheetHeader>
            
            {/* Chat Component - Different for visitors vs authenticated users */}
            <div className="h-[calc(100vh-180px)]">
              {user ? (
                <AISupportChat />
              ) : (
                <PublicVisitorChat />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Tooltip when closed */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-40 animate-fade-in">
          <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-lg max-w-xs">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-teal" />
              <p className="text-sm text-foreground">
                ¿Necesitas ayuda? <span className="text-teal font-medium">Chatea con Isabella</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IsabellaChatButton;
