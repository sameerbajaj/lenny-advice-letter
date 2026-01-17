"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SentenceBuilder from "@/components/SentenceBuilder";
import LoadingState from "@/components/LoadingState";
import LetterDisplay from "@/components/LetterDisplay";
import { UserInput, LetterResponse } from "@/types";

export default function Home() {
  const [step, setStep] = useState<"input" | "loading" | "letter">("input");
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [letter, setLetter] = useState<LetterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: UserInput) => {
    setUserInput(input);
    setStep("loading");
    setError(null);

    try {
      const response = await fetch("/tools/timecapsule/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to generate letter");
      }

      const data = await response.json();
      setLetter(data);
      setStep("letter");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  };

  const handleReset = () => {
    setStep("input");
    setUserInput(null);
    setLetter(null);
    setError(null);
  };

  return (
    <main className="min-h-screen py-8 px-4 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-5xl mb-4">📨</div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-ink)] mb-3 text-balance">
            Time Capsule
          </h1>
          <p className="text-[var(--color-ink-light)] text-lg text-balance">
            Get a letter from product leaders who were in your exact situation
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SentenceBuilder onSubmit={handleSubmit} />
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {step === "letter" && letter && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LetterDisplay
                letter={letter}
                userInput={userInput!}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-[var(--color-ink-light)]"
        >
          Based on 269 episodes of{" "}
          <a
            href="https://www.lennyspodcast.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:underline"
          >
            Lenny&apos;s Podcast
          </a>
        </motion.div>
      </div>
    </main>
  );
}
