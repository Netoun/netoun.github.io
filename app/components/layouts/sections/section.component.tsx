import clsx from "clsx";
import { sectionStyle } from "./section.css";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.RefObject<HTMLDivElement | null>;
}

export function Section({ children, className, ref, ...props }: SectionProps) {
  return (
    <section className={clsx(sectionStyle, className)} ref={ref} {...props}>
      {children}
    </section>
  );
}
