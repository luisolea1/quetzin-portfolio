import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.jsx"),
  route("work", "./routes/work.jsx"),
  route("about", "./routes/about.jsx"),
  route("projects/:slug", "./routes/project.jsx"),
  route("*", "./routes/not-found.jsx"),
];
