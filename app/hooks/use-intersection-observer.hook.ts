import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
	threshold?: number | number[];
	rootMargin?: string;
	enabled?: boolean;
}

/**
 * Hook to detect when an element is visible in the viewport
 * Useful for pausing animations when elements are not visible
 */
export function useIntersectionObserver(
	options: UseIntersectionObserverOptions = {}
) {
	const { threshold = 0, rootMargin = '0px', enabled = true } = options;
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
	const elementRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element || !enabled) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
				setEntry(entry);
			},
			{
				threshold,
				rootMargin,
			}
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [threshold, rootMargin, enabled]);

	return { ref: elementRef, isIntersecting, entry };
}

