import { Link } from "react-router-dom";
import { routes } from "../routes";
import "./WelcomePage.css";

export default function WelcomePage() {
  return (
    <main className="welcome-page">
      <header className="welcome-header" aria-label="Site header">
        <Link to={routes.welcome()} className="welcome-brand" aria-label="Home">
          <span className="welcome-brand-mark" aria-hidden="true" />
          <span>LOGO</span>
        </Link>
      </header>

      <section className="welcome-content" aria-labelledby="welcome-title">
        <h1 id="welcome-title">Welcome to our service</h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
          <br />
          <br />
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book.
          <br />
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged.
        </p>

        <div className="welcome-actions">
          <Link className="welcome-button welcome-button-primary" to={routes.auth.login()}>
            Log in
          </Link>
          <span className="welcome-separator">or</span>
          <Link className="welcome-button welcome-button-secondary" to={routes.auth.register()}>
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
