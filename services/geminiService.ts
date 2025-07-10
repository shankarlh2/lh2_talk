import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MeetingAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A short, descriptive title for the meeting, suitable for a filename. E.g., 'Project-Kickoff-Meeting'."
        },
        summary: {
            type: Type.STRING,
            description: "A concise summary of the entire meeting."
        },
        transcript: {
            type: Type.STRING,
            description: "A full, word-for-word transcript of the conversation. Must include speaker labels if discernible (e.g., Speaker 1, Speaker 2)."
        },
        minutesOfMeeting: {
            type: Type.ARRAY,
            description: "Detailed minutes of the meeting, organized by topic.",
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: {
                        type: Type.STRING,
                        description: "The main topic or agenda item discussed."
                    },
                    points: {
                        type: Type.ARRAY,
                        description: "Key discussion points, decisions, and outcomes related to the topic.",
                        items: {
                            type: Type.STRING
                        }
                    }
                },
                 required: ['topic', 'points']
            }
        },
        actionItems: {
            type: Type.ARRAY,
            description: "A list of actionable tasks derived from the meeting.",
            items: {
                type: Type.OBJECT,
                properties: {
                    task: {
                        type: Type.STRING,
                        description: "The specific action or task to be completed."
                    },
                    assignee: {
                        type: Type.STRING,
                        description: "The person or group responsible for the task. Default to 'Unassigned' if not mentioned."
                    }
                },
                required: ['task']
            }
        },
        keyLearnings: {
            type: Type.ARRAY,
            description: "A list of key insights, takeaways, or important pieces of information learned during the meeting.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ['title', 'summary', 'transcript', 'minutesOfMeeting', 'actionItems', 'keyLearnings']
};


export const analyzeMeetingAudio = async (audioBase64: string, mimeType: string): Promise<MeetingAnalysis> => {
    
    const prompt = `You are an expert meeting assistant. The following audio is a recording of a meeting where participants might speak in English, Hindi, or a mix of both (Hinglish).

    Your tasks are:
    1.  **Generate a Title:** Create a short, descriptive title for the meeting that is suitable for use as a filename.
    2.  **Transcribe:** Create a complete and accurate transcript of the entire conversation.
    3.  **Summarize:** Write a brief summary of the meeting's key discussions and outcomes.
    4.  **Generate Minutes:** Create structured minutes of the meeting, grouping discussion points by topic.
    5.  **Extract Action Items:** Identify all clear action items, noting the task and who it was assigned to if possible.
    6.  **Identify Key Learnings:** List out significant insights or new information gained during the discussion.

    Provide the output in a single JSON object that strictly adheres to the provided schema. Ensure all fields are populated.`;

    const audioPart = {
        inlineData: {
            data: audioBase64,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: prompt,
    };
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, audioPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation to ensure the parsed object matches the expected structure
        if (
            !parsedJson.title ||
            !parsedJson.summary ||
            !parsedJson.transcript ||
            !Array.isArray(parsedJson.minutesOfMeeting) ||
            !Array.isArray(parsedJson.actionItems) ||
            !Array.isArray(parsedJson.keyLearnings)
        ) {
            throw new Error("AI response is missing required fields.");
        }

        return parsedJson as MeetingAnalysis;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to process meeting analysis: ${error.message}`);
        }
        throw new Error("An unknown error occurred during AI processing.");
    }
};