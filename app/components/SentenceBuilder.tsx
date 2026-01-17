"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserInput, ROLES, SITUATIONS, STRUGGLES } from "@/types";

interface SentenceBuilderProps {
    onSubmit: (input: UserInput) => void;
}

export default function SentenceBuilder({ onSubmit }: SentenceBuilderProps) {
    const [role, setRole] = useState("");
    const [situation, setSituation] = useState("");
    const [struggle, setStruggle] = useState("");

    // Reset situation when role changes
    useEffect(() => {
        setSituation("");
    }, [role]);

    const situations = role ? SITUATIONS[role] || [] : [];
    const isComplete = role && situation && struggle;

    const handleSubmit = () => {
        if (isComplete) {
            const roleLabel = ROLES.find((r) => r.value === role)?.label || role;
            const situationLabel =
                situations.find((s) => s.value === situation)?.label || situation;
            const struggleLabel =
                STRUGGLES.find((s) => s.value === struggle)?.label || struggle;

            onSubmit({
                role: roleLabel,
                situation: situationLabel,
                struggle: struggleLabel,
            });
        }
    };

    return (
        <div className="letter-container p-8 md:p-12">
            <div className="stamp">✉️</div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-ink)] mb-2">
                    Complete this sentence to get your letter:
                </h2>
                <p className="text-[var(--color-ink-light)] text-sm">
                    Be honest—the more specific, the more relevant your advice will be.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 letter-content text-lg md:text-xl"
            >
                {/* Sentence Part 1 */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[var(--color-ink)]">I&apos;m a</span>
                    <div className="select-wrapper">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="custom-select"
                        >
                            <option value="" disabled>
                                Select your role...
                            </option>
                            {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sentence Part 2 */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[var(--color-ink)]">who just</span>
                    <div className="select-wrapper">
                        <select
                            value={situation}
                            onChange={(e) => setSituation(e.target.value)}
                            className="custom-select"
                            disabled={!role}
                        >
                            <option value="" disabled>
                                {role ? "Select your situation..." : "First, select your role"}
                            </option>
                            {situations.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sentence Part 3 */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[var(--color-ink)]">and I&apos;m struggling with</span>
                    <div className="select-wrapper">
                        <select
                            value={struggle}
                            onChange={(e) => setStruggle(e.target.value)}
                            className="custom-select"
                            disabled={!situation}
                        >
                            <option value="" disabled>
                                {situation ? "Select your struggle..." : "First, select your situation"}
                            </option>
                            {STRUGGLES.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 text-center"
            >
                <button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    className="btn-primary text-lg"
                >
                    ✉️ Get My Letter
                </button>
            </motion.div>
        </div>
    );
}
