import { WelcomeExperienceSection } from '../sections/welcome-experience/welcome-experience.section';
import { WelcomeHeroSection } from '../sections/welcome-hero/welcome-hero.section';
import { WelcomeProjectsSection } from '../sections/welcome-projects/welcome-projects.section';
import { WelcomeSkillsSection } from '../sections/welcome-skills/welcome-skills.section';

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
			<WelcomeSkillsSection />
			<WelcomeExperienceSection />
			<WelcomeProjectsSection />
		</main>
	);
}
