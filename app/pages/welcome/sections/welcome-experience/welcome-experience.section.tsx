import { animate, stagger } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/layouts/container/container.component';
import { useAnimationPriority } from '@/hooks/use-animation-priority.hook';
import * as styles from './welcome-experience.css';

interface Experience {
	company: string;
	role: string;
	period: string;
	location: string;
	description: string;
	stack: string[];
	current?: boolean;
}

const EXPERIENCES: Experience[] = [
	{
		company: 'Lonestone',
		role: 'Software Engineer',
		period: '2022 — Present',
		location: 'Nantes, FR',
		description:
			'Full stack development of web applications for clients across various industries. Architecture, code quality, and delivery of complex features in agile teams.',
		stack: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL'],
		current: true,
	},
];

export function WelcomeExperienceSection() {
	const titleRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const shouldAnimate = useAnimationPriority({ priority: 'medium', isVisible });

	useEffect(() => {
		const section = timelineRef.current?.closest('section');
		if (!section) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(section);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!shouldAnimate || !titleRef.current || !timelineRef.current) return;

		animate(titleRef.current, {
			opacity: [0, 1],
			translateY: [20, 0],
			ease: 'outQuad',
			duration: 600,
		});

		animate(timelineRef.current.querySelectorAll('[data-entry]'), {
			opacity: [0, 1],
			translateX: [-24, 0],
			ease: 'outQuart',
			duration: 500,
			delay: stagger(120, { start: 250 }),
		});
	}, [shouldAnimate]);

	return (
		<section className={styles.sectionStyle}>
			<div className={`${styles.blobStyle} ${styles.blobCyanStyle}`} />
			<div className={`${styles.blobStyle} ${styles.blobGoldStyle}`} />

			<Container className={styles.contentStyle}>
				<div ref={titleRef} className={styles.headerStyle}>
					<h2 className={styles.titleStyle}>
						<span className={styles.prefixStyle}>_❯</span>
						EXPERIENCE
						<span className={styles.cursorStyle}>▐</span>
					</h2>
					<p className={styles.subtitleStyle}>
						_WORK HISTORY · PROFESSIONAL EXPERIENCE_
					</p>
				</div>

				<div ref={timelineRef} className={styles.timelineStyle}>
					<div className={styles.timelineLineStyle} />
					{EXPERIENCES.map((exp) => (
						<div
							key={`${exp.company}-${exp.period}`}
							data-entry
							className={styles.entryStyle}
						>
							<div className={styles.timelineDotStyle}>
								{exp.current && <div className={styles.timelineDotPingStyle} />}
							</div>

							<div className={styles.cardStyle}>
								<div className={styles.cardBarStyle}>
									<div className={styles.cardBarLeftStyle}>
										<div className={styles.terminalButtonsStyle}>
											<span className={styles.terminalButtonStyle} />
											<span className={styles.terminalButtonStyle} />
											<span className={styles.terminalButtonStyle} />
										</div>
										<span className={styles.companyStyle}>{exp.company}</span>
										{exp.current && (
											<span className={styles.currentBadgeStyle}>ACTIVE</span>
										)}
									</div>
									<span className={styles.periodStyle}>{exp.period}</span>
								</div>

								<div className={styles.cardBodyStyle}>
									<div className={styles.roleRowStyle}>
										<span className={styles.promptStyle}>⤘</span>
										<span className={styles.roleStyle}>{exp.role}</span>
										<span className={styles.locationStyle}>{exp.location}</span>
									</div>
									<p className={styles.descriptionStyle}>{exp.description}</p>
									<div className={styles.stackStyle}>
										{exp.stack.map((tech) => (
											<span key={tech} className={styles.stackTagStyle}>
												{tech}
											</span>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
