"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserInput, LetterResponse } from "@/types";

interface LetterDisplayProps {
    letter: LetterResponse;
    userInput: UserInput;
    onReset: () => void;
}

export default function LetterDisplay({
    letter,
    userInput,
    onReset,
}: LetterDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const textContent = `
Time Capsule Letter

To the ${userInput.role} who just ${userInput.situation},

${letter.opening}

${letter.quotes
                .map(
                    (q) => `"${q.text}"
— ${q.guest}
${q.context}`
                )
                .join("\n\n")}

${letter.closing}

Get your letter: timecapsule.sameerbajaj.com
    `.trim();

        try {
            await navigator.clipboard.writeText(textContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleShare = () => {
        const tweetText = `Just got my Time Capsule letter.

It found product leaders who were in my EXACT situation and told me what they wish they'd known.

This one hit hard: "${letter.quotes[0]?.text.slice(0, 100)}..."

Get yours:`;

        const url = "https://sameerbajaj.com/tools/timecapsule";
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, "_blank");
    };

    return (
        <div className="space-y-6">
            {/* The Letter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="letter-container p-8 md:p-12"
            >
                <div className="stamp">📨</div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-ink)] mb-2">
                        Your Letter
                    </h2>
                    <div className="w-24 h-1 bg-[var(--gradient-accent)]" style={{ background: "linear-gradient(135deg, #b8860b 0%, #daa520 100%)" }} />
                </motion.div>

                {/* Opening */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="letter-content mb-8"
                >
                    <p className="text-lg text-[var(--color-ink)] italic mb-4">
                        To the {userInput.role} who just {userInput.situation},
                    </p>
                    <p className="text-[var(--color-ink-light)]">{letter.opening}</p>
                </motion.div>

                {/* Quotes */}
                <div className="space-y-8 mb-8">
                    {letter.quotes.map((quote, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.15 }}
                            className="quote-block"
                        >
                            <p className="text-lg md:text-xl font-serif text-[var(--color-ink)] mb-3">
                                &ldquo;{quote.text}&rdquo;
                            </p>
                            <p className="text-[var(--color-accent)] font-semibold">
                                — {quote.guest}
                            </p>
                            <p className="text-sm text-[var(--color-ink-light)] italic">
                                {quote.context}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Closing */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="letter-content border-t border-[var(--color-paper-dark)] pt-6"
                >
                    <p className="text-[var(--color-ink-light)] mb-4">{letter.closing}</p>
                    <p className="font-serif text-lg text-[var(--color-ink)] italic">
                        From Those Who Walked This Path
                    </p>
                    <p className="text-sm text-[var(--color-ink-light)] mt-1">
                        (with help from 269 episodes of Lenny&apos;s Podcast)
                    </p>
                </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-4"
            >
                <button onClick={handleCopy} className="btn-secondary">
                    {copied ? "✓ Copied!" : "📋 Copy Letter"}
                </button>
                <button onClick={handleShare} className="btn-primary">
                    🐦 Share on X
                </button>
            </motion.div>

            {/* Episode Links */}
            {letter.episodeLinks && letter.episodeLinks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="letter-container p-6"
                >
                    <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-4">
                        📎 Go deeper — episodes from your letter:
                    </h3>
                    <ul className="space-y-2">
                        {letter.episodeLinks.map((ep, index) => (
                            <li key={index} className="text-[var(--color-ink-light)]">
                                <span className="text-[var(--color-accent)]">→</span>{" "}
                                <span className="font-medium">{ep.guest}</span> on {ep.title}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Start Over */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
            >
                <button
                    onClick={onReset}
                    className="text-[var(--color-ink-light)] hover:text-[var(--color-accent)] underline text-sm"
                >
                    ← Get a new letter
                </button>
            </motion.div>
        </div>
    );
}
