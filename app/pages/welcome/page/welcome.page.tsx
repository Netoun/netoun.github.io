import { WelcomeHeroSection } from '../sections/welcome-hero/welcome-hero.section';

export function meta() {
	return [
		{ title: 'Netoun - Full stack engineer' },
		{ name: 'description', content: 'Welcome to my personal website' },
	];
}

export default function Welcome() {
	return (
		<main>
			<WelcomeHeroSection />
			{/* <BootSequenceSection /> */}
		</main>
	);
}
