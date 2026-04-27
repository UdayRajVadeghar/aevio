"use client";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Loader2, Lock, Pause, Play, RefreshCw, ShieldAlert, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MOCK_TEXTS = [
  {
    id: 1,
    title: "Excited Welcome",
    text: `[excitedly] Welcome to Aevio! Your personal AI nutrition and fitness coach. [laughs] I'm so happy you're here! Let's get you on track to feeling amazing.`,
    category: "Greeting",
  },
  {
    id: 2,
    title: "Daily Summary (Podcast Style)",
    text: `Say in an upbeat podcast host voice:
Good morning! [short pause] Here's your daily summary. You've consumed 1,200 calories so far today, with 80 grams of protein. [medium pause] You need about 600 more calories to reach your daily goal. [excitedly] But hey, you're crushing it on the protein front!`,
    category: "Summary",
  },
  {
    id: 3,
    title: "Gentle Workout Reminder",
    text: `[calm, warm tone] Hey there. [short pause] Based on your schedule, I'd suggest a 30-minute strength training session today. [sighs contentedly] Focus on upper body exercises to balance your weekly routine. [whispers] You've got this.`,
    category: "Fitness",
  },
  {
    id: 4,
    title: "Concerned Meal Reminder",
    text: `[concerned] Hey, it's been 4 hours since your last meal. [short pause] Consider having a protein-rich snack to keep your energy levels steady. [reassuringly] Something like Greek yogurt or a handful of almonds would be perfect. [laughs] Don't make me come over there!`,
    category: "Nutrition",
  },
  {
    id: 5,
    title: "Motivational Hype",
    text: `[shouting] Let's GO! [medium pause] [excitedly] Great job staying consistent with your workouts this week! [short pause] Remember, progress is not always linear, [whispers] but every single step counts. [normal voice] You're building something amazing. Keep pushing. [laughs]`,
    category: "Motivation",
  },
  {
    id: 6,
    title: "Spooky Diet Warning",
    text: `[whispers] I see you eyeing that second slice of cake... [medium pause] [like dracula] That's 450 calories of pure darkness! [laughs] [normal voice] Just kidding, enjoy it. Life's too short. But maybe go for a walk after? [giggles]`,
    category: "Fun",
  },
  {
    id: 7,
    title: "Multi-emotion Demo",
    text: `[excited] Oh wow, your stats this week are incredible! [amazed] Your protein intake is up 20 percent! [sighs] But... [reluctantly] your water intake could use some work. [encouraging] But hey, one step at a time, right? [laughs] We'll get there together.`,
    category: "Demo",
  },
  {
    id: 8,
    title: "Intense Expressive Demo",
    text: `[whispers] ah! [whispers] ah [whispers] ah [trembling] [trembling]ah [panicked] ah [panicked] ahyeahhh [trembling] [trembling] harder [cough] [trembling] [trembling] harderrrr [panting] please [panting] please [panting] please [panting] yes [panting] yes [panting] yes [panting] yes`,
    category: "Demo",
  },
];

const GEMINI_VOICES = [
  { name: "Zephyr", label: "Zephyr", vibe: "Bright" },
  { name: "Puck", label: "Puck", vibe: "Upbeat" },
  { name: "Charon", label: "Charon", vibe: "Informative" },
  { name: "Kore", label: "Kore", vibe: "Firm" },
  { name: "Fenrir", label: "Fenrir", vibe: "Excitable" },
  { name: "Leda", label: "Leda", vibe: "Youthful" },
  { name: "Orus", label: "Orus", vibe: "Firm" },
  { name: "Aoede", label: "Aoede", vibe: "Breezy" },
  { name: "Callirrhoe", label: "Callirrhoe", vibe: "Easy-going" },
  { name: "Autonoe", label: "Autonoe", vibe: "Bright" },
  { name: "Enceladus", label: "Enceladus", vibe: "Breathy" },
  { name: "Iapetus", label: "Iapetus", vibe: "Clear" },
  { name: "Umbriel", label: "Umbriel", vibe: "Easy-going" },
  { name: "Algieba", label: "Algieba", vibe: "Smooth" },
  { name: "Despina", label: "Despina", vibe: "Smooth" },
  { name: "Erinome", label: "Erinome", vibe: "Clear" },
  { name: "Algenib", label: "Algenib", vibe: "Gravelly" },
  { name: "Rasalgethi", label: "Rasalgethi", vibe: "Informative" },
  { name: "Laomedeia", label: "Laomedeia", vibe: "Upbeat" },
  { name: "Achernar", label: "Achernar", vibe: "Soft" },
  { name: "Alnilam", label: "Alnilam", vibe: "Firm" },
  { name: "Schedar", label: "Schedar", vibe: "Even" },
  { name: "Gacrux", label: "Gacrux", vibe: "Mature" },
  { name: "Pulcherrima", label: "Pulcherrima", vibe: "Forward" },
  { name: "Achird", label: "Achird", vibe: "Friendly" },
  { name: "Zubenelgenubi", label: "Zubenelgenubi", vibe: "Casual" },
  { name: "Vindemiatrix", label: "Vindemiatrix", vibe: "Gentle" },
  { name: "Sadachbia", label: "Sadachbia", vibe: "Lively" },
  { name: "Sadaltager", label: "Sadaltager", vibe: "Knowledgeable" },
  { name: "Sulafat", label: "Sulafat", vibe: "Warm" },
];

const TTS_MODELS = [
  { id: "gemini-2.5-flash-preview-tts", label: "Gemini 2.5 Flash TTS" },
  { id: "gemini-2.5-pro-preview-tts", label: "Gemini 2.5 Pro TTS" },
  { id: "gemini-3.1-flash-tts-preview", label: "Gemini 3.1 Flash TTS (Latest — no Pro version)" },
];

export default function TTSTestPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [selectedMock, setSelectedMock] = useState(MOCK_TEXTS[0]);
  const [customText, setCustomText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Kore");
  const [selectedModel, setSelectedModel] = useState(TTS_MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"mock" | "custom">("mock");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isPending && (!session || session.user.email !== "udayraj.vadeghar@gmail.com")) {
      // Optional: Redirect to home or just show access denied
      // router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (!session || session.user.email !== "udayraj.vadeghar@gmail.com") {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 border border-black/10 dark:border-white/10 text-center space-y-4 bg-neutral-50 dark:bg-neutral-900/30">
          <div className="w-12 h-12 mx-auto bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Restricted Access</h1>
          <p className="text-sm text-neutral-500 font-mono">
            This area is strictly classified. Only authorized personnel are permitted beyond this point.
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-red-500 border border-red-500/20 px-3 py-1.5 bg-red-500/10">
            <Lock className="w-3 h-3" />
            Access Denied
          </div>
        </div>
      </div>
    );
  }

  const handleSynthesize = async () => {
    const textToSynthesize =
      activeTab === "mock" ? selectedMock.text : customText;

    if (!textToSynthesize.trim()) {
      setError("Please enter or select some text to synthesize.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioData(null);
    setLatencyMs(null);

    const start = performance.now();

    try {
      const response = await fetch("/api/tts/gcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSynthesize,
          voiceName: selectedVoice,
          model: selectedModel,
        }),
      });

      const data = await response.json();
      setLatencyMs(Math.round(performance.now() - start));

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to synthesize speech",
        );
      }

      setAudioData(data.audioBase64);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    } catch (err) {
      setLatencyMs(Math.round(performance.now() - start));
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => setIsPlaying(false);

  const selectedVoiceInfo = GEMINI_VOICES.find(
    (v) => v.name === selectedVoice,
  );

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-neutral-200/30 dark:bg-neutral-800/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-neutral-200/30 dark:bg-neutral-800/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500 border border-black/10 dark:border-white/10 px-3 py-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Classified Environment
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
            Next Big Shit???
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl mx-auto font-mono">
            Testing grounds for hyper-realistic conversational AI voices.
            Emotions, laughs, whispers, and pauses fully supported.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
          {/* Left Column - Text Selection (3 cols) */}
          <div className="lg:col-span-3 space-y-6 bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-black/10 dark:border-white/10 p-6 shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-black/10 dark:border-white/10">
              <button
                onClick={() => setActiveTab("mock")}
                className={cn(
                  "px-6 py-3 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer relative",
                  activeTab === "mock"
                    ? "text-black dark:text-white"
                    : "text-neutral-500 hover:text-black dark:hover:text-white",
                )}
              >
                Mock Data
                {activeTab === "mock" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={cn(
                  "px-6 py-3 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer relative",
                  activeTab === "custom"
                    ? "text-black dark:text-white"
                    : "text-neutral-500 hover:text-black dark:hover:text-white",
                )}
              >
                Custom Text
                {activeTab === "custom" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                )}
              </button>
            </div>

            {activeTab === "mock" ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {MOCK_TEXTS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedMock(item);
                      setAudioData(null);
                      setIsPlaying(false);
                      audioRef.current?.pause();
                    }}
                    className={cn(
                      "w-full text-left p-4 border transition-all cursor-pointer relative overflow-hidden group",
                      selectedMock.id === item.id
                        ? "border-black dark:border-white bg-black/[0.02] dark:bg-white/[0.05]"
                        : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]",
                    )}
                  >
                    {selectedMock.id === item.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-black dark:bg-white" />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-neutral-500">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-2 whitespace-pre-wrap font-mono leading-relaxed group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                      {item.text}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    Enter Custom Text
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Use tags like [laughs], [whispers], [sighs], [short pause]
                  </span>
                </div>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={`Try something like:\n\n[excitedly] Hey there! [laughs] Welcome to the app.\n[whispers] I've got a secret for you...\n[short pause]\n[shouting] You're amazing!`}
                  className="w-full h-48 p-4 border border-black/20 dark:border-white/20 bg-transparent resize-none focus:outline-none focus:border-black dark:focus:border-white text-sm font-mono"
                />
                {/* Quick tag insert buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "[laughs]",
                    "[sighs]",
                    "[whispers]",
                    "[shouting]",
                    "[excitedly]",
                    "[giggles]",
                    "[gasp]",
                    "[short pause]",
                    "[medium pause]",
                    "[sarcastic]",
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setCustomText((prev) => prev + " " + tag + " ")
                      }
                      className="px-2 py-1 text-[10px] font-mono border border-black/10 dark:border-white/10 text-neutral-500 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Controls & Playback (2 cols) */}
          <div className="lg:col-span-2 space-y-6 bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-black/10 dark:border-white/10 p-6 shadow-sm">
            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 border border-black/20 dark:border-white/20 bg-transparent focus:outline-none focus:border-black dark:focus:border-white text-sm"
              >
                {TTS_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-3 border border-black/20 dark:border-white/20 bg-transparent focus:outline-none focus:border-black dark:focus:border-white text-sm"
              >
                {GEMINI_VOICES.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.label} — {voice.vibe}
                  </option>
                ))}
              </select>
              {selectedVoiceInfo && (
                <p className="text-[10px] font-mono text-neutral-400">
                  {selectedVoiceInfo.name}: {selectedVoiceInfo.vibe} tone
                </p>
              )}
            </div>

            {/* Synthesize Button */}
            <button
              onClick={handleSynthesize}
              disabled={isLoading}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-mono uppercase tracking-widest text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:shadow-none active:translate-y-1 active:translate-x-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Generate Speech
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono break-all flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Audio Player */}
            {audioData && (
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-neutral-500 flex items-center justify-between">
                  <span>Playback</span>
                  {latencyMs !== null && (
                    <span className="text-[10px] text-emerald-500">
                      {latencyMs}ms
                    </span>
                  )}
                </label>
                <div className="p-4 border border-black/10 dark:border-white/10 flex items-center gap-4 bg-white/50 dark:bg-black/50">
                  <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 shrink-0 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer rounded-none"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold tracking-tight uppercase">
                      {isPlaying ? "Playing..." : "Ready"}
                    </p>
                    <p className="text-[10px] font-mono text-neutral-500 truncate">
                      {selectedVoiceInfo?.name} · {selectedVoiceInfo?.vibe}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAudioData(null);
                      setIsPlaying(false);
                      audioRef.current?.pause();
                    }}
                    className="p-2 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
                    title="Clear"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <audio
                  ref={audioRef}
                  src={`data:audio/wav;base64,${audioData}`}
                  onEnded={handleAudioEnded}
                  className="hidden"
                />
              </div>
            )}

            {/* Audio Tags Reference */}
            <div className="p-4 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50">
              <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">
                Audio Tags
              </h3>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-neutral-500">
                {[
                  "[laughs]",
                  "[sighs]",
                  "[whispers]",
                  "[shouting]",
                  "[excitedly]",
                  "[giggles]",
                  "[gasp]",
                  "[cough]",
                  "[sarcastic]",
                  "[amazed]",
                  "[curious]",
                  "[panicked]",
                  "[short pause]",
                  "[medium pause]",
                  "[long pause]",
                  "[trembling]",
                ].map((tag) => (
                  <span key={tag} className="py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.3); border-radius: 3px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.5); }
      `,
        }}
      />
    </main>
  );
}
