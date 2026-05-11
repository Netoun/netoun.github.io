import { Button as AriaButton } from "react-aria-components";

export interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
}

export function Button({
  id: _id,
  children,
  onPress,
  isDisabled = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <AriaButton onPress={onPress} isDisabled={isDisabled} className={className} {...props}>
      {children}
    </AriaButton>
  );
}
