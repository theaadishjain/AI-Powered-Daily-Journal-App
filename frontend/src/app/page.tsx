"use client";
import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, ExclamationCircleIcon, PencilSquareIcon, SparklesIcon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// --- Particle background component (hydration-safe) ---
const NUM_PARTICLES = 30;
const ParticleBg = () => {
  const [particles, setParticles] = useState<
    { cx: string; cy: string; r: number; fill: string; opacity: number }[]
  >([]);

  useEffect(() => {
    const arr = Array.from({ length: NUM_PARTICLES }).map((_, i) => ({
      cx: Math.random() * 100 + "%",
      cy: Math.random() * 100 + "%",
      r: Math.random() * 2 + 1,
      fill: `url(#g${i % 3})`,
      opacity: 0.3 + Math.random() * 0.3,
    }));
    setParticles(arr);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <svg className="w-full h-full">
        {particles.map((p, i) => (
          <circle key={i} {...p} />
        ))}
        <defs>
          <radialGradient id="g0" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0abfc" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

interface JournalEntry {
  _id: string;
  entry: string;
  summary: string;
  mood: string;
  createdAt: string;
}

const moodIcon = (mood: string) => {
  switch (mood) {
    case "Happy":
      return <SparklesIcon className="w-6 h-6 text-yellow-400 drop-shadow-glow" />;
    case "Sad":
      return <ExclamationCircleIcon className="w-6 h-6 text-blue-400 drop-shadow-glow" />;
    case "Anxious":
      return <ExclamationCircleIcon className="w-6 h-6 text-red-400 drop-shadow-glow" />;
    case "Motivated":
      return <CheckCircleIcon className="w-6 h-6 text-green-500 drop-shadow-glow" />;
    default:
      return <PencilSquareIcon className="w-6 h-6 text-purple-400 drop-shadow-glow" />;
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch(`${API_URL}/api/journal`)
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(() => setError("Failed to load entries"));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/journal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry }),
      });
      if (!res.ok) throw new Error("Failed to save entry");
      const newEntry = await res.json();
      setEntries([newEntry, ...entries]);
      setEntry("");
      toast.success("Journal entry saved and analyzed!");
    } catch (err) {
      setError("Failed to save entry");
      toast.error("Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative overflow-x-hidden">
      <ParticleBg />
      <Toaster position="top-right" />
      {/* Navbar */}
      <nav className="sticky top-0 z-30 w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl shadow-xl flex items-center justify-between px-8 py-4 mb-10 border-b border-gray-200 dark:border-gray-800 glassmorphism">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-9 h-9 text-purple-500 animate-pulse drop-shadow-glow" />
          <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight">DayNote</span>
        </div>
        <button
          aria-label="Toggle dark mode"
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <SunIcon className="w-7 h-7 text-yellow-400" /> : <MoonIcon className="w-7 h-7 text-gray-700" />}
        </button>
      </nav>
      {/* Entry Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 shadow-2xl rounded-3xl p-10 mb-12 flex flex-col gap-6 border border-gray-200 dark:border-gray-800 glassmorphism"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <label htmlFor="entry" className="font-bold text-2xl text-gray-700 dark:text-gray-200 flex items-center gap-3">
          <PencilSquareIcon className="w-7 h-7 text-purple-400 animate-bounce" /> Today's Journal
        </label>
        <textarea
          id="entry"
          className="w-full h-36 p-4 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-400/40 bg-gradient-to-br from-blue-50/60 to-purple-100/60 dark:from-gray-800/80 dark:to-gray-900/80 resize-none text-lg shadow-inner transition-all duration-300"
          placeholder="Write your journal entry for today..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 via-fuchsia-400 to-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-60 flex items-center gap-3 justify-center text-lg tracking-wide drop-shadow-glow"
          disabled={loading || !entry.trim()}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              Saving...
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-6 h-6" /> Save Entry
            </>
          )}
        </button>
        <Transition
          show={!!error}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-red-500 text-base mt-1 flex items-center gap-2">
            <ExclamationCircleIcon className="w-6 h-6" /> {error}
          </div>
        </Transition>
      </motion.form>
      {/* Timeline */}
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-3 tracking-tight">
          <SparklesIcon className="w-7 h-7 text-purple-400 animate-pulse" /> Timeline
        </h2>
        <ol className="relative border-l-4 border-fuchsia-300 dark:border-fuchsia-700">
          <AnimatePresence>
            {entries.length === 0 && (
              <motion.div
                className="text-gray-500 text-center py-10 text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No entries yet. Start journaling!
              </motion.div>
            )}
            {entries.map((item, idx) => (
              <motion.li
                key={item._id}
                className="mb-14 ml-8 relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                layout
              >
                <span className="absolute flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 via-fuchsia-400 to-purple-400 rounded-full -left-10 ring-8 ring-white/60 dark:ring-gray-900/60 shadow-2xl animate-float drop-shadow-glow">
                  {moodIcon(item.mood)}
                </span>
                <div className="bg-gradient-to-br from-white/90 via-fuchsia-50/80 to-purple-50/80 dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 p-8 rounded-3xl shadow-2xl border border-fuchsia-100 dark:border-fuchsia-900 glassmorphism hover:scale-[1.025] hover:shadow-3xl transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-400 font-mono">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-700 dark:text-fuchsia-200 font-semibold flex items-center gap-2 shadow-sm">
                      {item.mood} {moodIcon(item.mood)}
                    </span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 whitespace-pre-line mb-3 text-lg font-semibold tracking-tight drop-shadow-glow">{item.entry}</div>
                  <div className="text-base italic text-purple-600 dark:text-purple-300">Summary: {item.summary}</div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
      <style jsx global>{`
        .glassmorphism {
          backdrop-filter: blur(24px) saturate(180%);
          background: rgba(255,255,255,0.25);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.18);
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px #a78bfa) drop-shadow(0 0 2px #f472b6);
        }
        .animate-float {
          animation: float 3s ease-in-out infinite alternate;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
