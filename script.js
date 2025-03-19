let lastRequestTime = 0;

async function getBotResponse(userInput) {
    const now = Date.now();
    if (now - lastRequestTime < 2000) {
        appendMessage("Please wait before sending another message.", "bot-message");
        return;
    }
    lastRequestTime = now;

    appendMessage("Typing...", "bot-message");

    // API call should be handled in a backend for security reasons
    const url = "https://api.openai.com/v1/chat/completions";

    const data = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }],
        max_tokens: 100
    };

    try {
        let response = await fetch("/chatbot", {  // Call backend route instead
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();
        console.log(result); // Debugging: See full API response in console

        // Handle API errors properly
        if (result.error) {
            appendMessage(`Error: ${result.error.message}`, "bot-message");
            return;
        }

        if (!result.choices || result.choices.length === 0) {
            appendMessage("AI couldn't generate a response. Try again.", "bot-message");
            return;
        }

        // Remove "Typing..." safely
        let typingElement = document.querySelector(".bot-message:last-child");
        if (typingElement) typingElement.remove();

        appendMessage(result.choices[0].message.content, "bot-message");

    } catch (error) {
        console.error("Error:", error);
        let typingElement = document.querySelector(".bot-message:last-child");
        if (typingElement) typingElement.remove();

        appendMessage("Oops! Something went wrong.", "bot-message");
    }
}
