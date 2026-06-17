import { useState } from "react";
import type { FormEvent } from "react";
import { register } from "../api/auth.api";

const getErrorMessage = (err: unknown, fallback: string) =>
  typeof err === "string" ? err : err instanceof Error ? err.message : fallback;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [receiveNews, setReceiveNews] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await register(userName, email, password);
      setUserName("");
      setEmail("");
      setPassword("");
      setReceiveNews(false);
      setAcceptedTerms(false);
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed. Please try again."));
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <label className="register-field">
        <span>Username</span>
        <input
          type="text"
          placeholder="@username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            setError("");
          }}
          required
        />
      </label>

      <label className="register-field">
        <span>Your Email</span>
        <input
          type="email"
          placeholder="ann@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />
      </label>

      <label className="register-field">
        <span>Password</span>
        <input
          type="password"
          placeholder="............"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
        />
      </label>

      <div className="register-options">
        <label>
          <input
            type="checkbox"
            checked={receiveNews}
            onChange={(e) => setReceiveNews(e.target.checked)}
          />
          <span>I want to receive latest news and updates from Deshub Community</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            required
          />
          <span>
            I agree to the <a href="/terms">Terms &amp; Privacy Policy</a>
          </span>
        </label>
      </div>

      {error && <p className="register-error">{error}</p>}

      <button className="register-submit" type="submit">
        Get started
      </button>
    </form>
  );
}
