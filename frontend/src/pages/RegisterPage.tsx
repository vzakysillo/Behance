import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { routes } from "../routes";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <main className="register-page">
      <section className="register-visual" aria-label="Featured project preview">
        <Link className="register-back" to={routes.home()} aria-label="Back to home">
          <span className="register-back-icon" aria-hidden="true" />
          <span>Back</span>
        </Link>
        <p>picture</p>
      </section>

      <section className="register-panel" aria-labelledby="register-title">
        <div className="register-intro">
          <h1 id="register-title">Create an account</h1>
          <p>
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took.
          </p>
        </div>

        <RegisterForm onSuccess={() => navigate(routes.auth.login())} />

        <div className="register-divider" aria-hidden="true">
          <span />
          <p>or continue with</p>
          <span />
        </div>

        <div className="register-socials" aria-label="Social sign up options">
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

        <p className="register-login">
          Already have an account? <Link to={routes.auth.login()}>Log IN</Link>
        </p>
      </section>
    </main>
  );
}
