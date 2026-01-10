import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface CircularScoreProps {
  score: number;
  label: string;
  color: string;
}

const CircularScore = ({ score, label, color }: CircularScoreProps) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 90) * circumference;

  // --- Animation Configuration ---
  // Define the spring transition once to ensure both animations sync up
  const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15, // Adjust damping to control the "bounciness". Lower = more bounce.
    duration: 0.9, // ~500ms duration target
  };

  // --- Number Counter Setup ---
  // 1. Create a MotionValue to track the count status
  const count = useMotionValue(0);
  // 2. Transform that value into a rounded integer string for display
  const roundedScore = useTransform(count, (latest) =>
    Math.round(latest).toString()
  );

  useEffect(() => {
    // 3. Trigger the animation of the count value on mount/score change
    const controls = animate(count, score, springTransition);
    // Cleanup animation on unmount
    return controls.stop;
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        {/* SVG Ring */}
        <svg width="80" height="80" className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="6"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress Path - Using motion.circle */}
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeLinecap="round"
            // Start completely empty
            initial={{ strokeDashoffset: circumference }}
            // Animate to the calculated offset
            animate={{ strokeDashoffset: targetOffset }}
            // Apply the spring transition
            transition={springTransition}
          />
        </svg>

        {/* Score Text - Using motion.span to display the transforming value */}
        <motion.span className="absolute f18 w700 text-primary">
          {roundedScore}
        </motion.span>
      </div>
      <span className="f14 w600 text-primary opacity-80">{label}</span>
    </div>
  );
};

export default CircularScore;
