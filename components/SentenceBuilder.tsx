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
        { value: "fighting-for-seat", label: "am fighting for my seat at the table" },
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
    const universalStruggles = [
        { value: "trusting-judgment", label: "trusting my judgment" },
        { value: "imposter-syndrome", label: "feeling like I belong" },
        { value: "work-life-balance", label: "finding balance" },
    ];

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

    const combined = [...roleSpecific, ...situationSpecific, ...universalStruggles];
    const seen = new Set<string>();
    return combined.filter((s) => {
        if (seen.has(s.value)) return false;
        seen.add(s.value);
        return true;
    }).slice(0, 6);
};

// Chip component for selection
function SelectionChip({
    label,
    emoji,
    selected,
    onClick,
    disabled = false,
    compact = false,
}: {
    label: string;
    emoji?: string;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
    compact?: boolean;
}) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            className={`
                ${compact ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm md:text-base"}
                rounded-xl font-medium transition-all duration-200 border-2
                ${selected
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md"
                    : "bg-white/80 text-[var(--color-ink)] border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/50"
                }
                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
            {emoji && <span className="mr-1.5">{emoji}</span>}
            {label}
        </motion.button>
    );
}

// Beautiful inline text input with floating effect
function InlineTextInput({
    value,
    onChange,
    placeholder,
    prefix,
    maxLength = 100,
    autoFocus = false,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    prefix?: string;
    maxLength?: number;
    autoFocus?: boolean;
}) {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative"
        >
            {prefix && (
                <span className="absolute left-4 top-3 text-[var(--color-ink-light)] text-sm pointer-events-none">
                    {prefix}
                </span>
            )}
            <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
                placeholder={placeholder}
                rows={2}
                className={`
                    w-full px-4 py-3 rounded-xl border-2 border-[var(--color-accent)]/30
                    bg-white/95 text-[var(--color-ink)] placeholder-[var(--color-ink-light)]/50
                    focus:border-[var(--color-accent)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/10
                    transition-all duration-200 resize-none shadow-sm
                    text-sm md:text-base leading-relaxed
                    ${prefix ? "pl-4" : ""}
                `}
                style={{
                    paddingTop: prefix ? "2.5rem" : undefined,
                }}
            />
            <div className="absolute bottom-2 right-3 text-xs text-[var(--color-ink-light)]/60">
                {value.length}/{maxLength}
            </div>
        </motion.div>
    );
}

// Mode toggle component
function ModeToggle({
    mode,
    onModeChange,
    quickLabel = "Quick select",
    customLabel = "Write your own",
}: {
    mode: "quick" | "custom";
    onModeChange: (mode: "quick" | "custom") => void;
    quickLabel?: string;
    customLabel?: string;
}) {
    return (
        <div className="inline-flex items-center gap-1 p-1 bg-[var(--color-accent)]/5 rounded-lg mb-4">
            <button
                onClick={() => onModeChange("quick")}
                className={`
                    px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                    ${mode === "quick"
                        ? "bg-white text-[var(--color-ink)] shadow-sm"
                        : "text-[var(--color-ink-light)] hover:text-[var(--color-ink)]"
                    }
                `}
            >
                ⚡ {quickLabel}
            </button>
            <button
                onClick={() => onModeChange("custom")}
                className={`
                    px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                    ${mode === "custom"
                        ? "bg-white text-[var(--color-ink)] shadow-sm"
                        : "text-[var(--color-ink-light)] hover:text-[var(--color-ink)]"
                    }
                `}
            >
                ✏️ {customLabel}
            </button>
        </div>
    );
}

export default function SentenceBuilder({ onSubmit }: SentenceBuilderProps) {
    const [role, setRole] = useState("");

    // Situation state
    const [situationMode, setSituationMode] = useState<"quick" | "custom">("quick");
    const [situationValue, setSituationValue] = useState("");
    const [customSituation, setCustomSituation] = useState("");

    // Struggle state
    const [struggleMode, setStruggleMode] = useState<"quick" | "custom">("quick");
    const [struggleValue, setStruggleValue] = useState("");
    const [customStruggle, setCustomStruggle] = useState("");

    // Reset downstream when role changes
    useEffect(() => {
        setSituationMode("quick");
        setSituationValue("");
        setCustomSituation("");
        setStruggleMode("quick");
        setStruggleValue("");
        setCustomStruggle("");
    }, [role]);

    // Reset struggle when situation changes
    useEffect(() => {
        setStruggleMode("quick");
        setStruggleValue("");
        setCustomStruggle("");
    }, [situationValue, customSituation, situationMode]);

    const situations = role ? SITUATIONS[role] || [] : [];
    const struggles = role && (situationValue || customSituation)
        ? getStruggles(role, situationValue || "custom")
        : [];

    // Computed final values
    const finalSituation = situationMode === "custom" ? customSituation.trim() : situationValue;
    const finalStruggle = struggleMode === "custom" ? customStruggle.trim() : struggleValue;
    const hasSituation = finalSituation.length > 0;
    const hasStruggle = finalStruggle.length > 0;
    const isComplete = role && hasSituation && hasStruggle;

    // Get display labels
    const getRoleLabel = () => ROLES.find(r => r.value === role)?.label || role;
    const getSituationLabel = () => {
        if (situationMode === "custom") return customSituation.trim();
        return situations.find(s => s.value === situationValue)?.label || situationValue;
    };
    const getStruggleLabel = () => {
        if (struggleMode === "custom") return customStruggle.trim();
        return struggles.find(s => s.value === struggleValue)?.label || struggleValue;
    };

    const handleSubmit = () => {
        if (isComplete) {
            onSubmit({
                role: getRoleLabel(),
                situation: getSituationLabel(),
                struggle: getStruggleLabel(),
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
                    The more specific, the better your letter will be
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
                    <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
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
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                            <span className="text-[var(--color-ink)] font-medium">who just...</span>
                        </div>

                        <ModeToggle
                            mode={situationMode}
                            onModeChange={(mode) => {
                                setSituationMode(mode);
                                if (mode === "quick") setCustomSituation("");
                                else setSituationValue("");
                            }}
                        />

                        <AnimatePresence mode="wait">
                            {situationMode === "quick" ? (
                                <motion.div
                                    key="quick-situation"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {situations.map((s) => (
                                        <SelectionChip
                                            key={s.value}
                                            label={s.label}
                                            selected={situationValue === s.value}
                                            onClick={() => setSituationValue(s.value)}
                                            compact
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <InlineTextInput
                                    key="custom-situation"
                                    value={customSituation}
                                    onChange={setCustomSituation}
                                    placeholder="got promoted but feel unprepared... just pivoted the company... took a job that's way over my head..."
                                    maxLength={100}
                                    autoFocus
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step 3: Struggle Selection */}
            <AnimatePresence>
                {hasSituation && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8 overflow-hidden"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                            <span className="text-[var(--color-ink)] font-medium">and I'm struggling with...</span>
                        </div>

                        <ModeToggle
                            mode={struggleMode}
                            onModeChange={(mode) => {
                                setStruggleMode(mode);
                                if (mode === "quick") setCustomStruggle("");
                                else setStruggleValue("");
                            }}
                        />

                        <AnimatePresence mode="wait">
                            {struggleMode === "quick" ? (
                                <motion.div
                                    key="quick-struggle"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {struggles.map((s) => (
                                        <SelectionChip
                                            key={s.value}
                                            label={s.label}
                                            selected={struggleValue === s.value}
                                            onClick={() => setStruggleValue(s.value)}
                                            compact
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <InlineTextInput
                                    key="custom-struggle"
                                    value={customStruggle}
                                    onChange={setCustomStruggle}
                                    placeholder="balancing speed with quality... feeling like everyone expects me to have answers... knowing when to push back vs. compromise..."
                                    maxLength={150}
                                    autoFocus
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview & Submit */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="pt-6 border-t border-[var(--color-accent)]/10"
                    >
                        {/* Preview sentence */}
                        <motion.div
                            initial={{ scale: 0.98 }}
                            animate={{ scale: 1 }}
                            className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-accent)]/10 border border-[var(--color-accent)]/15"
                        >
                            <p className="text-[var(--color-ink)] font-serif text-base md:text-lg leading-relaxed">
                                <span className="text-[var(--color-ink-light)]">"</span>
                                I'm a <strong className="text-[var(--color-accent)]">{getRoleLabel()}</strong> who
                                just <strong className="text-[var(--color-accent)]">{getSituationLabel()}</strong> and
                                I'm struggling with <strong className="text-[var(--color-accent)]">{getStruggleLabel()}</strong>.
                                <span className="text-[var(--color-ink-light)]">"</span>
                            </p>
                        </motion.div>

                        <div className="text-center">
                            <motion.button
                                onClick={handleSubmit}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary text-lg px-12 py-4 shadow-lg"
                            >
                                ✉️ Get My Letter
                            </motion.button>
                            <p className="text-xs text-[var(--color-ink-light)] mt-3">
                                We'll find leaders who were in your exact shoes
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
