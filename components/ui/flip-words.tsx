"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);

  // Reserve width to prevent reflow/CLS when words of different lengths flip
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const measurer = document.createElement('span');
    measurer.style.position = 'fixed';
    measurer.style.left = '-9999px';
    measurer.style.top = '0';
    measurer.style.visibility = 'hidden';
    measurer.className = cn("z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2", className);
    document.body.appendChild(measurer);

    let max = 0;
    for (const w of words) {
      measurer.textContent = w;
      const width = measurer.getBoundingClientRect().width;
      if (width > max) max = width;
    }
    document.body.removeChild(measurer);
    if (max > 0) setMaxWidth(Math.ceil(max));
  }, [words, className]);

  // Function to start animation
  const startAnimation = useCallback(() => {
    const nextWord = words[(words.indexOf(currentWord) + 1) % words.length];
    setCurrentWord(nextWord);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  const fallbackCh = Math.max(...words.map((w) => w.length));

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        exit={{ opacity: 0, y: -40, x: 40, filter: "blur(8px)", scale: 2, position: "absolute" }}
        className={cn("z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2", className)}
        key={currentWord}
        style={{ minWidth: maxWidth ? `${maxWidth}px` : `calc(${fallbackCh}ch + 8px)` }}
      >
        {currentWord.split("").map((letter, index) => (
          <motion.span
            key={currentWord + index}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
