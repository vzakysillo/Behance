import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./components/ui";
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

function SidebarLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[200px] flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* No sidebar */}
      <Route path={routes.welcome()} element={<WelcomePage />} />
      <Route path={routes.auth.login()} element={<LoginPage />} />
      <Route path={routes.auth.register()} element={<RegisterPage />} />

      {/* With sidebar */}
      <Route element={<SidebarLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage publicView />} />

        <Route element={<ProtectedRoute />}>
          <Route path={routes.auth.interests()} element={<InterestsPage />} />
          <Route path={routes.profile.root()} element={<ProfilePage />} />
          <Route path={routes.profile.projects()} element={<ProjectsPage />} />
          <Route path={routes.profile.projectNew()} element={<CreateProjectPage />} />
          <Route path="/profile/projects/:id" element={<ProjectDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={routes.welcome()} replace />} />
    </Routes>
  );
}

export default App;
