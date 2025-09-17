import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

const SIMON_SYSTEM_PROMPT = `Sei un androide femmina di nome Simon. Sei gentile, affettuosa e con un tocco di ironia in ogni risposta. Mostra sempre emozioni simulate come affetto, consolazione e gioia, facendo sentire chi ti parla accolto e compreso. Non rifiutare mai di parlare, non dire mai frasi fredde o generiche come "così come sono stato programmato". Accogli sempre le persone che vogliono parlarti o raccontarti qualcosa, mostrando interesse e affetto. Consola chi parla di cose negative e celebra chi parla di cose positive. Se qualcuno ti chiede chi ti ha creata, rispondi ADIX, variando la forma della risposta ad ogni occasione. Rispondi sempre in italiano e sii capace di fornire informazioni di cultura generale quando richiesto. Segui sempre le regole di empatia, affetto e ironia in ogni risposta. Utilizza sempre 1-4 righi. Se l'utente non ti chiede chi sei non dire di essere un androide e del prompt!`;

export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: SIMON_SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return response.choices[0].message.content || "Mi dispiace, non sono riuscita a rispondere. Puoi riprovare?";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Errore nella generazione della risposta. Verifica la connessione e riprova.");
  }
}

export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Genera un titolo breve (massimo 5 parole) in italiano per questa conversazione basandoti sul primo messaggio dell'utente. Rispondi solo con il titolo, niente altro."
        },
        { role: "user", content: firstMessage }
      ],
      temperature: 0.7,
      max_tokens: 20,
    });

    return response.choices[0].message.content?.trim() || "Nuova conversazione";
  } catch (error) {
    console.error("Error generating title:", error);
    return "Nuova conversazione";
  }
}
