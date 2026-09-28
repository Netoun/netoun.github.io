import { Button as AriaButton } from "react-aria-components";

export interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
}

export function Button({ id, children, onPress, isDisabled = false, className }: ButtonProps) {
  return (
    <AriaButton id={id} onPress={onPress} isDisabled={isDisabled} className={className}>
      {children}
    </AriaButton>
  );
}
