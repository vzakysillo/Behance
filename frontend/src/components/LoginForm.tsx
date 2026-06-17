import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../api/auth.api";

const getErrorMessage = (err: unknown, fallback: string) =>
  typeof err === "string" ? err : err instanceof Error ? err.message : fallback;

interface LoginFormProps {
  onSuccess?: () => void | Promise<void>;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      await onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err, "Login failed. Please try again."));
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label className="login-field">
        <span>Email</span>
        <input
          type="text"
          placeholder="user@mail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />
      </label>

      <label className="login-field">
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

      <div className="login-options">
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </label>

        <a href="/forgot-password">Forget password?</a>
      </div>

      {error && <p className="login-error">{error}</p>}

      <button className="login-submit" type="submit">
        Log In
      </button>
    </form>
  );
}
