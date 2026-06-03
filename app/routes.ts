import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("pages/welcome/page/welcome.page.tsx"),
  route("labs", "pages/labs/layout/labs.layout.tsx", [
    index("pages/labs/page/labs-index.page.tsx"),
    route(":slug", "pages/labs/page/labs-experiment.page.tsx"),
  ]),
  route("misc", "pages/labs/page/misc-redirect.page.tsx"),
] satisfies RouteConfig;
