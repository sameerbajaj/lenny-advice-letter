"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserInput } from "@/types";

interface SentenceBuilderProps {
    onSubmit: (input: UserInput) => void;
}

// Roles with emojis for visual appeal
const ROLES = [
    { value: "pm", label: "PM", emoji: "📊" },
    { value: "founder", label: "Founder", emoji: "🚀" },
    { value: "designer", label: "Designer", emoji: "🎨" },
    { value: "engineer", label: "Engineer", emoji: "⚙️" },
    { value: "head-of-product", label: "Head of Product", emoji: "🎯" },
    { value: "cpo-vp", label: "CPO / VP", emoji: "👑" },
    { value: "career-changer", label: "Career Changer", emoji: "🔄" },
];

// Context-aware situations per role
const SITUATIONS: Record<string, { value: string; label: string }[]> = {
    pm: [
        { value: "first-pm-job", label: "started my first PM job" },
        { value: "senior-pm", label: "became a senior PM" },
        { value: "first-leadership", label: "moved into leadership" },
        { value: "startup-from-bigtech", label: "joined a startup" },
        { value: "shipped-flop", label: "shipped something that flopped" },
    ],
    founder: [
        { value: "year-zero", label: "started building (year 0-1)" },
        { value: "finding-pmf", label: "am looking for PMF" },
        { value: "just-raised", label: "just raised funding" },
        { value: "growth-ceiling", label: "hit a growth ceiling" },
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
        { value: "first-product-role", label: "moved into product" },
        { value: "tech-lead", label: "became a tech lead" },
        { value: "eng-to-founder", label: "want to start something" },
        { value: "ownership", label: "want more product ownership" },
        { value: "communication", label: "struggle with non-engineers" },
    ],
    "head-of-product": [
        { value: "first-head-role", label: "took my first Head role" },
        { value: "building-team", label: "am building out my team" },
        { value: "exec-alignment", label: "struggle with exec alignment" },
        { value: "strategy", label: "need to set clearer strategy" },
        { value: "turnaround", label: "inherited a struggling product" },
    ],
    "cpo-vp": [
        { value: "new-cpo", label: "became a CPO/VP" },
        { value: "board-pressure", label: "am dealing with board pressure" },
        { value: "org-scaling", label: "am scaling from 10 to 100" },
        { value: "reorg", label: "am going through a reorg" },
        { value: "layoffs", label: "had to do layoffs" },
    ],
    "career-changer": [
        { value: "new-to-tech", label: "am new to tech" },
        { value: "consulting-to-product", label: "came from consulting" },
        { value: "other-field", label: "came from a different field" },
        { value: "late-start", label: "am starting later in life" },
        { value: "imposter", label: "feel like an imposter" },
    ],
};

// Context-aware struggles based on role + situation
const getStruggles = (role: string, situation: string): { value: string; label: string }[] => {
    // Default struggles that apply broadly
    const universalStruggles = [
        { value: "trusting-judgment", label: "trusting my judgment" },
        { value: "imposter-syndrome", label: "feeling like I belong" },
        { value: "work-life-balance", label: "finding balance" },
    ];

    // Role-specific struggles
    const roleStruggles: Record<string, { value: string; label: string }[]> = {
        pm: [
            { value: "right-calls", label: "making the right calls" },
            { value: "saying-no", label: "saying no to things" },
            { value: "user-wants", label: "what users actually want" },
            { value: "stakeholder-buy-in", label: "getting stakeholder buy-in" },
        ],
        founder: [
            { value: "moving-fast", label: "moving fast enough" },
            { value: "hiring", label: "hiring the right people" },
            { value: "focus", label: "staying focused" },
            { value: "fundraising", label: "fundraising" },
        ],
        designer: [
            { value: "influence", label: "having influence" },
            { value: "design-debt", label: "design debt" },
            { value: "eng-handoff", label: "engineer handoff" },
            { value: "measuring-impact", label: "measuring impact" },
        ],
        engineer: [
            { value: "product-thinking", label: "thinking like a PM" },
            { value: "shipping-vs-perfection", label: "shipping vs. perfecting" },
            { value: "visibility", label: "getting visibility" },
            { value: "communication", label: "communicating ideas" },
        ],
        "head-of-product": [
            { value: "managing-people", label: "managing people" },
            { value: "strategic-vs-tactical", label: "staying strategic" },
            { value: "team-motivation", label: "keeping my team motivated" },
            { value: "exec-credibility", label: "building exec credibility" },
        ],
        "cpo-vp": [
            { value: "org-politics", label: "organizational politics" },
            { value: "board-management", label: "managing the board" },
            { value: "culture-at-scale", label: "culture at scale" },
            { value: "letting-go", label: "letting go of details" },
        ],
        "career-changer": [
            { value: "credibility", label: "building credibility" },
            { value: "learning-curve", label: "the learning curve" },
            { value: "networking", label: "building my network" },
            { value: "proving-myself", label: "proving myself" },
        ],
    };

    // Situation-specific additions
    const situationStruggles: Record<string, { value: string; label: string }[]> = {
        "shipped-flop": [{ value: "recovering", label: "recovering from failure" }],
        "burning-out": [{ value: "setting-boundaries", label: "setting boundaries" }],
        "first-pm-job": [{ value: "ramping-up", label: "ramping up quickly" }],
        "first-leadership": [{ value: "delegation", label: "delegating effectively" }],
        layoffs: [{ value: "team-morale", label: "team morale" }],
        reorg: [{ value: "uncertainty", label: "dealing with uncertainty" }],
    };

    const roleSpecific = roleStruggles[role] || [];
    const situationSpecific = situationStruggles[situation] || [];

    // Combine and dedupe
    const combined = [...roleSpecific, ...situationSpecific, ...universalStruggles];
    const seen = new Set<string>();
    return combined.filter((s) => {
        if (seen.has(s.value)) return false;
        seen.add(s.value);
        return true;
    }).slice(0, 6); // Limit to 6 for clean UI
};

// Chip component for selection
function SelectionChip({
    label,
    emoji,
    selected,
    onClick,
    disabled = false,
}: {
    label: string;
    emoji?: string;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            className={`
                px-4 py-3 rounded-xl font-medium text-sm md:text-base
                transition-all duration-200 border-2
                ${selected
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md"
                    : "bg-white/80 text-[var(--color-ink)] border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/50"
                }
                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
            {emoji && <span className="mr-2">{emoji}</span>}
            {label}
        </motion.button>
    );
}

export default function SentenceBuilder({ onSubmit }: SentenceBuilderProps) {
    const [role, setRole] = useState("");
    const [situation, setSituation] = useState("");
    const [struggle, setStruggle] = useState("");
    const [customStruggle, setCustomStruggle] = useState("");
    const [useCustom, setUseCustom] = useState(false);
    const customInputRef = useRef<HTMLTextAreaElement>(null);

    // Reset downstream selections when upstream changes
    useEffect(() => {
        setSituation("");
        setStruggle("");
        setCustomStruggle("");
        setUseCustom(false);
    }, [role]);

    useEffect(() => {
        setStruggle("");
        setCustomStruggle("");
        setUseCustom(false);
    }, [situation]);

    // Focus custom input when switching to custom mode
    useEffect(() => {
        if (useCustom && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [useCustom]);

    const situations = role ? SITUATIONS[role] || [] : [];
    const struggles = role && situation ? getStruggles(role, situation) : [];

    const finalStruggle = useCustom ? customStruggle.trim() : struggle;
    const isComplete = role && situation && finalStruggle;

    const handleSubmit = () => {
        if (isComplete) {
            const roleLabel = ROLES.find((r) => r.value === role)?.label || role;
            const situationLabel = situations.find((s) => s.value === situation)?.label || situation;
            const struggleLabel = useCustom
                ? customStruggle.trim()
                : struggles.find((s) => s.value === struggle)?.label || struggle;

            onSubmit({
                role: roleLabel,
                situation: situationLabel,
                struggle: struggleLabel,
            });
        }
    };

    return (
        <div className="letter-container p-6 md:p-10">
            <div className="stamp">✉️</div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 pr-16"
            >
                <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-ink)] mb-2">
                    Tell us about your situation
                </h2>
                <p className="text-[var(--color-ink-light)] text-sm">
                    We'll find leaders who were in your exact shoes
                </p>
            </motion.div>

            {/* Step 1: Role Selection */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-[var(--color-ink)] font-medium">I'm a...</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {ROLES.map((r) => (
                        <SelectionChip
                            key={r.value}
                            label={r.label}
                            emoji={r.emoji}
                            selected={role === r.value}
                            onClick={() => setRole(r.value)}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Step 2: Situation Selection */}
            <AnimatePresence>
                {role && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8 overflow-hidden"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center">2</span>
                            <span className="text-[var(--color-ink)] font-medium">who just...</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {situations.map((s) => (
                                <SelectionChip
                                    key={s.value}
                                    label={s.label}
                                    selected={situation === s.value}
                                    onClick={() => setSituation(s.value)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step 3: Struggle Selection with Custom Option */}
            <AnimatePresence>
                {situation && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8 overflow-hidden"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center">3</span>
                            <span className="text-[var(--color-ink)] font-medium">and I'm struggling with...</span>
                        </div>

                        {/* Quick select chips */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {struggles.map((s) => (
                                <SelectionChip
                                    key={s.value}
                                    label={s.label}
                                    selected={!useCustom && struggle === s.value}
                                    onClick={() => {
                                        setStruggle(s.value);
                                        setUseCustom(false);
                                    }}
                                />
                            ))}
                        </div>

                        {/* Custom input option */}
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    setUseCustom(!useCustom);
                                    setStruggle("");
                                }}
                                className={`
                                    text-sm font-medium transition-colors
                                    ${useCustom
                                        ? "text-[var(--color-accent)]"
                                        : "text-[var(--color-ink-light)] hover:text-[var(--color-accent)]"
                                    }
                                `}
                            >
                                ✏️ {useCustom ? "Using your own words" : "Or describe it in your own words..."}
                            </button>

                            <AnimatePresence>
                                {useCustom && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-3"
                                    >
                                        <div className="relative">
                                            <textarea
                                                ref={customInputRef}
                                                value={customStruggle}
                                                onChange={(e) => setCustomStruggle(e.target.value.slice(0, 150))}
                                                placeholder="e.g., balancing speed with quality while my team is burned out..."
                                                rows={2}
                                                className="
                                                    w-full px-4 py-3 rounded-xl border-2 border-[var(--color-accent)]/30
                                                    bg-white/90 text-[var(--color-ink)] placeholder-[var(--color-ink-light)]/60
                                                    focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20
                                                    transition-all duration-200 resize-none
                                                    text-sm md:text-base
                                                "
                                            />
                                            <div className="absolute bottom-2 right-3 text-xs text-[var(--color-ink-light)]">
                                                {customStruggle.length}/150
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview & Submit */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="pt-6 border-t border-[var(--color-accent)]/10"
                    >
                        {/* Preview sentence */}
                        <div className="mb-6 p-4 rounded-xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10">
                            <p className="text-[var(--color-ink)] font-serif text-base md:text-lg leading-relaxed">
                                "I'm a <strong>{ROLES.find(r => r.value === role)?.label}</strong> who just <strong>{situations.find(s => s.value === situation)?.label}</strong> and I'm struggling with <strong>{useCustom ? customStruggle.trim() : struggles.find(s => s.value === struggle)?.label}</strong>."
                            </p>
                        </div>

                        <div className="text-center">
                            <motion.button
                                onClick={handleSubmit}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary text-lg px-10"
                            >
                                ✉️ Get My Letter
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
