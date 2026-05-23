import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { routes } from "./routes";

function App() {
  return (
    <Routes>
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.register} element={<RegisterPage />} />
      <Route path={routes.profile} element={<ProfilePage />} />
      <Route path="*" element={<Navigate to={routes.profile} replace />} />
    </Routes>
  );
}

export default App;
