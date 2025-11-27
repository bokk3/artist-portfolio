"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  direction = "left",
  speed = 20,
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap", className)}>
      <motion.div
        className="flex min-w-full shrink-0 items-center gap-4 py-4"
        animate={{
          x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
      <motion.div
        className="flex min-w-full shrink-0 items-center gap-4 py-4"
        animate={{
          x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}
