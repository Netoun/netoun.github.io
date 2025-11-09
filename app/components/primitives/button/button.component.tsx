import { Button as AriaButton } from 'react-aria-components';

export interface ButtonProps {
	id?: string;
	children: React.ReactNode;
	onPress?: () => void;
	isDisabled?: boolean;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	id,
	children,
	onPress,
	isDisabled = false,
	className,
	...props
}) => {
	return (
		<AriaButton
			onPress={onPress}
			isDisabled={isDisabled}
			className={className}
			{...props}
		>
			{children}
		</AriaButton>
	);
};
