import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../api/user.api";
import LoginForm from "../components/LoginForm";
import { routes } from "../routes";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Featured project preview">
        <Link className="login-back" to={routes.welcome()} aria-label="Back to home">
          <span className="login-back-icon" aria-hidden="true" />
          <span>Back</span>
        </Link>
        <p>picture</p>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-intro">
          <h1 id="login-title">Welcome Home!</h1>
          <p>Please enter your details</p>
        </div>

        <LoginForm
          onSuccess={async () => {
            const user = await getMe();

            navigate(user.skills?.length ? routes.home() : routes.auth.interests());
          }}
        />

        <div className="login-divider" aria-hidden="true">
          <span />
          <p>or continue with</p>
          <span />
        </div>

        <div className="login-socials" aria-label="Social login options">
          <button type="button" aria-label="Continue with Google">
            G
          </button>
          <button type="button" aria-label="Continue with Facebook">
            f
          </button>
          <button type="button" aria-label="Continue with Apple">
            A
          </button>
        </div>

        <p className="login-register">
          Don't have an account? <Link to={routes.auth.register()}>Sign UP</Link>
        </p>
      </section>
    </main>
  );
}
