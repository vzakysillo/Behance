import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectsPage from "./pages/ProjectsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import { routes } from "./routes";

function App() {
  return (
    <Routes>
      <Route path={routes.auth.login()} element={<LoginPage />} />
      <Route path={routes.auth.register()} element={<RegisterPage />} />
      <Route path={routes.profile.root()} element={<ProfilePage />} />
      <Route path={routes.profile.projects()} element={<ProjectsPage />} />
      <Route path={routes.profile.projectNew()} element={<CreateProjectPage />} />
      <Route path="/profile/projects/:id" element={<ProjectDetailPage />} />
      <Route path="*" element={<Navigate to={routes.profile.root()} replace />} />
    </Routes>
  );
}

export default App;
