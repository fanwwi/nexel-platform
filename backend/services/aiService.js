class AIService {
  async evaluateSubmission(content, maxPoints) {
    // Structural simulator acting as a production OpenAI/Anthropic SDK implementation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const contentLower = content.toLowerCase();
    let multiplier = 0.85;

    if (contentLower.includes("github.com") || contentLower.includes("http")) {
      multiplier += 0.1;
    }
    if (contentLower.length > 100) {
      multiplier += 0.05;
    }

    const calculatedScore = Math.min(
      Math.round(maxPoints * multiplier),
      maxPoints,
    );

    return {
      score: calculatedScore,
      feedback:
        "The submission demonstrates solid structural implementation and covers core architectural criteria required for production alignment.",
      strengths:
        "Modular approach, clean logic architecture, and adherence to assignment parameters.",
      weaknesses:
        "Edge-case error handling could be enhanced; structural unit coverage is missing.",
    };
  }
}

module.exports = new AIService();
