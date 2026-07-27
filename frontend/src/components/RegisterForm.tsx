import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "../api/auth.api";
import { Button, Checkbox, FormError, FormField, TextInput } from "./ui";

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

  const { register: registerField, handleSubmit, reset, formState: { isSubmitting } } = useForm<RegisterValues>({
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
      <FormField label="Username">
        <TextInput
          variant="auth"
          type="text"
          placeholder="@username"
          {...registerField("userName", { onChange: () => setError("") })}
        />
      </FormField>

      <FormField label="Your Email">
        <TextInput
          variant="auth"
          type="email"
          placeholder="ann@gmail.com"
          {...registerField("email", { onChange: () => setError("") })}
        />
      </FormField>

      <FormField label="Password">
        <TextInput
          variant="auth"
          className="text-[26px] tracking-[1px]"
          type="password"
          placeholder="............"
          {...registerField("password", { onChange: () => setError("") })}
        />
      </FormField>

      <div className="grid gap-[13px] pt-1">
        <label className="grid grid-cols-[14px_1fr] items-start gap-4 text-[#525252] text-base font-normal leading-[1.25] max-[560px]:gap-3 max-[560px]:text-sm">
          <Checkbox variant="dark" {...registerField("receiveNews")} />
          <span>I want to receive latest news and updates from Deshub Community</span>
        </label>
        <label className="grid grid-cols-[14px_1fr] items-start gap-4 text-[#525252] text-base font-normal leading-[1.25] max-[560px]:gap-3 max-[560px]:text-sm">
          <Checkbox variant="dark" {...registerField("acceptedTerms")} />
          <span>I agree to the <a href="/terms" className="text-inherit underline">Terms &amp; Privacy Policy</a></span>
        </label>
      </div>

      {error && <FormError message={error} />}

      <Button
        variant="primary"
        type="submit"
        disabled={isSubmitting}
        fullWidth
        className="mt-4 bg-[#a1a1aa]"
      >
        {isSubmitting ? "Creating account..." : "Get started"}
      </Button>
    </form>
  );
}
