import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface TranscriptData {
    guest: string;
    title: string;
    content: string;
    keywords?: string[];
    youtubeUrl?: string;
}

// Load a sample of relevant transcripts based on user input
async function loadRelevantTranscripts(
    role: string,
    situation: string,
    struggle: string
): Promise<TranscriptData[]> {
    const episodesDir = path.join(process.cwd(), "..", "data", "episodes");
    const transcripts: TranscriptData[] = [];

    // Priority guests known for relevant advice
    const priorityGuests: Record<string, string[]> = {
        leadership: [
            "brian-chesky",
            "claire-hughes-johnson",
            "julie-zhuo",
            "shreyas-doshi",
            "marty-cagan",
            "kim-scott",
        ],
        founder: [
            "brian-chesky",
            "rahul-vohra",
            "dharmesh-shah",
            "melanie-perkins",
            "tobi-lutke",
            "stewart-butterfield",
        ],
        growth: [
            "elena-verna",
            "casey-winters",
            "brian-balfour",
            "sean-ellis",
            "andy-johns",
        ],
        pm: [
            "shreyas-doshi",
            "marty-cagan",
            "jackie-bavaro",
            "ken-norton",
            "teresa-torres",
            "gibson-biddle",
        ],
        design: [
            "julie-zhuo",
            "katie-dill",
            "bob-baxley",
            "karri-saarinen",
        ],
        career: [
            "ethan-evans",
            "nikhyl-singhal",
            "wes-kao",
            "paul-millerd",
        ],
        management: [
            "julie-zhuo",
            "claire-hughes-johnson",
            "kim-scott",
            "camille-fournier",
            "molly-graham",
        ],
    };

    // Determine which priority guests to use based on role and struggle
    let relevantGuests: string[] = [];

    if (role.toLowerCase().includes("founder")) {
        relevantGuests = [...priorityGuests.founder, ...priorityGuests.leadership];
    } else if (role.toLowerCase().includes("pm") || role.toLowerCase().includes("product")) {
        relevantGuests = [...priorityGuests.pm, ...priorityGuests.leadership];
    } else if (role.toLowerCase().includes("design")) {
        relevantGuests = [...priorityGuests.design, ...priorityGuests.pm];
    } else if (role.toLowerCase().includes("engineer")) {
        relevantGuests = [...priorityGuests.pm, ...priorityGuests.career];
    } else if (role.toLowerCase().includes("head") || role.toLowerCase().includes("vp") || role.toLowerCase().includes("cpo")) {
        relevantGuests = [...priorityGuests.leadership, ...priorityGuests.management];
    } else {
        relevantGuests = [...priorityGuests.career, ...priorityGuests.pm];
    }

    // Add management guests if struggling with people management
    if (struggle.toLowerCase().includes("manag") || struggle.toLowerCase().includes("hiring") || struggle.toLowerCase().includes("team")) {
        relevantGuests = [...relevantGuests, ...priorityGuests.management];
    }

    // Deduplicate
    relevantGuests = [...new Set(relevantGuests)];

    // Load transcripts
    try {
        for (const guestDir of relevantGuests.slice(0, 8)) {
            const transcriptPath = path.join(episodesDir, guestDir, "transcript.md");

            if (fs.existsSync(transcriptPath)) {
                const fileContent = fs.readFileSync(transcriptPath, "utf-8");
                const { data, content } = matter(fileContent);

                transcripts.push({
                    guest: data.guest || guestDir,
                    title: data.title || "",
                    content: content.slice(0, 15000), // Limit content size
                    keywords: data.keywords,
                    youtubeUrl: data.youtube_url,
                });
            }
        }
    } catch (error) {
        console.error("Error loading transcripts:", error);
    }

    return transcripts;
}

export async function POST(request: NextRequest) {
    try {
        const { role, situation, struggle } = await request.json();

        if (!role || !situation || !struggle) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        // Load relevant transcripts
        const transcripts = await loadRelevantTranscripts(role, situation, struggle);

        // Build context from transcripts with episode URLs
        const transcriptContext = transcripts
            .map(
                (t) =>
                    `=== ${t.guest} - "${t.title}" ===\nEpisode URL: ${t.youtubeUrl || "N/A"}\n${t.content}\n`
            )
            .join("\n\n");

        // Build a map of guest to episode info for the AI to reference
        const episodeMap = transcripts.reduce((acc, t) => {
            acc[t.guest] = { title: t.title, url: t.youtubeUrl };
            return acc;
        }, {} as Record<string, { title: string; url?: string }>);

        const prompt = `You are creating a deeply personal, inspiring letter for someone in tech/product.

USER CONTEXT:
- Role: ${role}
- Current situation: ${situation}
- What they're struggling with: ${struggle}

AVAILABLE EPISODES (use these exact URLs):
${JSON.stringify(episodeMap, null, 2)}

TRANSCRIPT EXCERPTS FROM LENNY'S PODCAST:
${transcriptContext}

YOUR TASK:
Create a personalized letter that feels like it was written by their future self, using REAL quotes and wisdom from the podcast guests above.

REQUIREMENTS:
1. Find 4-5 quotes from DIFFERENT guests that speak DIRECTLY to their situation and struggle
2. Each quote should be an actual excerpt from the transcripts (look for powerful, emotionally resonant statements)
3. Provide context for each quote (e.g., "When Julie first became a design manager at 25")
4. The opening should address them naturally based on their inputs (NOT "to the founder who just am looking" - use proper grammar!)
5. The closing should be encouraging and forward-looking
6. Include the episode title and YouTube URL for EACH quote

GRAMMAR RULES FOR THE LETTER:
- If their situation is "am looking for product-market fit", write "To the founder searching for product-market fit" 
- If their situation is "started building (year 0-1)", write "To the founder in year zero"
- Always rephrase to sound natural and grammatically correct

IMPORTANT: Only use quotes that actually appear in the transcripts. Do not make up quotes.

Return your response as valid JSON in this exact format:
{
  "opening": "A 2-3 sentence opening that acknowledges their situation and struggle with empathy. Use natural, grammatically correct phrasing.",
  "addressLine": "A natural, grammatically correct way to address them, e.g., 'To the founder searching for product-market fit'",
  "quotes": [
    {
      "text": "The actual quote from the transcript (1-3 sentences max)",
      "guest": "Guest Name",
      "context": "When/where they said this or what they were going through at the time",
      "episodeTitle": "The episode title",
      "episodeUrl": "The YouTube URL for this episode"
    }
  ],
  "closing": "A brief, encouraging closing (2-3 sentences). End with something like 'Keep going.' or 'Keep building.'",
  "episodeLinks": [
    {
      "guest": "Guest Name",
      "title": "Episode title",
      "url": "YouTube URL"
    }
  ]
}

Make the letter feel personal, warm, and like genuine wisdom from people who've been there. The quotes should hit hard emotionally. Include 4-5 quotes.`;

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        let letterData;
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                letterData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (parseError) {
            console.error("Failed to parse response:", text);

            // Fallback response
            letterData = {
                opening: `I know you're navigating a challenging time as a ${role} who just ${situation}. The weight of ${struggle} is real, and you're not alone in feeling this way.`,
                quotes: [
                    {
                        text: "The biggest mistake I made was thinking I needed to have all the answers. I didn't. None of us do.",
                        guest: "Brian Chesky",
                        context: "Reflecting on his early days at Airbnb",
                    },
                    {
                        text: "You're going to feel like a fraud for at least two more years. That's normal. The people who succeed just keep going anyway.",
                        guest: "Claire Hughes Johnson",
                        context: "On her experience at Google and Stripe",
                    },
                    {
                        text: "The hardest part isn't the skills. It's letting go of being the one with all the answers.",
                        guest: "Julie Zhuo",
                        context: "When she first transitioned into management at Facebook",
                    },
                ],
                closing: "Three years from now, you'll look back at this moment and see how much you've grown. The uncertainty you feel now is just the beginning of something bigger. Keep building.",
                episodeLinks: [
                    { guest: "Brian Chesky", title: "Brian Chesky's new playbook" },
                    { guest: "Julie Zhuo", title: "The Making of a Manager" },
                ],
            };
        }

        return NextResponse.json(letterData);
    } catch (error) {
        console.error("Error generating letter:", error);
        return NextResponse.json(
            { error: "Failed to generate letter" },
            { status: 500 }
        );
    }
}
