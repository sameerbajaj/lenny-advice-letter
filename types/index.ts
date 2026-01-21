export interface UserInput {
    role: string;
    situation: string;
    struggle: string;
}

export interface Quote {
    text: string;
    guest: string;
    context: string;
    takeaway: string; // Actionable one-liner explaining WHY this quote applies
    episodeTitle?: string;
    episodeUrl?: string;
}

export interface LetterResponse {
    opening: string;
    addressLine?: string;
    quotes: Quote[];
    closing: string;
    episodeLinks: {
        guest: string;
        title: string;
        url?: string;
    }[];
}

// Legacy exports for backwards compatibility (now defined in SentenceBuilder component)
export const ROLES = [
    { value: "pm", label: "PM" },
    { value: "founder", label: "Founder" },
    { value: "designer", label: "Designer" },
    { value: "engineer", label: "Engineer building product" },
    { value: "head-of-product", label: "Head of Product" },
    { value: "cpo-vp", label: "CPO / VP" },
    { value: "career-changer", label: "Career changer" },
];

export const SITUATIONS: Record<string, { value: string; label: string }[]> = {
    pm: [
        { value: "first-pm-job", label: "started my first PM job" },
        { value: "senior-pm", label: "became a senior PM" },
        { value: "first-leadership", label: "moved into my first leadership role" },
        { value: "startup-from-bigtech", label: "joined a startup from big tech" },
        { value: "shipped-flop", label: "shipped something that flopped" },
    ],
    founder: [
        { value: "year-zero", label: "started building (year 0-1)" },
        { value: "finding-pmf", label: "am looking for product-market fit" },
        { value: "just-raised", label: "just raised funding" },
        { value: "growth-ceiling", label: "am hitting a growth ceiling" },
        { value: "burning-out", label: "am burning out" },
    ],
    designer: [
        { value: "first-design-job", label: "started my first design job" },
        { value: "lead-designer", label: "became a lead designer" },
        { value: "design-to-pm", label: "am transitioning to product" },
        { value: "fighting-for-seat", label: "am fighting for a seat at the table" },
        { value: "scaling-design", label: "am scaling a design team" },
    ],
    engineer: [
        { value: "first-product-role", label: "moved into my first product role" },
        { value: "tech-lead", label: "became a tech lead" },
        { value: "eng-to-founder", label: "am thinking about starting something" },
        { value: "ownership", label: "want more product ownership" },
        { value: "communication", label: "struggle to communicate with non-engineers" },
    ],
    "head-of-product": [
        { value: "first-head-role", label: "took my first Head of Product role" },
        { value: "building-team", label: "am building out my team" },
        { value: "exec-alignment", label: "am struggling with exec alignment" },
        { value: "strategy", label: "need to set a clearer strategy" },
        { value: "turnaround", label: "inherited a struggling product" },
    ],
    "cpo-vp": [
        { value: "new-cpo", label: "became a CPO/VP for the first time" },
        { value: "board-pressure", label: "am dealing with board pressure" },
        { value: "org-scaling", label: "am scaling from 10 to 100" },
        { value: "reorg", label: "am going through a reorg" },
        { value: "layoffs", label: "had to do layoffs" },
    ],
    "career-changer": [
        { value: "new-to-tech", label: "am new to tech" },
        { value: "consulting-to-product", label: "came from consulting" },
        { value: "other-field", label: "came from a completely different field" },
        { value: "late-start", label: "am starting later in my career" },
        { value: "imposter", label: "constantly feel like an imposter" },
    ],
};

export const STRUGGLES = [
    { value: "right-calls", label: "knowing if I'm making the right calls" },
    { value: "moving-fast", label: "moving fast enough" },
    { value: "managing-people", label: "managing and hiring people" },
    { value: "strategic-vs-tactical", label: "staying strategic vs. getting pulled into tactics" },
    { value: "saying-no", label: "saying no to things" },
    { value: "trusting-judgment", label: "trusting my own judgment" },
    { value: "user-wants", label: "figuring out what users actually want" },
    { value: "team-motivation", label: "keeping my team motivated" },
    { value: "imposter-syndrome", label: "feeling like I don't belong here" },
    { value: "work-life-balance", label: "finding any sort of balance" },
];
