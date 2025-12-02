"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Dumbbell,
  Flame,
  Footprints,
  SkipForward,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";

// --- Types ---

type FormData = {
  // Experience
  trainingExperience: string;
  motivationStyle: string;

  // Body
  bodyFatPercentage: string;
  waistCircumference: string;
  hipCircumference: string;
  restingHeartRate: string;

  // Lifestyle
  workType: string;
  stressLevel: number;
  sleepHours: string;
  stepCount: string;

  // Schedule
  workoutDays: number;
  workoutDuration: number;
  preferredTrainingDays: string[];

  // Preferences
  trainingStyle: string[];
  targetBodyParts: string[];
  equipmentAvailable: string[];
  exerciseDislikes: string; // Comma separated for UI

  // Safety
  injuries: string; // Simplified for UI
};

const initialData: FormData = {
  trainingExperience: "",
  motivationStyle: "",
  bodyFatPercentage: "",
  waistCircumference: "",
  hipCircumference: "",
  restingHeartRate: "",
  workType: "",
  stressLevel: 3,
  sleepHours: "",
  stepCount: "",
  workoutDays: 3,
  workoutDuration: 45,
  preferredTrainingDays: [],
  trainingStyle: [],
  targetBodyParts: [],
  equipmentAvailable: [],
  exerciseDislikes: "",
  injuries: "",
};

// --- Steps Configuration ---

const steps = [
  {
    id: "intro",
    title: "Let's Get Started",
    description: "We'll tailor your plan to your unique physiology.",
  },
  {
    id: "experience",
    title: "Experience & Motivation",
    description: "What's your history with training?",
  },
  {
    id: "lifestyle",
    title: "Lifestyle Factors",
    description: "How does your day-to-day look?",
  },
  {
    id: "body",
    title: "Body Metrics",
    description: "Optional measurements for precision.",
  },
  { id: "schedule", title: "Availability", description: "When can you train?" },
  {
    id: "preferences",
    title: "Training Preferences",
    description: "What do you enjoy?",
  },
  {
    id: "safety",
    title: "Safety First",
    description: "Any injuries we should know about?",
  },
];

export default function PlannerSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [direction, setDirection] = useState(0);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Submit:", formData);
      // Handle completion
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipClick = () => {
    setShowSkipDialog(true);
  };

  const handleConfirmSkip = () => {
    // Logic to skip remaining steps
    console.log("Skipped setup - using defaults");
    setShowSkipDialog(false);
    // Handle skip completion here
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter((i) => i !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  const StepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 rounded-full flex items-center justify-center shadow-lg shadow-amber-200/30 dark:shadow-amber-900/20">
                <Zap className="w-12 h-12 text-amber-500 drop-shadow-sm" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
              Welcome to Your Blueprint
            </h2>
            <p className="text-center text-neutral-500 dark:text-neutral-400">
              To build a truly effective protocol, we need to understand your
              baseline. This takes about 2 minutes. You can skip any optional
              fields.
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <SelectionGroup
              label="Experience Level"
              options={[
                {
                  value: "beginner",
                  label: "Beginner",
                  icon: <User className="w-5 h-5" />,
                  iconColor: "text-amber-600",
                  bgColor: "bg-amber-50 dark:bg-amber-900/20",
                },
                {
                  value: "intermediate",
                  label: "Intermediate",
                  icon: <Dumbbell className="w-5 h-5" />,
                  iconColor: "text-slate-500",
                  bgColor: "bg-slate-100 dark:bg-slate-800/40",
                },
                {
                  value: "advanced",
                  label: "Advanced",
                  icon: <Flame className="w-5 h-5" />,
                  iconColor: "text-orange-500",
                  bgColor: "bg-orange-50 dark:bg-orange-900/20",
                },
              ]}
              selected={formData.trainingExperience}
              onChange={(val) => updateField("trainingExperience", val)}
            />

            <SelectionGroup
              label="Motivation Style"
              options={[
                {
                  value: "strict",
                  label: "Strict (Drill Sergeant)",
                  icon: <Zap className="w-5 h-5" />,
                  iconColor: "text-red-500",
                  bgColor: "bg-red-50 dark:bg-red-900/20",
                },
                {
                  value: "encouraging",
                  label: "Encouraging (Cheerleader)",
                  icon: <Sparkles className="w-5 h-5" />,
                  iconColor: "text-pink-500",
                  bgColor: "bg-pink-50 dark:bg-pink-900/20",
                },
                {
                  value: "chill",
                  label: "Chill (Relaxed)",
                  icon: <Check className="w-5 h-5" />,
                  iconColor: "text-emerald-500",
                  bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
                },
              ]}
              selected={formData.motivationStyle}
              onChange={(val) => updateField("motivationStyle", val)}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <SelectionGroup
              label="Work Type"
              options={[
                {
                  value: "desk_job",
                  label: "Desk Job",
                  icon: <Briefcase className="w-5 h-5" />,
                  iconColor: "text-amber-700",
                  bgColor: "bg-amber-50 dark:bg-amber-900/20",
                },
                {
                  value: "on_feet",
                  label: "On Feet",
                  icon: <Footprints className="w-5 h-5" />,
                  iconColor: "text-teal-600",
                  bgColor: "bg-teal-50 dark:bg-teal-900/20",
                },
                {
                  value: "heavy_labor",
                  label: "Heavy Labor",
                  icon: <Dumbbell className="w-5 h-5" />,
                  iconColor: "text-slate-500",
                  bgColor: "bg-slate-100 dark:bg-slate-800/40",
                },
              ]}
              selected={formData.workType}
              onChange={(val) => updateField("workType", val)}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Daily Steps (Approx)
              </label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={formData.stepCount}
                onChange={(e) => updateField("stepCount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sleep (Hours/Night)</label>
              <Input
                type="number"
                placeholder="e.g. 7.5"
                value={formData.sleepHours}
                onChange={(e) => updateField("sleepHours", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stress Level (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => {
                  const stressColors = [
                    "bg-emerald-500",
                    "bg-lime-500",
                    "bg-amber-500",
                    "bg-orange-500",
                    "bg-red-500",
                  ];
                  return (
                    <button
                      key={level}
                      onClick={() => updateField("stressLevel", level)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                        formData.stressLevel === level
                          ? `${
                              stressColors[level - 1]
                            } text-white border-transparent shadow-md`
                          : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <p className="text-sm text-neutral-500 italic">
              All fields are optional.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Body Fat %</label>
                <Input
                  type="number"
                  placeholder="%"
                  value={formData.bodyFatPercentage}
                  onChange={(e) =>
                    updateField("bodyFatPercentage", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Resting HR</label>
                <Input
                  type="number"
                  placeholder="bpm"
                  value={formData.restingHeartRate}
                  onChange={(e) =>
                    updateField("restingHeartRate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Waist (cm)</label>
                <Input
                  type="number"
                  placeholder="cm"
                  value={formData.waistCircumference}
                  onChange={(e) =>
                    updateField("waistCircumference", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hips (cm)</label>
                <Input
                  type="number"
                  placeholder="cm"
                  value={formData.hipCircumference}
                  onChange={(e) =>
                    updateField("hipCircumference", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Days per Week</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <button
                    key={days}
                    onClick={() => updateField("workoutDays", days)}
                    className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                      formData.workoutDays === days
                        ? "bg-blue-500 text-white border-transparent shadow-md"
                        : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    {days}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (Minutes)</label>
              <div className="grid grid-cols-3 gap-2">
                {[20, 30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => updateField("workoutDuration", mins)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer ${
                      formData.workoutDuration === mins
                        ? "bg-black dark:bg-white text-white dark:text-black border-transparent shadow-md"
                        : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Days</label>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => {
                    const fullDay =
                      day.toLowerCase() +
                      (day === "Wed"
                        ? "nesday"
                        : day === "Thu"
                        ? "rsday"
                        : day === "Sat"
                        ? "urday"
                        : day === "Sun"
                        ? "day"
                        : "day");
                    // Simple mapping for demo, usually would use a library or proper map
                    const value =
                      day === "Mon"
                        ? "monday"
                        : day === "Tue"
                        ? "tuesday"
                        : day === "Wed"
                        ? "wednesday"
                        : day === "Thu"
                        ? "thursday"
                        : day === "Fri"
                        ? "friday"
                        : day === "Sat"
                        ? "saturday"
                        : "sunday";
                    const isSelected =
                      formData.preferredTrainingDays.includes(value);
                    return (
                      <button
                        key={day}
                        onClick={() =>
                          toggleArrayItem("preferredTrainingDays", value)
                        }
                        className={`px-3 py-1 rounded-full text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500 text-white border-transparent shadow-sm"
                            : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Training Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    name: "Strength",
                    color: "from-slate-500 to-slate-600",
                    borderColor: "border-slate-400",
                    bgColor: "bg-slate-50 dark:bg-slate-900/20",
                  },
                  {
                    name: "HIIT",
                    color: "from-red-500 to-orange-500",
                    borderColor: "border-red-400",
                    bgColor: "bg-red-50 dark:bg-red-900/20",
                  },
                  {
                    name: "Calisthenics",
                    color: "from-cyan-500 to-blue-500",
                    borderColor: "border-cyan-400",
                    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
                  },
                  {
                    name: "Yoga",
                    color: "from-purple-500 to-pink-500",
                    borderColor: "border-purple-400",
                    bgColor: "bg-purple-50 dark:bg-purple-900/20",
                  },
                  {
                    name: "Functional",
                    color: "from-amber-500 to-yellow-500",
                    borderColor: "border-amber-400",
                    bgColor: "bg-amber-50 dark:bg-amber-900/20",
                  },
                  {
                    name: "Crossfit",
                    color: "from-emerald-500 to-green-500",
                    borderColor: "border-emerald-400",
                    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
                  },
                ].map((style) => {
                  const val = style.name.toLowerCase();
                  const isSelected = formData.trainingStyle.includes(val);
                  return (
                    <button
                      key={style.name}
                      onClick={() => toggleArrayItem("trainingStyle", val)}
                      className={`p-3 rounded-lg border text-sm text-left transition-all flex justify-between items-center cursor-pointer ${
                        isSelected
                          ? `${style.borderColor} ${style.bgColor} shadow-sm`
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                      }`}
                    >
                      <span
                        className={
                          isSelected
                            ? `bg-gradient-to-r ${style.color} bg-clip-text text-transparent font-medium`
                            : ""
                        }
                      >
                        {style.name}
                      </span>
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 bg-gradient-to-r ${style.color} bg-clip-text`}
                          style={{ color: "currentColor" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Target Areas (Focus)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Chest", color: "from-rose-500 to-pink-600" },
                  { name: "Back", color: "from-blue-500 to-indigo-600" },
                  { name: "Legs", color: "from-emerald-500 to-teal-600" },
                  { name: "Arms", color: "from-orange-500 to-amber-600" },
                  { name: "Abs", color: "from-purple-500 to-violet-600" },
                  { name: "Shoulders", color: "from-cyan-500 to-sky-600" },
                  { name: "Full Body", color: "from-slate-600 to-gray-700" },
                ].map((part) => {
                  const val = part.name.toLowerCase().replace(" ", "_");
                  const isSelected = formData.targetBodyParts.includes(val);
                  return (
                    <button
                      key={part.name}
                      onClick={() => toggleArrayItem("targetBodyParts", val)}
                      className={`px-3 py-2 rounded-full border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? `bg-gradient-to-r ${part.color} text-white border-transparent shadow-md`
                          : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      {part.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Available Equipment</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Gym", color: "from-slate-600 to-zinc-700" },
                  { name: "Dumbbells", color: "from-slate-500 to-gray-600" },
                  { name: "Bands", color: "from-pink-500 to-rose-600" },
                  {
                    name: "Pull-up Bar",
                    color: "from-amber-600 to-orange-700",
                  },
                  { name: "Bench", color: "from-stone-500 to-neutral-600" },
                  { name: "Bodyweight", color: "from-teal-500 to-emerald-600" },
                ].map((eq) => {
                  const val = eq.name.toLowerCase().replace(" ", "_");
                  const isSelected = formData.equipmentAvailable.includes(val);
                  return (
                    <button
                      key={eq.name}
                      onClick={() => toggleArrayItem("equipmentAvailable", val)}
                      className={`px-3 py-2 rounded-full border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? `bg-gradient-to-r ${eq.color} text-white border-transparent shadow-md`
                          : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      {eq.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Exercises to Avoid (Dislikes)
              </label>
              <Input
                placeholder="e.g. Burpees, Running..."
                value={formData.exerciseDislikes}
                onChange={(e) =>
                  updateField("exerciseDislikes", e.target.value)
                }
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
              <AlertCircle className="w-12 h-12 mb-4 text-amber-500" />
              <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                Injuries & Restrictions
              </h3>
              <p className="text-center text-sm max-w-xs mb-6">
                Please describe any injuries or areas we should avoid loading
                heavily.
              </p>
              <textarea
                className="w-full h-32 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                placeholder="e.g. Lower back pain during heavy deadlifts, left shoulder impingement..."
                value={formData.injuries}
                onChange={(e) => updateField("injuries", e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="relative min-h-[400px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-900/50 overflow-hidden">
        <div className="relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">
              {steps[currentStep].title}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              {steps[currentStep].description}
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ x: direction > 0 ? 20 : -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -20 : 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <StepContent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-neutral-100 dark:border-neutral-800">
          <Button
            variant="ghost"
            onClick={currentStep === 0 ? handleSkipClick : handleBack}
            className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {currentStep === 0 ? (
              <span className="flex items-center gap-2">
                Skip Setup <SkipForward className="w-4 h-4" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </span>
            )}
          </Button>

          <Button
            onClick={handleNext}
            className="bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black px-8 cursor-pointer"
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}{" "}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Skip Setup Dialog */}
      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <DialogTitle className="text-center text-xl">
              Skip Setup?
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Without your personalized details, your fitness plan won&apos;t be
              as tailored to your unique needs and goals.
              <span className="block mt-2 text-amber-600 dark:text-amber-400 font-medium">
                Your experience will be less personalized.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowSkipDialog(false)}
              className="flex-1 cursor-pointer"
            >
              Continue Setup
            </Button>
            <Button
              variant="ghost"
              onClick={handleConfirmSkip}
              className="flex-1 text-neutral-500 hover:text-neutral-700 cursor-pointer"
            >
              Skip Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Helper Components ---

function SelectionGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    iconColor?: string;
    bgColor?: string;
  }[];
  selected: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-neutral-900 dark:text-white block mb-2">
        {label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all cursor-pointer
              ${
                selected === opt.value
                  ? `border-transparent ${
                      opt.bgColor || "bg-neutral-50 dark:bg-neutral-800"
                    } text-black dark:text-white ring-2 ring-offset-2 ring-neutral-900 dark:ring-white shadow-lg`
                  : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md"
              }
            `}
          >
            {opt.icon && (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  opt.bgColor || "bg-neutral-100 dark:bg-neutral-800"
                } ${opt.iconColor || "text-neutral-500"}`}
              >
                {opt.icon}
              </div>
            )}
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
