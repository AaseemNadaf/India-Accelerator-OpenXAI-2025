// In: app/api/summarize/route.ts
// This version has more robust error handling to prevent crashes from malformed AI responses.

import { NextRequest, NextResponse } from 'next/server';

// This function centralizes the call to Ollama and adds resilient parsing
async function callOllama(prompt: string) {
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3:latest', // Ensure this model is pulled and running in Ollama
            prompt: prompt,
            stream: false,
            format: 'json',
        }),
    });

    if (!ollamaResponse.ok) {
        const errorBody = await ollamaResponse.text();
        console.error("Ollama API request failed:", errorBody);
        throw new Error(`Ollama API request failed with status ${ollamaResponse.status}`);
    }

    const ollamaData = await ollamaResponse.json();

    // The AI's response is a string that needs to be parsed.
    // This is the most common point of failure.
    try {
        return JSON.parse(ollamaData.response);
    } catch (e) {
        console.error("Failed to parse JSON from Ollama. Raw response:", ollamaData.response);
        // This new error message will be sent to the user on the frontend.
        throw new Error("The AI model returned an invalid format. Please try again or check the Ollama server logs.");
    }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobDescription, resumeText, userName, task } = body;

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    let prompt;
    
    // Using a clear, direct instruction style for the prompts to improve reliability.
    switch (task) {
        case 'match':
            if (!resumeText) return NextResponse.json({ error: 'Resume text is required for matching.' }, { status: 400 });
            prompt = `
              As an expert technical recruiter, analyze the resume and job description.
              You MUST return only a single, valid JSON object with the following structure:
              {
                "matchScore": <number from 0 to 100>,
                "summary": "<A concise one-sentence summary explaining the score>",
                "strengths": ["<An array of the candidate's top 3 qualifications for this role>"],
                "gaps": ["<An array of key skills from the JD missing in the resume>"]
              }
              Resume: --- ${resumeText} ---
              Job Description: --- ${jobDescription} ---
            `;
            break;

        case 'coverLetter':
            if (!resumeText || !userName) return NextResponse.json({ error: 'Resume and user name are required.' }, { status: 400 });
            prompt = `
              As a professional career coach, write a cover letter for ${userName} for the role in the job description, using the provided resume.
              You MUST return only a single, valid JSON object with the following structure:
              {
                "coverLetter": "<The full text of the cover letter, formatted with newlines (\\n)>"
              }
              Resume: --- ${resumeText} ---
              Job Description: --- ${jobDescription} ---
            `;
            break;

        case 'summarize':
        default:
            prompt = `
              As a helpful assistant, analyze the job description and extract key information.
              You MUST return only a single, valid JSON object with the following structure:
              {
                "role": "<The job title>",
                "keyResponsibilities": ["<An array of the main duties>"],
                "technicalSkills": ["<An array of specific technologies>"],
                "softSkills": ["<An array of non-technical skills>"],
                "qualifications": ["<An array of required qualifications>"]
              }
              Job Description: --- ${jobDescription} ---
            `;
            break;
    }

    const result = await callOllama(prompt);
    return NextResponse.json(result);

  } catch (error) {
    // This will now catch the more descriptive error from callOllama if JSON parsing fails.
    console.error('Error in API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
