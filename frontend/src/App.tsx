import { Navigate, Route, Routes } from "react-router-dom";
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

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <HomePage />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path={routes.welcome()} element={<WelcomePage />} />
      <Route path={routes.auth.login()} element={<LoginPage />} />
      <Route path={routes.auth.register()} element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path={routes.auth.interests()}
        element={<ProtectedRoute><InterestsPage /></ProtectedRoute>}
      />
      <Route
        path={routes.profile.root()}
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
      />
      <Route
        path={routes.profile.projects()}
        element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>}
      />
      <Route
        path={routes.profile.projectNew()}
        element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>}
      />
      <Route
        path="/profile/projects/:id"
        element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>}
      />

      {/* Public project view */}
      <Route path="/projects/:id" element={<ProjectDetailPage publicView />} />

      <Route path="/" element={<MainLayout />} />
      <Route path="*" element={<Navigate to={routes.welcome()} replace />} />
    </Routes>
  );
}

export default App;
