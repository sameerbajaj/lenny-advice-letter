"use client";

import { useState, useRef } from "react";
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
    const letterRef = useRef<HTMLDivElement>(null);

    // Generate a proper address line - use AI-generated one if available, otherwise format nicely
    const getAddressLine = () => {
        if (letter.addressLine) {
            return letter.addressLine;
        }
        // Fallback: create a grammatically correct address
        const role = userInput.role.toLowerCase();
        const situation = userInput.situation;

        // Clean up common grammar issues
        if (situation.startsWith("am ")) {
            return `To the ${role} who is ${situation.slice(3)}`;
        }
        if (situation.startsWith("started ")) {
            return `To the ${role} who just ${situation}`;
        }
        return `To the ${role} navigating ${situation}`;
    };

    // Get list of unique guest names for the share
    const getGuestNames = () => {
        const guests = letter.quotes.map(q => q.guest);
        const unique = [...new Set(guests)];
        if (unique.length <= 2) {
            return unique.join(" and ");
        }
        return unique.slice(0, -1).join(", ") + ", and " + unique[unique.length - 1];
    };

    const handleCopy = async () => {
        const textContent = `
Lenny's Time Capsule Letter

${getAddressLine()}

${letter.opening}

${letter.quotes
                .map(
                    (q) => `💡 ${q.takeaway || ""}

"${q.text}"
— ${q.guest}
${q.context}${q.episodeUrl ? `\n🎧 ${q.episodeUrl}` : ""}`
                )
                .join("\n\n---\n\n")}

${letter.closing}

Get your letter: sameerbajaj.com/tools/timecapsule
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
        // Simple, compelling share: just list the impressive guests
        const tweetText = `My personalized Lenny's Time Capsule letter includes advice from ${getGuestNames()} 📨`;

        const url = "https://sameerbajaj.com/tools/timecapsule";
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, "_blank");
    };

    return (
        <div className="space-y-6">
            {/* The Letter */}
            <motion.div
                ref={letterRef}
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
                        {getAddressLine()},
                    </p>
                    <p className="text-[var(--color-ink-light)]">{letter.opening}</p>
                </motion.div>

                {/* Quotes with Takeaways */}
                <div className="space-y-8 mb-8">
                    {letter.quotes.map((quote, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.12 }}
                            className="quote-block"
                        >
                            {/* Takeaway - The actionable insight */}
                            {quote.takeaway && (
                                <p className="text-[var(--color-ink)] font-medium mb-3 text-base">
                                    💡 {quote.takeaway}
                                </p>
                            )}

                            {/* The Quote */}
                            <p className="text-lg md:text-xl font-serif text-[var(--color-ink)] mb-3 opacity-90">
                                &ldquo;{quote.text}&rdquo;
                            </p>

                            {/* Attribution */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[var(--color-accent)] font-semibold">
                                    — {quote.guest}
                                </span>
                                {quote.episodeUrl && (
                                    <a
                                        href={quote.episodeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-[var(--color-accent)] text-white px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                                    >
                                        🎧 Listen
                                    </a>
                                )}
                            </div>

                            {/* Context */}
                            <p className="text-sm text-[var(--color-ink-light)] italic mt-1">
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
                        (curated from{" "}
                        <a
                            href="https://www.lennyspodcast.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-accent)] hover:underline"
                        >
                            Lenny&apos;s Podcast
                        </a>
                        )
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
                    𝕏 Share on X
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
                        🎧 Go deeper — full episodes:
                    </h3>
                    <ul className="space-y-3">
                        {letter.episodeLinks.map((ep, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-[var(--color-accent)] mt-0.5">→</span>
                                <div>
                                    <span className="font-medium text-[var(--color-ink)]">{ep.guest}</span>
                                    <span className="text-[var(--color-ink-light)]"> — {ep.title}</span>
                                    {ep.url && (
                                        <a
                                            href={ep.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-xs bg-[var(--color-paper-dark)] text-[var(--color-ink)] px-2 py-0.5 rounded hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                                        >
                                            Watch →
                                        </a>
                                    )}
                                </div>
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
