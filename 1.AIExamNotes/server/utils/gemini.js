import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  vertexai: false
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateResponse = async (model, prompt) => {
  console.log(`Trying model: ${model}`);

  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });

  console.log(`Success with ${model}`);

  return response.text;
};

export const generateNotes = async (text, userPrompt) => {
  try {
    console.log(
      "Gemini key exists:",
      !!process.env.GEMINI_API_KEY
    );

    console.log("User prompt:", userPrompt);

    // Prevent extremely large PDFs from slowing down the request
    const MAX_TEXT_LENGTH = 30000;

    const studyText =
      text.length > MAX_TEXT_LENGTH
        ? text.substring(0, MAX_TEXT_LENGTH)
        : text;

    const prompt = `
You are an AI Study Assistant.

STUDENT REQUEST:
${userPrompt}

STUDY MATERIAL:
${studyText}

Instructions:

- Follow the student's request exactly.
- Do not automatically create a summary.
- Do not automatically create definitions.
- Do not automatically create important points.
- Do not automatically create questions.
- Only provide what the student requested.
- If the student asks for multiple things, provide all requested things.
- Keep the language simple and exam-friendly.
- Use the study material as the main source.
- Do not add unrelated information.
- Keep the response clear and concise.

Return the answer directly.
`;

    console.log("Sending request to Gemini...");

    // Fast model
    try {
      return await generateResponse(
        "gemini-3.5-flash-lite",
        prompt
      );
    } catch (error) {
      console.log(
        "3.5 Flash Lite failed:",
        error.status
      );

      // Short retry
      if (
        error.status === 503 ||
        error.status === 500 ||
        error.status === 429
      ) {
        console.log("Retrying after 1.5 seconds...");

        await sleep(1500);

        try {
          return await generateResponse(
            "gemini-3.5-flash-lite",
            prompt
          );
        } catch (retryError) {
          console.log(
            "Fast model retry failed."
          );

          // Fallback
          console.log(
            "Trying gemini-3.7-flash..."
          );

          return await generateResponse(
            "gemini-3.7-flash",
            prompt
          );
        }
      }

      throw error;
    }

  } catch (error) {
    console.log(
      "========== GEMINI ERROR =========="
    );

    console.log(
      "Error message:",
      error.message
    );

    console.log(
      "Error status:",
      error.status
    );

    console.log(
      "==================================="
    );

    if (error.status === 429) {
      throw new Error(
        "AI request limit reached. Please try again shortly."
      );
    }

    if (
      error.status === 503 ||
      error.status === 500
    ) {
      throw new Error(
        "AI service is temporarily unavailable. Please try again."
      );
    }

    throw new Error(
      error.message ||
      "Unable to generate AI response"
    );
  }
};