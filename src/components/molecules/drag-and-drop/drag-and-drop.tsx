import { motion } from "framer-motion";
import { useDrag } from "./drag-context";

type Props = {
  index: number;
  onSwap: (from: number, to: number) => void;
  children: React.ReactNode;
};

export const DraggableItem = ({ index, onSwap, children }: Props) => {
  const { activeIndex, overIndex, setActiveIndex, setOverIndex } = useDrag();

  const isDragging = activeIndex === index;
  const isOver = overIndex === index && activeIndex !== index;

  return (
    <motion.div
      layout
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.15}
      onDragStart={() => setActiveIndex(index)}
      onPointerEnter={() => {
        if (activeIndex !== null && activeIndex !== index) {
          setOverIndex(index);
        }
      }}
      onDragEnd={() => {
        if (
          activeIndex !== null &&
          overIndex !== null &&
          activeIndex !== overIndex
        ) {
          onSwap(activeIndex, overIndex);
        }
        setActiveIndex(null);
        setOverIndex(null);
      }}
      whileDrag={{
        scale: 1.05,
        zIndex: 50,
        boxShadow: "0 25px 50px rgba(124,58,237,0.35)",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className="relative cursor-grab active:cursor-grabbing"
    >
      {/* DROP TARGET HIGHLIGHT */}
      {isOver && (
        <div
          className="
            absolute -inset-[3px] rounded-xl
            bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400
            blur-md opacity-80
          "
        />
      )}

      <div className="relative">{children}</div>
    </motion.div>
  );
};
