import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import { Button, Checkbox, FormError, LabeledInput, TextLink } from "./ui";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void | Promise<void>;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login: setAuth } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginValues) => {
    setError("");
    try {
      const token = await login(data.email, data.password);
      await setAuth(token);
      await onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <LabeledInput
        label="Email"
        type="text"
        placeholder="user@mail.com"
        error={errors.email?.message}
        {...register("email", { onChange: () => setError("") })}
      />

      <LabeledInput
        label="Password"
        type="password"
        placeholder="............"
        error={errors.password?.message}
        {...register("password", { onChange: () => setError("") })}
      />

      <div className="flex items-center justify-between gap-[18px] -mt-2 max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-[14px]">
        <Checkbox variant="purple" label="Remember me" {...register("rememberMe")} />
        <TextLink href="/forgot-password" className="whitespace-nowrap max-[560px]:text-sm">
          Forget password?
        </TextLink>
      </div>

      {error && <FormError message={error} />}

      <Button
        variant="primary"
        type="submit"
        disabled={isSubmitting}
        fullWidth
        className="mt-[17px]"
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}

