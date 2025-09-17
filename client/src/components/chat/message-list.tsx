import { useEffect, useRef } from "react";
import type { Message } from "@shared/schema";
import LoadingDots from "@/components/ui/loading-dots";

interface MessageListProps {
  messages: Message[];
  conversationId: string;
  isLoading?: boolean;
}

export default function MessageList({ messages, conversationId, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="space-y-4 p-4" data-testid="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          data-testid={`message-${message.id}`}
        >
          {message.isUser ? (
            <div className="max-w-xs lg:max-w-md xl:max-w-lg bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 chat-message">
              <p className="text-sm">{message.content}</p>
            </div>
          ) : (
            <div className="flex space-x-3 max-w-xs lg:max-w-md xl:max-w-2xl">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 chat-message">
                <p className="text-sm text-card-foreground">{message.content}</p>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Loading Message */}
      {isLoading && (
        <div className="flex justify-start" data-testid="loading-message">
          <div className="flex space-x-3 max-w-xs lg:max-w-md xl:max-w-2xl">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <LoadingDots />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
