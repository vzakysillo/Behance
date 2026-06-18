import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InterestsPage from "./pages/InterestsPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectsPage from "./pages/ProjectsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/Sidebar";
import { routes } from "./routes";

function App() {
  return (
    <Routes>
      <Route path={routes.welcome()} element={<WelcomePage />} />
      <Route path={routes.auth.login()} element={<LoginPage />} />
      <Route path={routes.auth.register()} element={<RegisterPage />} />
      <Route path={routes.auth.interests()} element={<InterestsPage />} />
      <Route path={routes.profile.root()} element={<ProfilePage />} />
      <Route path={routes.profile.projects()} element={<ProjectsPage />} />
      <Route path={routes.profile.projectNew()} element={<CreateProjectPage />} />
      <Route path="/profile/projects/:id" element={<ProjectDetailPage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage publicView />} />
      <Route
        path="/"
        element={
          <div className="flex">
            <Sidebar />
            <HomePage />
          </div>
        }
      />
      <Route path="*" element={<Navigate to={routes.welcome()} replace />} />
    </Routes>
  );
}

export default App;
