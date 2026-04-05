import React from "react";
import { Badge, Card } from "antd";

type RibbonCardProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  color?: string;
  placement?: "start" | "end";
  className?: string;
  style?: React.CSSProperties;
  cardClassName?: string;
  cardStyle?: React.CSSProperties;
  bordered?: boolean;
  size?: "default" | "small";
  bodyStyle?: React.CSSProperties;
  extra?: React.ReactNode;
};

const RibbonCard = ({
  title,
  children,
  color = "blue",
  placement = "start",
  className = "",
  style,
  cardClassName = "",
  cardStyle,
  bordered = false,
  size = "default",
  bodyStyle,
  extra,
}: RibbonCardProps) => {
  return (
    <div className={className} style={style}>
      <Badge.Ribbon text={title} color={color} placement={placement}>
        <br />
        <Card
          bordered={bordered}
          size={size}
          className={cardClassName}
          style={cardStyle}
          extra={extra}
          styles={{
            body: bodyStyle,
          }}
        >
          {children}
        </Card>
      </Badge.Ribbon>
    </div>
  );
};

export default RibbonCard;
