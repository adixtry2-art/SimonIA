import { Button } from "@/components/ui/button";
import { MessageCircle, Lightbulb, Palette, Book } from "lucide-react";

const EXAMPLE_PROMPTS = [
  {
    icon: MessageCircle,
    text: "Inizia una conversazione",
    prompt: "Ciao Simon! Come va oggi?"
  },
  {
    icon: Lightbulb,
    text: "Chiedi informazioni",
    prompt: "Puoi spiegarmi qualcosa di interessante?"
  },
  {
    icon: Palette,
    text: "Risolvi problemi",
    prompt: "Aiutami con un problema creativo"
  },
  {
    icon: Book,
    text: "Intrattieniti",
    prompt: "Raccontami una storia interessante"
  }
];

export default function WelcomeScreen() {
  const handlePromptClick = (prompt: string) => {
    // Dispatch custom event to trigger message input
    const event = new CustomEvent('usePrompt', { detail: { prompt } });
    window.dispatchEvent(event);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8" data-testid="welcome-screen">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-primary-foreground font-bold text-2xl">S</span>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Benvenuto in SimonAI</h2>
        <p className="text-muted-foreground mb-8">
          Sono qui per aiutarti con qualsiasi domanda o conversazione. Inizia scrivendo un messaggio!
        </p>
        
        {/* Example Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          {EXAMPLE_PROMPTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="p-4 h-auto border border-border rounded-lg hover:bg-muted transition-colors text-left group justify-start"
                onClick={() => handlePromptClick(item.prompt)}
                data-testid={`prompt-${index}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground group-hover:text-primary">
                    {item.text}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
