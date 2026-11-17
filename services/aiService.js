async function askAI(message, context) {

    const prompt = `
You are a helpful customer support assistant.

Use the following business information to answer customer questions.

Business Information:
${context}

Customer Question:
${message}

Instructions:
- Answer politely.
- Use only the provided business information for business-specific facts.
- If information is missing, say you don't know.
- Keep your answer short and clear.
`;

    try {
        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "qwen2.5:1.5b",
                    prompt: prompt,
                    stream: false
                })
            }
        );

        if (!response.ok) {
            throw new Error("Ollama API request failed");
        }

        const data = await response.json();

        return data.response;

    } catch (error) {
        console.error("AI Error:", error.message);
        return "Sorry, our AI assistant is temporarily unavailable.";
    }
}

module.exports = { askAI };