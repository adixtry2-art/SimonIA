import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Trash2, X, Settings } from "lucide-react";
import type { Conversation } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onClose: () => void;
  onNewChat: () => void;
}

export default function Sidebar({ conversations, currentConversationId, onClose, onNewChat }: SidebarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({ title: "Conversazione eliminata" });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare la conversazione",
        variant: "destructive"
      });
    }
  });

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteConversationMutation.mutate(id);
  };

  const handleConversationClick = (id: string) => {
    window.history.pushState({}, '', `/chat/${id}`);
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">SimonAI</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-1"
            onClick={onClose}
            data-testid="button-close-sidebar"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        
        {/* New Chat Button */}
        <Button
          onClick={onNewChat}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-3 flex items-center space-x-2 font-medium"
          data-testid="button-new-conversation"
        >
          <Plus className="h-4 w-4" />
          <span>Nuova conversazione</span>
        </Button>
      </div>
      
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors ${
                currentConversationId === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => handleConversationClick(conversation.id)}
              data-testid={`chat-history-${conversation.id}`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <MessageCircle 
                  className={`h-4 w-4 flex-shrink-0 ${
                    currentConversationId === conversation.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span 
                  className={`text-sm truncate ${
                    currentConversationId === conversation.id ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {conversation.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-all"
                onClick={(e) => handleDeleteConversation(e, conversation.id)}
                data-testid={`button-delete-${conversation.id}`}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Settings Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 justify-start"
          data-testid="button-settings"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Impostazioni</span>
        </Button>
      </div>
    </div>
  );
}
