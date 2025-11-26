"use client";

import { ArrowRight, ArrowDown, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlowGuideProps {
  step: number;
  totalSteps: number;
  currentStep: number;
  direction?: "horizontal" | "vertical";
  showArrow?: boolean;
  completed?: boolean;
  label?: string;
}

export function FlowGuide({
  step,
  totalSteps,
  currentStep,
  direction = "horizontal",
  showArrow = true,
  completed = false,
  label,
}: FlowGuideProps) {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep || completed;

  const ArrowIcon = direction === "horizontal" ? ArrowRight : ArrowDown;

  return (
    <div className="flex items-center gap-2" style={{ flexDirection: direction === "horizontal" ? "row" : "column" }}>
      <div className="relative flex items-center justify-center">
        <motion.div
          className={cn(
            "flex items-center justify-center rounded-full border-2 transition-all",
            isActive
              ? "h-10 w-10 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-110"
              : isCompleted
              ? "h-8 w-8 border-primary/50 bg-primary/20 text-primary"
              : "h-8 w-8 border-muted-foreground/30 bg-muted/30 text-muted-foreground"
          )}
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <span className="text-sm font-bold">{step}</span>
          )}
        </motion.div>
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      {label && (
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            isActive
              ? "text-primary"
              : isCompleted
              ? "text-primary/70"
              : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      )}
      {showArrow && step < totalSteps && (
        <motion.div
          animate={isActive ? { x: direction === "horizontal" ? [0, 4, 0] : 0, y: direction === "vertical" ? [0, 4, 0] : 0 } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <ArrowIcon
            className={cn(
              "transition-colors",
              isActive
                ? "h-6 w-6 text-primary"
                : isCompleted
                ? "h-5 w-5 text-primary/50"
                : "h-5 w-5 text-muted-foreground/30"
            )}
          />
        </motion.div>
      )}
    </div>
  );
}

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  direction?: "horizontal" | "vertical";
}

export function StepIndicator({ currentStep, steps, direction = "horizontal" }: StepIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        direction === "horizontal" ? "flex-row gap-2" : "flex-col gap-4"
      )}
    >
      {steps.map((label, index) => (
        <FlowGuide
          key={index}
          step={index + 1}
          totalSteps={steps.length}
          currentStep={currentStep}
          direction={direction}
          showArrow={index < steps.length - 1}
          label={label}
        />
      ))}
    </div>
  );
}

