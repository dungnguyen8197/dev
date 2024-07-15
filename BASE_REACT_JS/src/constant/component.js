import { Link } from "react-router-dom";

export const linkComponent = (href) => ({
  component: "a",
  href,
  target: "_blank",
  rel: "noreferrer",
});

export const routeComponent = (route) => ({
  component: Link,
  to: route,
});
