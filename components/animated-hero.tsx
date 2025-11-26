"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

type HeroProps = {
  latestRelease?: {
    id: number;
    title: string;
    artist: string;
    cover_image_url: string;
  } | null;
  heroImage?: string | null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const itemTransition = {
  duration: 0.8,
  ease: "easeOut" as const,
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
  },
};

const floatingTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export function AnimatedHero({ latestRelease, heroImage }: HeroProps) {
  // Use custom hero image if provided, otherwise fall back to latest release cover
  const backgroundImageUrl = heroImage || latestRelease?.cover_image_url;

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Animated Background Image */}
      {backgroundImageUrl && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src={backgroundImageUrl}
            alt="Hero background"
            fill
            className="object-cover blur-3xl opacity-20"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      )}

      {/* Animated Particles/Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 blur-3xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        className="container mx-auto px-4 z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-6 tracking-tight"
          variants={itemVariants}
          transition={itemTransition}
        >
          <motion.span
            className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500"
            animate={{
              backgroundPosition: ["0%", "100%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            ARTIST
          </motion.span>
          <br />
          <motion.span
            className="text-foreground"
            variants={itemVariants}
            transition={itemTransition}
          >
            NAME
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
          transition={itemTransition}
        >
          Producer, Artist, Creator —{" "}
          <motion.span
            className="text-primary font-semibold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Pushing boundaries through sound.
          </motion.span>
        </motion.p>

        <motion.div
          className="flex flex-col gap-6 justify-center items-center"
          variants={itemVariants}
          transition={itemTransition}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/music">
              <Button
                size="lg"
                className="text-lg px-10 py-6 shadow-[0_0_30px_rgba(255,16,240,0.4)] hover:shadow-[0_0_40px_rgba(255,16,240,0.6)] transition-shadow"
              >
                <Play className="mr-2 h-5 w-5" />
                Listen Now
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-6 border-2"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
        variants={floatingVariants}
        animate="animate"
        transition={floatingTransition}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2 backdrop-blur-sm bg-background/20">
          <motion.div
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
