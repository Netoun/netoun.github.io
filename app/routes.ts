import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("pages/welcome/page/welcome.page.tsx"),
  route("labs", "pages/labs/layout/labs.layout.tsx", [
    index("pages/labs/page/labs-index.page.tsx"),
    route(":slug", "pages/labs/page/labs-experiment.page.tsx"),
  ]),
  route("misc", "pages/labs/page/misc-redirect.page.tsx"),
  // Any other path: the 404 and its game. Not prerendered; Pages serves it as `404.html`.
  route("*", "pages/not-found/page/not-found.page.tsx"),
] satisfies RouteConfig;
