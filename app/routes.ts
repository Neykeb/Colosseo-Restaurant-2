import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("prototypes/colosseo", "routes/colosseo-prototypes.tsx"),
  route(":lang/:page?", "routes/site.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
