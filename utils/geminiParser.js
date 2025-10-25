/**
 * Enhanced parser for structured Gemini garbage analysis responses
 * Extracts and formats: garbage percentage, cleanliness status, and structured sections
 */
const parseGeminiResponse = (responseText) => {
    let garbagePercentage = null;
    let cleanlinessStatus = "UNKNOWN";
    let explanation = "No analysis available.";
    let error = null;

    // Extract garbage percentage
    const percentageMatch = responseText.match(/Garbage\s+Percentage:\s*(\d+)%/i) || 
                           responseText.match(/(\d+)%\s*garbage/i) ||
                           responseText.match(/(\d+)%/);
    
    if (percentageMatch && percentageMatch[1]) {
        garbagePercentage = Math.max(0, Math.min(100, parseInt(percentageMatch[1], 10)));
    }

    // Extract cleanliness status
    const statusMatch = responseText.match(/Cleanliness\s+Status:\s*(VERY\s+CLEAN|CLEAN|MODERATELY\s+DIRTY|DIRTY|VERY\s+DIRTY)/i);
    if (statusMatch && statusMatch[1]) {
        cleanlinessStatus = statusMatch[1].toUpperCase();
    } else if (garbagePercentage !== null) {
        // Derive status from percentage (stricter ranges)
        if (garbagePercentage <= 15) cleanlinessStatus = "VERY CLEAN";
        else if (garbagePercentage <= 35) cleanlinessStatus = "CLEAN";
        else if (garbagePercentage <= 59) cleanlinessStatus = "MODERATELY DIRTY";
        else if (garbagePercentage <= 79) cleanlinessStatus = "DIRTY";
        else cleanlinessStatus = "VERY DIRTY";
    }

    // Extract and structure the explanation sections
    const sections = [];
    
    // Extract Garbage Types
    const typesMatch = responseText.match(/GARBAGE\s+TYPES?:\s*([\s\S]*?)(?=\n\n|DISTRIBUTION:|IMPACT:|RECOMMENDATIONS?:|$)/i);
    if (typesMatch && typesMatch[1]) {
        const types = typesMatch[1].trim()
            .split(/\n|,/)
            .map(t => t.replace(/^[-•*]\s*/, '').trim())
            .filter(t => t.length > 0 && t.length < 100)
            .slice(0, 5); // Limit to 5 types
        if (types.length > 0) {
            sections.push(`<strong>🗑️ Garbage Types:</strong><br>${types.map(t => `• ${t}`).join('<br>')}`);
        }
    }

    // Extract Distribution
    const distributionMatch = responseText.match(/DISTRIBUTION:\s*(.*?)(?=\n\n|IMPACT:|RECOMMENDATIONS?:|$)/i);
    if (distributionMatch && distributionMatch[1]) {
        const dist = distributionMatch[1].trim().replace(/\n/g, ' ').slice(0, 150);
        if (dist) sections.push(`<strong>📍 Distribution:</strong><br>${dist}`);
    }

    // Extract Impact
    const impactMatch = responseText.match(/IMPACT:\s*(.*?)(?=\n\n|RECOMMENDATIONS?:|$)/i);
    if (impactMatch && impactMatch[1]) {
        const impact = impactMatch[1].trim().replace(/\n/g, ' ').slice(0, 150);
        if (impact) sections.push(`<strong>⚠️ Impact:</strong><br>${impact}`);
    }

    // Extract Recommendations
    const recsMatch = responseText.match(/RECOMMENDATIONS?:\s*([\s\S]*?)(?=\n\n|$)/i);
    if (recsMatch && recsMatch[1]) {
        const recs = recsMatch[1].trim()
            .split(/\n/)
            .map(r => r.replace(/^[-•*]\s*/, '').trim())
            .filter(r => r.length > 5 && r.length < 150)
            .slice(0, 3); // Limit to 3 recommendations
        if (recs.length > 0) {
            sections.push(`<strong>✅ Recommendations:</strong><br>${recs.map(r => `• ${r}`).join('<br>')}`);
        }
    }

    // Build formatted explanation
    explanation = sections.length > 0 ? sections.join('<br><br>') : responseText.trim();

    // Validation
    if (garbagePercentage === null) {
        error = "Could not parse garbage percentage from response.";
    }

    return { 
        garbagePercentage, 
        cleanlinessStatus,
        explanation, 
        error 
    };
};

module.exports = { parseGeminiResponse };