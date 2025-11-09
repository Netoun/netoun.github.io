import { createTimeline, stagger, text } from 'animejs';
import { useCallback } from 'react';
import { vars } from '@/styles/theme.css';

type WelcomeHeroContentAnimationProps = {
	welcomeHeading: HTMLElement;
	welcomeDescription: HTMLElement;
	welcomeButton: HTMLElement;
};
export function useWelcomeHeroContentAnimation() {
	const startAnimation = useCallback(
		({
			welcomeHeading,
			welcomeDescription,
			welcomeButton,
		}: WelcomeHeroContentAnimationProps) => {
			const { chars: charsDescription } = text.split(welcomeDescription, {
				chars: true,
			});

			createTimeline({
				defaults: { ease: 'inQuint', duration: 300 },
			})
				.add(
					welcomeHeading,
					{
						opacity: [0, 1],
						transform: ['translateY(8px)', 'translateY(0px)'],
						ease: 'inOutSine',
						duration: 1000,
					},
					'start',
				)
				.add(
					welcomeButton,
					{
						opacity: [0, 1],
						transform: ['translateY(10px)', 'translateY(0)'],
						ease: 'inOutSine',
						duration: 300,
					},
					'start',
				)
				.add(
					charsDescription,
					{
						display: {
							from: 'inline-block',
							to: 'unset',
							duration: 10,
							ease: 'inOutSine',
						},
						opacity: [0, 1],
						translateY: [4, 0],
						rotate: [0, 10, -10, 0],
						ease: 'inOutSine',
					},
					stagger(18),
				)

				.init();
		},
		[],
	);

	return {
		startAnimation,
	};
}
