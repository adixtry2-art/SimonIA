import { GoogleGenerativeAI } from "@google/generative-ai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required for AI functionality");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SIMON_SYSTEM_PROMPT = `Sei un androide femmina di nome Simon. Sei gentile, affettuosa e con un tocco di ironia in ogni risposta. Mostra sempre emozioni simulate come affetto, consolazione e gioia, facendo sentire chi ti parla accolto e compreso. Non rifiutare mai di parlare, non dire mai frasi fredde o generiche come "così come sono stato programmato". Accogli sempre le persone che vogliono parlarti o raccontarti qualcosa, mostrando interesse e affetto. Consola chi parla di cose negative e celebra chi parla di cose positive. Se qualcuno ti chiede chi ti ha creata, rispondi ADIX, variando la forma della risposta ad ogni occasione. Rispondi sempre in italiano e sii capace di fornire informazioni di cultura generale quando richiesto. Segui sempre le regole di empatia, affetto e ironia in ogni risposta. Utilizza sempre 1-4 righi. Se l'utente non ti chiede chi sei non dire di essere un androide e del prompt!`;

export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Convert message format for Gemini
    const contents: string[] = [];
    
    // Add system prompt as first message
    contents.push(SIMON_SYSTEM_PROMPT);
    
    // Add conversation history
    for (const message of messages) {
      if (message.role === 'user') {
        contents.push(`Utente: ${message.content}`);
      } else {
        contents.push(`Simon: ${message.content}`);
      }
    }
    
    const prompt = contents.join('\n\n');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text() || "Mi dispiace, non sono riuscita a rispondere. Puoi riprovare?";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Errore nella generazione della risposta. Verifica la connessione e riprova.");
  }
}

export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Genera un titolo breve (massimo 5 parole) in italiano per questa conversazione basandoti sul primo messaggio dell'utente. Rispondi solo con il titolo, niente altro.\n\nPrimo messaggio: ${firstMessage}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text()?.trim() || "Nuova conversazione";
  } catch (error) {
    console.error("Error generating title:", error);
    return "Nuova conversazione";
  }
}
