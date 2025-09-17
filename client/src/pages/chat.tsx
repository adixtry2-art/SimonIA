import { useState, useEffect } from "react";
import { useParams } from "wouter";
import Sidebar from "@/components/chat/sidebar";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import WelcomeScreen from "@/components/chat/welcome-screen";
import { useQuery } from "@tanstack/react-query";
import type { Conversation, Message } from "@shared/schema";
import { Menu, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversationData {
  conversation: Conversation;
  messages: Message[];
}

export default function Chat() {
  const { id: conversationId } = useParams<{ id?: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewChat, setIsNewChat] = useState(!conversationId);

  const { data: conversationData, isLoading } = useQuery<ConversationData>({
    queryKey: ["/api/conversations", conversationId],
    enabled: !!conversationId,
  });

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  useEffect(() => {
    setIsNewChat(!conversationId);
  }, [conversationId]);

  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  const startNewChat = () => {
    setIsNewChat(true);
    window.history.pushState({}, '', '/');
    closeSidebar();
  };

  const handleFirstMessage = () => {
    setIsNewChat(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeSidebar}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-80 bg-secondary border-r border-border flex-shrink-0 sidebar-transition
        md:translate-x-0 z-50
        ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed md:sidebar-open'}
      `}>
        <Sidebar
          conversations={conversations}
          currentConversationId={conversationId}
          onClose={closeSidebar}
          onNewChat={startNewChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Bar */}
        <div className="bg-background border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={openSidebar}
              data-testid="button-open-sidebar"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">S</span>
              </div>
              <span className="text-foreground font-medium">Simon</span>
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={startNewChat}
            title="Nuova conversazione"
            data-testid="button-new-chat"
          >
            <Plus className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          {isNewChat ? (
            <WelcomeScreen />
          ) : isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-muted-foreground">Caricamento conversazione...</div>
            </div>
          ) : conversationData ? (
            <MessageList 
              messages={conversationData.messages}
              conversationId={conversationId!}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-muted-foreground">Conversazione non trovata</div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <MessageInput 
          conversationId={conversationId}
          onFirstMessage={handleFirstMessage}
        />
      </div>
    </div>
  );
}
