import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "../api/auth.api";
import { Button, Checkbox, FormError, LabeledInput } from "./ui";

const registerSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  receiveNews: z.boolean(),
  acceptedTerms: z.literal(true, {
    message: "You must accept the Terms & Privacy Policy",
  }),
});

type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [error, setError] = useState("");

  const {
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { userName: "", email: "", password: "", receiveNews: false, acceptedTerms: false as unknown as true },
  });

  const onSubmit = async (data: RegisterValues) => {
    setError("");
    try {
      await register(data.userName, data.email, data.password);
      reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <LabeledInput
        label="Username"
        type="text"
        placeholder="@username"
        error={errors.userName?.message}
        {...registerField("userName", { onChange: () => setError("") })}
      />

      <LabeledInput
        label="Your Email"
        type="email"
        placeholder="ann@gmail.com"
        error={errors.email?.message}
        {...registerField("email", { onChange: () => setError("") })}
      />

      <LabeledInput
        label="Password"
        type="password"
        placeholder="............"
        error={errors.password?.message}
        {...registerField("password", { onChange: () => setError("") })}
      />

      <div className="grid gap-[13px] pt-1">
        <Checkbox
          variant="purple"
          label="I want to receive latest news and updates from Deshub Community"
          {...registerField("receiveNews")}
        />

        <label className="group flex items-start gap-2.5 cursor-pointer">
          <Checkbox variant="purple" {...registerField("acceptedTerms")} />
          <span className="text-base leading-[1.2] text-line transition-colors group-hover:text-ink group-has-[:checked]:text-ink">
            I agree to the <a href="/terms" className="underline">Terms &amp; Privacy Policy</a>
          </span>
        </label>
      </div>

      {error && <FormError message={error} />}

      <Button
        variant="primary"
        type="submit"
        disabled={isSubmitting}
        fullWidth
        className="mt-[17px]"
      >
        {isSubmitting ? "Creating account..." : "Get started"}
      </Button>
    </form>
  );
}
