"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LOADING_MESSAGES = [
    "Searching 269 episodes...",
    "Finding leaders who were in your shoes...",
    "Reading their stories...",
    "Gathering their hard-won wisdom...",
    "Writing your letter...",
];

export default function LoadingState() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Progress animation
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return prev;
                return prev + Math.random() * 15;
            });
        }, 500);

        // Message cycling
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => {
                if (prev >= LOADING_MESSAGES.length - 1) return prev;
                return prev + 1;
            });
        }, 2000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, []);

    return (
        <div className="letter-container p-12 text-center">
            {/* Animated Envelope */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="text-7xl loading-envelope float-animation inline-block">
                    ✉️
                </div>
            </motion.div>

            {/* Loading Message */}
            <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h2 className="text-xl md:text-2xl font-medium text-[var(--color-ink)] mb-2">
                    {LOADING_MESSAGES[messageIndex]}
                </h2>
            </motion.div>

            {/* Progress Bar */}
            <div className="max-w-sm mx-auto">
                <div className="progress-bar">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 95)}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-sm text-[var(--color-ink-light)] mt-3">
                    {Math.round(Math.min(progress, 95))}%
                </p>
            </div>

            {/* Decorative dots */}
            <div className="flex justify-center gap-2 mt-8">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-[var(--color-accent)] rounded-full"
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
