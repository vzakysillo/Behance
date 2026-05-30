import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { routes } from "../routes";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <section>
      <div>
        <p>Welcome back</p>
        <h1>Login</h1>
      </div>

      <LoginForm onSuccess={() => navigate(routes.profile.root())} />

      <p>
        Need an account? <Link to={routes.auth.register()}>Register</Link>
      </p>
    </section>
  );
}
