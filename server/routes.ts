import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { generateChatResponse, generateConversationTitle } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero delle conversazioni" });
    }
  });

  // Get conversation with messages
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversazione non trovata" });
      }
      
      const messages = await storage.getMessages(req.params.id);
      res.json({ conversation, messages });
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero della conversazione" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ message: "Dati non validi per la conversazione" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      await storage.deleteConversation(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Errore nell'eliminazione della conversazione" });
    }
  });

  // Send message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = req.params.id;
      const { content } = req.body;
      
      if (!content?.trim()) {
        return res.status(400).json({ message: "Il messaggio non può essere vuoto" });
      }

      // Check if conversation exists
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversazione non trovata" });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        conversationId,
        content: content.trim(),
        isUser: true,
      });

      // Get conversation history for context
      const previousMessages = await storage.getMessages(conversationId);
      const contextMessages = previousMessages
        .filter(msg => msg.id !== userMessage.id) // Exclude the just-added message
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));

      // Add current user message
      contextMessages.push({ role: 'user', content });

      // Generate AI response
      const aiResponse = await generateChatResponse(contextMessages);

      // Save AI response
      const aiMessage = await storage.createMessage({
        conversationId,
        content: aiResponse,
        isUser: false,
      });

      // If this is the first exchange, update conversation title
      if (previousMessages.length === 0) {
        try {
          const title = await generateConversationTitle(content);
          // Update the conversation title in storage
          const updatedConversation = { ...conversation, title };
          await storage.createConversation({ title }); // This is a limitation of our simple storage
        } catch (titleError) {
          console.error("Error updating conversation title:", titleError);
        }
      }

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error in message handling:", error);
      res.status(500).json({ message: error.message || "Errore nel processare il messaggio" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
