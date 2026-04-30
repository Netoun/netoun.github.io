import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
	index('pages/welcome/page/welcome.page.tsx'),
	route('misc', 'pages/misc/page/misc.page.tsx'),
	route('projects', 'pages/projects/page/projects.page.tsx'),
] satisfies RouteConfig;
