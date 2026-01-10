import * as React from "react";
import { Badge, Space } from "antd";
interface CardProps {
  children: React.ReactNode;
  ribbonText?: string;
  ribbonColor?: string; // optional custom color like 'bg-red-500'
}

export function Card({
  children,
  ribbonText,
  ribbonColor = "bg-red-500",
}: CardProps) {
  return ribbonText ? (
    <Badge.Ribbon text={ribbonText} color={ribbonColor}>
      <div className="relative  bg-foreground shadow-card rounded-[12px] p-24 w-full h-full overflow-hidden">
        {children}
      </div>
    </Badge.Ribbon>
  ) : (
    <div className="relative bg-foreground shadow-card rounded-[12px] p-24 w-full h-full overflow-hidden">
      {children}
    </div>
  );
}

export default Card;
