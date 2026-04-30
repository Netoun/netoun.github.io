import { useEffect, useState } from 'react';

export type AnimationPriority = 'high' | 'medium' | 'low';

interface AnimationPriorityConfig {
	priority: AnimationPriority;
	isVisible: boolean;
}

/**
 * Hook to manage animation priority based on visibility and priority level
 * - High priority: Always animate (even when not visible)
 * - Medium priority: Animate when visible
 * - Low priority: Animate when visible and system is idle
 */
export function useAnimationPriority({
	priority,
	isVisible,
}: AnimationPriorityConfig): boolean {
	const [shouldAnimate, setShouldAnimate] = useState(false);

	useEffect(() => {
		// High priority: always animate
		if (priority === 'high') {
			setShouldAnimate(true);
			return;
		}

		// Medium priority: animate when visible
		if (priority === 'medium') {
			setShouldAnimate(isVisible);
			return;
		}

		// Low priority: animate when visible and check for idle time
		if (priority === 'low') {
			if (!isVisible) {
				setShouldAnimate(false);
				return;
			}

			// Check if browser is idle before starting low-priority animations
			if ('requestIdleCallback' in window) {
				const idleCallbackId = requestIdleCallback(
					() => {
						setShouldAnimate(true);
					},
					{ timeout: 1000 },
				);

				return () => {
					cancelIdleCallback(idleCallbackId);
					setShouldAnimate(false);
				};
			}

			// Fallback: just use visibility
			setShouldAnimate(isVisible);
		}
	}, [priority, isVisible]);

	return shouldAnimate;
}
