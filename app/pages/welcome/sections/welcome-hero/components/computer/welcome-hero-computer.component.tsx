import { useEffect, useRef, useState } from 'react';
import { Computer } from '@/components/misc/computer/computer.component';
import { Image } from '@/components/primitives/image/Image';
import { useAnimationPriority } from '@/hooks/use-animation-priority.hook';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer.hook';
import type { MousePosition } from '@/hooks/use-mouse-position';
import WelcomeHeroImage from '@/pages/welcome/assets/welcome-hero.png';
import { DotsCanvas } from '../../../../../../components/misc/dots-canvas/dots-canvas.component';
import * as styles from './welcome-hero-computer.css';

export function WelcomeHeroComputerComponent({
	mousePosition,
}: {
	mousePosition: MousePosition;
}) {
	const [rotation, setRotation] = useState({ x: 0, y: 0 });
	const mousePositionRef = useRef(mousePosition);
	const containerRef = useRef<HTMLDivElement>(null);

	// Intersection observer to detect visibility
	const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
		threshold: 0.1,
		rootMargin: '100px',
	});

	// High priority animation (hero section is important)
	const shouldAnimate = useAnimationPriority({
		priority: 'high',
		isVisible: isIntersecting,
	});

	useEffect(() => {
		mousePositionRef.current = mousePosition;
	}, [mousePosition]);

	// Merge refs
	useEffect(() => {
		if (containerRef.current && intersectionRef.current !== containerRef.current) {
			(intersectionRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current;
		}
	}, [intersectionRef]);

	useEffect(() => {
		let frameId: number;
		let idleCallbackId: number | undefined;
		let lastUpdateTime = 0;
		const updateInterval = 16; // ~60fps max

		const animate = (currentTime: number) => {
			frameId = requestAnimationFrame(animate);

			// Skip animation if should not animate (not visible or low priority)
			if (!shouldAnimate) return;

			// Throttle updates to reduce unnecessary renders
			if (currentTime - lastUpdateTime < updateInterval) {
				return;
			}
			lastUpdateTime = currentTime;

			const currentMousePosition = mousePositionRef.current;
			
			// Use requestIdleCallback for non-critical rotation updates
			if (idleCallbackId) {
				cancelIdleCallback(idleCallbackId);
			}

			if ('requestIdleCallback' in window) {
				idleCallbackId = requestIdleCallback(() => {
					setRotation({
						x: currentMousePosition.x * -0.001,
						y: currentMousePosition.y * -0.001,
					});
				}, { timeout: 100 });
			} else {
				// Fallback for browsers without requestIdleCallback
				setRotation({
					x: currentMousePosition.x * -0.001,
					y: currentMousePosition.y * -0.001,
				});
			}
		};
		frameId = requestAnimationFrame(animate);

		return () => {
			if (frameId) {
				cancelAnimationFrame(frameId);
			}
			if (idleCallbackId) {
				cancelIdleCallback(idleCallbackId);
			}
		};
	}, [shouldAnimate]);

	return (
		<div ref={containerRef} className={styles.welcomeHeroComputerWrapperStyles}>
			<div
				style={
					{
						'--mouse-position-x': `${rotation.x}deg`,
						'--mouse-position-y': `${rotation.y}deg`,
					} as React.CSSProperties
				}
				className={styles.welcomeHeroComputerCapturesStyles}
			>
				<Computer className={styles.welcomeHeroComputerStyles}>
					<Image
						src={WelcomeHeroImage}
						alt="Welcome Hero"
						className={styles.welcomeHeroComputerImageStyles}
					/>
					<DotsCanvas mousePosition={mousePosition} priority="high" />
					<div className={styles.welcomeHeroComputerContentStyles}>
						<h3>Prout of concept</h3>
					</div>
				</Computer>
			</div>
		</div>
	);
}
