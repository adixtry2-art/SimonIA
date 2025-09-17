# Overview

This is a full-stack TypeScript chat application called SimonAI, built with React frontend and Express backend. The application provides a conversational interface with an AI assistant named Simon, featuring conversation management, real-time messaging, and a responsive design using shadcn/ui components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state and local React state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for conversation and message management
- **Storage**: In-memory storage with interface for easy database integration
- **Development**: Vite integration for hot module replacement in development

## Data Layer
- **Database Schema**: Drizzle ORM with PostgreSQL dialect
- **Tables**: Conversations and Messages with proper foreign key relationships
- **Storage Interface**: Abstract storage interface allowing multiple implementations
- **Current Implementation**: Memory-based storage for development

## AI Integration
- **Provider**: Google Gemini AI (gemini-2.5-flash model)
- **Features**: Chat response generation and conversation title generation
- **Character**: AI assistant named Simon with Italian responses and emotional personality
- **Error Handling**: Graceful fallbacks for API failures

## Authentication & Security
- **Session Management**: Express session handling (prepared but not fully implemented)
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Zod schemas for API request validation

## Key Features
- **Conversation Management**: Create, list, and delete conversations
- **Real-time Messaging**: Send messages and receive AI responses
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Loading States**: Proper loading indicators and error handling
- **Welcome Screen**: Guided onboarding with example prompts

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Build Tools**: Vite with TypeScript support and various plugins
- **Backend**: Express.js with TypeScript execution via tsx

## Database & ORM
- **Drizzle**: ORM with PostgreSQL support and Zod integration
- **Neon Database**: Serverless PostgreSQL connection

## AI & External APIs
- **Google Gemini**: Generative AI for chat responses
- **API Key Required**: GEMINI_API_KEY environment variable

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library

## State Management
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution

## Development Tools
- **TypeScript**: Type safety across the stack
- **ESLint & Prettier**: Code quality and formatting
- **Replit Integration**: Development environment optimizations