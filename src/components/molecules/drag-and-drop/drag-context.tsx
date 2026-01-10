// drag/DragContext.tsx
import { createContext, useContext, useState } from "react";

type DragCtx = {
  activeIndex: number | null;
  overIndex: number | null;
  setActiveIndex: (i: number | null) => void;
  setOverIndex: (i: number | null) => void;
};

const DragContext = createContext<DragCtx | null>(null);

export const DragProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  return (
    <DragContext.Provider
      value={{ activeIndex, overIndex, setActiveIndex, setOverIndex }}
    >
      {children}
    </DragContext.Provider>
  );
};

export const useDrag = () => {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error("useDrag must be used inside DragProvider");
  return ctx;
};
