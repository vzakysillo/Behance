import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import { Button, Checkbox, FormError, FormField, TextInput } from "./ui";

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

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginValues>({
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
      <FormField label="Email">
        <TextInput
          variant="auth-dark"
          type="text"
          placeholder="user@mail.com"
          {...register("email", { onChange: () => setError("") })}
        />
      </FormField>

      <FormField label="Password">
        <TextInput
          variant="auth-dark"
          className="text-[26px] tracking-[1px]"
          type="password"
          placeholder="............"
          {...register("password", { onChange: () => setError("") })}
        />
      </FormField>

      <div className="flex items-center justify-between gap-[18px] -mt-2 text-[#575656] text-base font-normal leading-[1.25] max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-[14px] max-[560px]:text-sm">
        <label className="inline-grid grid-cols-[15px_1fr] items-center gap-[15px]">
          <Checkbox variant="dark" {...register("rememberMe")} />
          <span>Remember me</span>
        </label>
        <a href="/forgot-password" className="text-inherit no-underline whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]">
          Forget password?
        </a>
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
