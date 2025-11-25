"use client";

import { ThemeToggle } from "@/components/ui/hero-section/theme-toggle";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Cloud,
  Eye,
  EyeOff,
  Frown,
  MapPin,
  Meh,
  Save,
  Smile,
  Sun,
  Tag,
  Type,
  X,
  Zap,
} from "lucide-react";
import { Caveat } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function NewEntryPage() {
  const router = useRouter();
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState(50);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [environment, setEnvironment] = useState<string | null>(null);
  const [isCursive, setIsCursive] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, value } = textarea;

    // Create a mirror element to calculate cursor position
    const div = document.createElement("div");
    const style = window.getComputedStyle(textarea);

    // Copy relevant styles
    Array.from(style).forEach((prop) => {
      div.style.setProperty(prop, style.getPropertyValue(prop));
    });

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.top = "0";
    div.style.left = "0";

    // Text content up to the cursor
    const textContent = value.substring(0, selectionStart);
    div.textContent = textContent;

    // Add a marker span
    const span = document.createElement("span");
    span.textContent = "|";
    div.appendChild(span);

    document.body.appendChild(div);

    // Calculate position relative to the textarea
    // We need to account for scrolling
    const { offsetLeft, offsetTop } = span;
    // For y, we subtract scrollTop to keep the "spotlight" aligned with the visible text
    // However, since the overlay is absolutely positioned inside the relative container,
    // and the textarea scrolls internally, we actually want the position relative to the SCROLLED content
    // if the overlay SCROLLS with it?
    // Wait, if the textarea scrolls, the text moves up.
    // The caret position (offsetTop) increases as we type down.
    // scrollTop increases.
    // Visual Y = offsetTop - scrollTop.
    const relativeX = offsetLeft;
    const relativeY = offsetTop - textarea.scrollTop;

    setCursorPos({ x: relativeX, y: relativeY });

    document.body.removeChild(div);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isPrivate) return;

    updateCursorPosition();
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Update cursor position on click or arrow keys too
  const handleSelect = () => {
    if (isPrivate) updateCursorPosition();
  };

  useEffect(() => {
    if (!isPrivate) {
      setIsTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  }, [isPrivate]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const moods = [
    { value: "excited", icon: Zap, label: "Excited", color: "text-yellow-500" },
    { value: "happy", icon: Smile, label: "Happy", color: "text-green-500" },
    { value: "neutral", icon: Meh, label: "Neutral", color: "text-blue-500" },
    { value: "down", icon: Frown, label: "Low", color: "text-neutral-500" },
    {
      value: "drained",
      icon: Activity,
      label: "Drained",
      color: "text-red-500",
    },
  ];

  const environments = [
    { value: "home", label: "Home", icon: MapPin },
    { value: "work", label: "Work", icon: Activity },
    { value: "transit", label: "Transit", icon: Cloud },
    { value: "nature", label: "Nature", icon: Sun },
  ];

  return (
    <main
      className={cn(
        "min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black",
        isCursive && caveat.className
      )}
    >
      {/* Main Content */}
      <div className="pt-6 pb-8 px-8 lg:px-16 max-w-[1600px] mx-auto">
        {/* Top Bar - Back Button and Cursive Toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsCursive(!isCursive)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all",
                isCursive
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                  : "bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              )}
            >
              <Type size={16} />
              {isCursive ? "Cursive On" : "Cursive Off"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Title Section */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                Cognitive Focus
              </label>
              <Input
                className="text-4xl md:text-5xl font-bold border-none px-0 h-auto placeholder:text-neutral-300 dark:placeholder:text-neutral-700 focus-visible:ring-0 rounded-none bg-transparent dark:bg-transparent shadow-none"
                placeholder="What's on your mind?"
              />
            </div>

            {/* Main Content */}
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  Stream of Consciousness
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={cn(
                    "h-8 px-3 rounded-full text-xs font-medium transition-all duration-500",
                    isPrivate
                      ? "bg-black text-white dark:bg-white dark:text-neutral-900 shadow-lg shadow-black/20"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                  )}
                >
                  {isPrivate ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 mr-2" />
                      Hidden Mode
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 mr-2" />
                      Visible
                    </>
                  )}
                </Button>
              </div>
              <div className="relative group">
                <textarea
                  ref={textareaRef}
                  onChange={handleTyping}
                  onSelect={handleSelect}
                  onScroll={handleSelect}
                  className={cn(
                    "w-full min-h-[500px] resize-none bg-transparent leading-relaxed border-none focus:ring-0 p-0 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 focus:outline-none transition-all ease-in-out relative z-0",
                    isPrivate ? "text-neutral-800 dark:text-neutral-200" : "",
                    isCursive ? "text-4xl" : "text-2xl"
                  )}
                  placeholder="Start writing..."
                />

                {/* Blur Overlay with Spotlight Mask */}
                {isPrivate && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none z-10 backdrop-blur-[6px] bg-white/40 dark:bg-black/40 transition-all duration-[1500ms]"
                    style={{
                      maskImage: isTyping
                        ? `radial-gradient(circle at ${cursorPos.x}px ${
                            cursorPos.y + 16
                          }px, transparent 0px, transparent 40px, black 120px)`
                        : `radial-gradient(circle at ${cursorPos.x}px ${
                            cursorPos.y + 16
                          }px, transparent 0px, transparent 0px, black 60px)`,
                      WebkitMaskImage: isTyping
                        ? `radial-gradient(circle at ${cursorPos.x}px ${
                            cursorPos.y + 16
                          }px, transparent 0px, transparent 40px, black 120px)`
                        : `radial-gradient(circle at ${cursorPos.x}px ${
                            cursorPos.y + 16
                          }px, transparent 0px, transparent 0px, black 60px)`,
                    }}
                  />
                )}

                {isPrivate && !isTyping && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-1000 z-20">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-neutral-400 dark:text-neutral-600 font-medium text-sm flex items-center gap-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200/50 dark:border-neutral-800/50"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Flow Mode Active - Keep Typing
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Metadata */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8 lg:border-l lg:border-neutral-100 lg:dark:border-neutral-900 lg:pl-12"
          >
            <div className="space-y-8">
              {/* Mood Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  Emotional State
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                        mood === m.value
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg"
                          : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      )}
                    >
                      <m.icon
                        size={20}
                        className={mood === m.value ? "text-current" : m.color}
                      />
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Slider */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest flex justify-between items-center">
                  <span>Energy Level</span>
                  <span className="text-black dark:text-white font-mono text-sm">
                    {energy}%
                  </span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energy}
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  />
                </div>
              </div>

              {/* Environment */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  Environment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {environments.map((env) => (
                    <button
                      key={env.value}
                      onClick={() => setEnvironment(env.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all justify-center",
                        environment === env.value
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                          : "bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      )}
                    >
                      <env.icon size={14} />
                      {env.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  Tags & Concepts
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 min-h-[80px] p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 h-fit"
                      >
                        <Tag size={12} />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type and press Enter..."
                    className="w-full px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-1 focus:ring-black dark:focus:ring-white focus:outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-neutral-100 dark:border-neutral-900"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="px-8 h-11 text-base hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-full"
          >
            Discard
          </Button>
          <Button className="rounded-full px-8 h-11 text-base font-semibold bg-black dark:bg-white text-white dark:text-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-transparent dark:border-neutral-200">
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
