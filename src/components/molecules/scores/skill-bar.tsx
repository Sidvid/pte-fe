import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface SkillBarProps {
  label: string;
  score: number;
  color: string;
}

const SkillBar = ({ label, score, color }: SkillBarProps) => {
  // --- Animation Config (Same as CircularScore for consistency) ---
  const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15,
    duration: 0.5,
  };

  // --- Number Counter Setup ---
  const count = useMotionValue(0);
  const roundedScore = useTransform(count, (latest) =>
    Math.round(latest).toString()
  );

  useEffect(() => {
    const controls = animate(count, score, springTransition);
    return controls.stop;
  }, [score]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-end">
        <span className="f14 w500 text-primary opacity-70">{label}</span>

        {/* Animated Score Number */}
        <motion.span className="f14 w700 text-primary">
          {roundedScore}
        </motion.span>
      </div>

      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Animated Progress Bar Fill */}
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${(score / 90) * 100}%` }}
          transition={springTransition}
        />
      </div>
    </div>
  );
};

export default SkillBar;
