const parseGeminiResponse = (responseText) => {
    let garbagePercentage = null;
    let explanation = "No specific explanation found.";
    let error = null;

    const percentageMatch = responseText.match(/(\d+)%\s*garbage/i);
    if (percentageMatch && percentageMatch[1]) {
        garbagePercentage = parseInt(percentageMatch[1], 10);
    }

    const explanationMatch = responseText.match(/Explanation:\s*(.*)/i);
    if (explanationMatch && explanationMatch[1]) {
        explanation = explanationMatch[1].trim();
    } else {
        // Fallback if "Explanation:" isn't explicit
        if (garbagePercentage !== null) {
            const parts = responseText.split(new RegExp(`${garbagePercentage}%\\s*garbage(?:\\.|$)`, 'i'), 2);
            if (parts.length > 1) {
                explanation = parts[1].trim();
            }
        }
        if (!explanation || explanation.length < 10 && explanation.split(' ').length < 3) {
             explanation = responseText.replace(new RegExp(`${garbagePercentage}%\\s*garbage`, 'i'), "").trim();
        }
    }

    if (garbagePercentage === null) {
        error = "Could not parse percentage from Gemini response.";
    }

    return { garbagePercentage, explanation, error };
};

module.exports = { parseGeminiResponse };