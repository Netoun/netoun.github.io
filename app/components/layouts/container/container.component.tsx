import clsx from "clsx";
import { containerStyle } from "./container.css";

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return <div className={clsx(containerStyle, className)}>{children}</div>;
}
