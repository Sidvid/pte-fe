import React from "react";
import { motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";
interface SelectionCardProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subtitle?: string;
  isSelected: boolean;
  onClick: () => void;
}
const SelectionCard = ({
  icon: Icon,
  title,
  subtitle,
  isSelected,
  onClick,
}: SelectionCardProps) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative cursor-pointer group
        flex flex-col items-center justify-center gap-12
        p-20 rounded-2xl border-2 transition-all duration-300
        w-full h-[160px]
        ${
          isSelected
            ? "bg-link/5 border-link shadow-lg shadow-link/10"
            : "bg-background border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
        }
      `}
    >
      {/* Selected Checkmark Badge (Top Right) */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-10 right-10 text-link"
        >
          <AiOutlineCheckCircle size={20} />
        </motion.div>
      )}

      {/* Icon Section */}
      <div
        className={`
        p-16 rounded-full transition-colors duration-300
        ${
          isSelected
            ? "bg-link text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-link group-hover:bg-link/10"
        }
      `}
      >
        <Icon size={28} />
      </div>

      {/* Text Section */}
      <div className="text-center">
        <h4
          className={`f16 w600 transition-colors ${
            isSelected ? "text-link" : "text-primary"
          }`}
        >
          {title}
        </h4>
        {subtitle && (
          <p className="f12 w400 opacity-60 mt-4 text-primary">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default SelectionCard;
