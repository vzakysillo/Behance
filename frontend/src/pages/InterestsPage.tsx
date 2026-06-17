import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMe, updateMe } from "../api/user.api";
import { routes } from "../routes";
import "./InterestsPage.css";

const MAX_INTERESTS = 3;

const INTERESTS = [
  "Graphic Design",
  "Typography",
  "Web Design",
  "Photography",
  "Concept Art",
  "Product Design",
  "Advertising",
  "Branding & Identity",
  "Illustration",
  "App Design",
  "Fine Arts",
  "Digital Art",
  "Interior Design",
  "Icon Design",
  "Poster Design",
  "UI/UX Design",
  "Motion Graphics",
  "Game Design",
  "Architecture",
  "Fashion Design",
  "Animation",
  "3D Modeling & Rendering",
  "Packaging Design",
  "Art Direction",
  "Character Design",
  "Calligraphy & Lettering",
  "Landscape Design",
  "Exhibition Design",
  "Street Art",
  "Data Visualization",
  "Storyboarding",
  "Textile Design",
] as const;

export default function InterestsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const selectedCount = selected.length;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate(routes.auth.login(), { replace: true });
      return;
    }

    getMe()
      .then((user) => {
        if (user.skills?.length) {
          navigate(routes.profile.root(), { replace: true });
          return;
        }

        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate(routes.auth.login(), { replace: true });
      });
  }, [navigate]);

  const toggleInterest = (interest: string) => {
    setMessage("");

    setSelected((current) => {
      if (current.includes(interest)) {
        return current.filter((item) => item !== interest);
      }

      if (current.length >= MAX_INTERESTS) {
        setMessage("Select up to 3 topics.");
        return current;
      }

      return [...current, interest];
    });
  };

  const persistAndLeave = async (skills: string[]) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate(routes.auth.login());
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (skills.length > 0) {
        await updateMe({ skills });
      }

      navigate(routes.home());
    } catch (err) {
      setMessage(
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Could not save your interests. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const skip = () => {
    navigate(routes.home());
  };

  if (checking) {
    return (
      <main className="interests-page">
        <p className="interests-loading">Loading...</p>
      </main>
    );
  }

  return (
    <main className="interests-page">
      <header className="interests-header">
        <Link className="interests-brand" to={routes.home()}>
          <span className="interests-brand-mark" aria-hidden="true" />
          <span>LOGO</span>
        </Link>

        <button className="interests-skip" type="button" onClick={skip}>
          Skip
        </button>
      </header>

      <section className="interests-content" aria-labelledby="interests-title">
        <h1 id="interests-title">
          Help us to personalize your experience
          <br />
          better on our service!
        </h1>
        <p>Select up to 3 topics that interest you</p>

        <div className="interests-grid" aria-label="Available interests">
          {INTERESTS.map((interest) => {
            const isSelected = selected.includes(interest);

            return (
              <button
                className={isSelected ? "interest-chip interest-chip-selected" : "interest-chip"}
                key={interest}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            );
          })}
        </div>

        <div className="interests-footer">
          <p aria-live="polite">
            {message || (selectedCount > 0 ? `${selectedCount}/${MAX_INTERESTS} selected` : "")}
          </p>
          <button
            className="interests-continue"
            type="button"
            disabled={saving}
            onClick={() => persistAndLeave(selected)}
          >
            {saving ? "Saving..." : "Continue"}
          </button>
        </div>
      </section>
    </main>
  );
}
