import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface MessageInputProps {
  conversationId?: string;
  onFirstMessage?: () => void;
}

export default function MessageInput({ conversationId, onFirstMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest("POST", "/api/conversations", { title });
      return response.json();
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
        content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (currentConversationId) {
        queryClient.invalidateQueries({ queryKey: ["/api/conversations", currentConversationId] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Impossibile inviare il messaggio",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    setCurrentConversationId(conversationId || null);
  }, [conversationId]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sendMessageMutation.isPending) return;

    let targetConversationId = currentConversationId;

    // Create new conversation if needed
    if (!targetConversationId) {
      try {
        const newConversation = await createConversationMutation.mutateAsync("Nuova conversazione");
        targetConversationId = newConversation.id;
        setCurrentConversationId(targetConversationId);
        
        // Update URL to reflect new conversation
        setLocation(`/chat/${targetConversationId}`);
        onFirstMessage?.();
      } catch (error) {
        toast({
          title: "Errore",
          description: "Impossibile creare la conversazione",
          variant: "destructive"
        });
        return;
      }
    }

    // Clear input immediately for better UX
    setMessage("");
    
    // Send message
    sendMessageMutation.mutate({
      conversationId: targetConversationId!,
      content: trimmedMessage
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isDisabled = !message.trim() || sendMessageMutation.isPending;

  return (
    <div className="border-t border-border p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-end space-x-4">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scrivi il tuo messaggio..."
                className="w-full bg-input border border-border rounded-2xl px-4 py-3 pr-12 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-[3rem] max-h-32"
                rows={1}
                data-testid="input-message"
              />
              
              {/* Send Button */}
              <Button
                type="submit"
                size="sm"
                disabled={isDisabled}
                className="absolute right-2 bottom-2 w-8 h-8 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-full p-0 transition-colors disabled:cursor-not-allowed"
                data-testid="button-send-message"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
        
        {/* Input Footer */}
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            SimonAI può commettere errori. Considera di verificare le informazioni importanti.
          </p>
        </div>
      </div>
    </div>
  );
}
