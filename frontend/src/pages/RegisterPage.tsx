import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { routes } from "../routes";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <section>
      <div>
        <p>Start creating</p>
        <h1>Register</h1>
      </div>

      <RegisterForm onSuccess={() => navigate(routes.login)} />

      <p>
        Already have an account? <Link to={routes.login}>Login</Link>
      </p>
    </section>
  );
}
