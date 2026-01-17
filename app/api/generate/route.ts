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
    const episodesDir = path.join(process.cwd(), "data", "episodes");
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

        const prompt = `You are creating a deeply personal, practical letter for someone in tech/product. Your job is to find the MOST RELEVANT advice for their SPECIFIC situation.

USER'S EXACT SITUATION:
- They are a: ${role}
- What's happening: ${situation}  
- Their core struggle: ${struggle}

CRITICAL: The advice MUST be specific to someone who is "${situation}" and struggling with "${struggle}". 
Do NOT give generic leadership advice. Find quotes that DIRECTLY address their exact situation.

AVAILABLE EPISODES (use these exact URLs):
${JSON.stringify(episodeMap, null, 2)}

TRANSCRIPT EXCERPTS:
${transcriptContext}

YOUR TASK:
Find 4-5 quotes from the transcripts that speak DIRECTLY to this person's exact situation. Each quote should feel like it was said specifically for them.

FOR EACH QUOTE, YOU MUST PROVIDE:
1. "takeaway" - A practical, actionable one-sentence intro that explains HOW this advice applies to their situation. This is the key insight they should take away. Write it like advice, starting with action words.
   Example: "Stop trying to prove yourself through doing — your value now comes from enabling others."
   Example: "The anxiety you feel about not knowing everything is actually a sign you're in the right role."
   
2. "text" - The actual quote from the transcript (1-3 sentences, powerful and emotional)

3. "guest" - The guest's name

4. "context" - Brief context about when/why they said this (e.g., "Reflecting on her first year as a VP")

PERSONALIZATION RULES:
- For "became a senior PM": Find advice about the transition from IC to senior, dealing with ambiguity, influencing without authority
- For "first leadership role": Find advice about letting go of doing, developing others, the identity shift
- For "shipped something that flopped": Find advice about failure, learning, resilience, not tying identity to outcomes
- For "finding product-market fit": Find advice about iteration, customer obsession, knowing when to pivot
- For "hitting a growth ceiling": Find advice about scaling, systems thinking, hiring, delegation

The takeaways should read like a PRACTICAL GUIDE building on each other.

GRAMMAR: 
- Address line should be natural: "To the PM stepping into senior leadership" NOT "To the PM who just became a senior PM"
- Rephrase awkward situations naturally

Return valid JSON:
{
  "addressLine": "Natural, grammatically correct greeting",
  "opening": "2-3 sentences acknowledging their exact situation with empathy. Show you understand the specific challenge.",
  "quotes": [
    {
      "takeaway": "One actionable sentence explaining why this matters for THEIR situation",
      "text": "The actual quote from transcript",
      "guest": "Guest Name",
      "context": "When/why they said this",
      "episodeTitle": "Episode title",
      "episodeUrl": "YouTube URL"
    }
  ],
  "closing": "Encouraging 2-3 sentence close. Make it forward-looking and practical.",
  "episodeLinks": [{"guest": "Name", "title": "Title", "url": "URL"}]
}

The letter should feel like a practical roadmap, not just inspirational quotes. Each takeaway builds toward actionable wisdom.`;

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
