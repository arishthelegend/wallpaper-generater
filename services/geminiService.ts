
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    // In a real app, you'd want to handle this more gracefully,
    // perhaps showing an error message to the user.
    // For this example, we'll throw an error.
    console.error("API_KEY is not defined in environment variables. Please set it up.");
    // No "throw" here to avoid crashing, but we'll show an error.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

const fileToGenerativePart = (base64: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64,
            mimeType
        },
    };
};

/**
 * Generates a descriptive prompt from an image.
 */
async function generatePromptFromImage(imageDataBase64: string, mimeType: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const imagePart = fileToGenerativePart(imageDataBase64, mimeType);
    const prompt = `Describe this image in detail for an image generation model. The description should be suitable to create a new, high-quality, artistic phone wallpaper based on this image's content, style, and mood. Focus on visual elements that can be re-imagined.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, { text: prompt }] },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating prompt from image:", error);
        throw new Error("Failed to analyze the image. Please try another one.");
    }
}

/**
 * Generates an image from a text prompt or an image using imagen-4.0-generate-001.
 */
export async function generateImage(prompt: string, image?: { data: string; mimeType: string }): Promise<string> {
    if (!API_KEY) {
      throw new Error("API Key is missing. Please configure your environment.");
    }
    
    let finalPrompt = prompt;

    if (image?.data) {
        const imageBasedPrompt = await generatePromptFromImage(image.data, image.mimeType);
        finalPrompt = prompt ? `${imageBasedPrompt}, with the following style: ${prompt}` : imageBasedPrompt;
    }

    if (!finalPrompt) {
        throw new Error("A prompt is required to generate an image.");
    }

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '9:16',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("Image generation failed, no image was returned.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate wallpaper. The prompt may have been rejected. Please try another prompt.");
    }
}
