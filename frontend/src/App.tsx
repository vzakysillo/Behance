import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./components/ui";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InterestsPage from "./pages/InterestsPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage"
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectPublishedPage from "./pages/ProjectPublishedPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import UploadAssetPage from "./pages/UploadAssetPage";
import ProjectAssetsPage from "./pages/ProjectAssetsPage";
import { ProjectCreationProvider } from "./context/ProjectCreationContext";
import Sidebar from "./components/Sidebar";
import { routes } from "./routes";

function SidebarLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="ml-[200px] flex-1 min-h-0">
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
          <Route path="/users/:id" element={<PublicProfilePage />} />
          <Route path={routes.profile.edit()} element={<ProfileEditPage />} />
          <Route path={routes.profile.projectPublished(":id")} element={<ProjectPublishedPage />} />
          <Route path="/profile/projects/:id" element={<ProjectDetailPage />} />

          <Route element={<ProjectCreationProvider><Outlet /></ProjectCreationProvider>}>
            <Route path={routes.profile.projectNew()} element={<UploadAssetPage />} />
            <Route path={routes.profile.projectAssets()} element={<ProjectAssetsPage />} />
            <Route path={routes.profile.projectDetails()} element={<CreateProjectPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={routes.welcome()} replace />} />
    </Routes>
  );
}

export default App;
