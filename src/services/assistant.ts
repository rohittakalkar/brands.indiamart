interface AssistantMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export async function askAssistant(message: string, previousMessages: AssistantMessage[] = []) {
  const res = await fetch('/api/gemini/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, previousMessages })
  });
  if (!res.ok) {
    throw new Error('Could not connect to B2B assistant. Please try again.');
  }
  return res.json();
}
