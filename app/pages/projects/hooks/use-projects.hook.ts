import { projects as staticProjects } from '../data/projects-data';
import type { Project } from './use-projects.hook.types';

export function useProjects(): { projects: Project[] } {
	return { projects: staticProjects };
}
