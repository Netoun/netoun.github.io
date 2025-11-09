type ImageProps = {
	src: string;
	alt: string;
	className?: string;
};

export function Image({ src, alt, ...props }: ImageProps) {
	return <img src={src} alt={alt} {...props} />;
}
