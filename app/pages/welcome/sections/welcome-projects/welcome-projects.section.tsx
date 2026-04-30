import { Link } from 'react-router';
import { Container } from '@/components/layouts/container/container.component';
import { ProjectSectionHeader } from '@/pages/projects/components/project-section-header/project-section-header.component';
import { useProjects } from '@/pages/projects/hooks/use-projects.hook';
import { ProjectCard } from '@/pages/projects/sections/project-card.component';
import * as styles from './welcome-projects.css';

export function WelcomeProjectsSection() {
	const { projects } = useProjects();
	const featured = projects.slice(0, 3);

	return (
		<section className={styles.sectionStyle}>
			<div className={`${styles.blobStyle} ${styles.blobGoldStyle}`} />
			<div className={`${styles.blobStyle} ${styles.blobCyanStyle}`} />
			<div className={`${styles.blobStyle} ${styles.blobVioletStyle}`} />

			<Container className={styles.contentStyle}>
				<ProjectSectionHeader
					as="h2"
					subtitle="_SIDE PROJECTS · OPEN SOURCE · EXPERIMENTS_"
				/>

				<div className={styles.gridStyle}>
					{featured.map(({ slug, ...project }) => (
						<ProjectCard key={slug} {...project} />
					))}
				</div>

				<div className={styles.footerStyle}>
					<Link to="/projects" className={styles.viewAllStyle}>
						_VIEW ALL PROJECTS_
						<span className={styles.viewAllArrowStyle}>⤘</span>
					</Link>
				</div>
			</Container>
		</section>
	);
}
