import { useEffect, useRef, useState } from 'react';
import { Section } from '@/components/layouts/sections/section.component';
import { Button } from '@/components/primitives/button/button.component';
import { useMousePosition } from '@/hooks/use-mouse-position';
import { WelcomeHeroFilterBackground } from './components/backgound/welcome-hero-filter-background.component';
import { WelcomeHeroComputerComponent } from './components/computer/welcome-hero-computer.component';
import { useWelcomeHeroContentAnimation } from './hooks/use-welcome-hero-content-animation.hook';
import * as styles from './welcome-hero.css';

export function WelcomeHeroSection() {
	const welcomeContainerRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = useState(true); // Start as true to avoid flash on initial load
	const mousePosition = useMousePosition({
		container: container ?? undefined,
	});

	useEffect(() => {
		if (welcomeContainerRef.current) {
			setContainer(welcomeContainerRef.current);
		}
	}, []);

	// IntersectionObserver to pause animations when section is not visible
	useEffect(() => {
		if (!welcomeContainerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					setIsVisible(entry.isIntersecting);
				});
			},
			{
				threshold: 0.1, // Trigger when 10% of the section is visible
			},
		);

		observer.observe(welcomeContainerRef.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	const { startAnimation } = useWelcomeHeroContentAnimation();

	useEffect(() => {
		if (headingRef.current && descriptionRef.current) {
			// Use getElementById for button (faster than getElementsByClassName)
			const button = document.getElementById('welcome-button');
			if (button) {
				startAnimation({
					welcomeHeading: headingRef.current,
					welcomeDescription: descriptionRef.current,
					welcomeButton: button as HTMLElement,
				});
			}
		}
	}, [startAnimation]);

	return (
		<Section
			className={styles.welcomeSectionStyles}
			data-section="welcome-hero"
		>
			

			<div
				ref={welcomeContainerRef}
				id="welcome-container"
				className={styles.welcomeContainerStyle}
			>
				{isVisible && (
					<WelcomeHeroFilterBackground
						container={container}
						mousePosition={mousePosition}
					/>
				)}
				<div className={styles.welcomeContentStyle}>
					<h1
						id="welcome-heading"
						ref={headingRef}
						className={styles.welcomeHeadingStyles}
					>
						Hi, I'm Nicolas — <br /> Full stack engineer creating clean,
						efficient web apps.
					</h1>
					<p
						id="welcome-description"
						ref={descriptionRef}
						className={styles.welcomeDescriptionStyles}
					>
						<b>_</b>❯ I'm passionate about web technologies and I love to learn
						new things. I'm always looking for new challenges and opportunities
						to grow. I'm currently working at{' '}
						<a
							className={styles.welcomeLinkStyles}
							href="https://www.lonestone.io"
						>
							Lonestone
						</a>{' '}
						as a software engineer.
						<span className={styles.welcomeDescriptionCursorStyles}>▐</span>
					</p>
					<Button
						id="welcome-button"
						className={styles.welcomeButtonStyles}
					>
						_Get my resume_{' '}
						<span className={styles.welcomeButtonArrowStyles}>⤘</span>
					</Button>
				</div>
			</div>

			{/* {isVisible && (
				<div>
					<WelcomeHeroComputerComponent mousePosition={mousePosition} />
				</div>
			)} */}
		</Section>
	);
}
