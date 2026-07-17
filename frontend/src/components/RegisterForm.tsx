import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "../api/auth.api";

const registerSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  receiveNews: z.boolean(),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms & Privacy Policy" }),
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

  const inputClass =
    "w-full h-[44px] px-[14px] py-[10px] box-border border border-[#525252] rounded-none bg-white text-[#525252] text-sm font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] outline-none placeholder:text-[#525252] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]";

  const checkboxClass =
    "w-[14px] h-[14px] mt-[1px] m-0 appearance-none border-[1.5px] border-[#525252] rounded-none bg-white cursor-pointer checked:bg-[#525252] focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]";

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <label className="grid gap-[10px] text-[#525252] text-base font-bold leading-[1.2]">
        <span>Username</span>
        <input className={inputClass} type="text" placeholder="@username"
          {...registerField("userName", { onChange: () => setError("") })} />
      </label>

      <label className="grid gap-[10px] text-[#525252] text-base font-bold leading-[1.2]">
        <span>Your Email</span>
        <input className={inputClass} type="email" placeholder="ann@gmail.com"
          {...registerField("email", { onChange: () => setError("") })} />
      </label>

      <label className="grid gap-[10px] text-[#525252] text-base font-bold leading-[1.2]">
        <span>Password</span>
        <input className={`${inputClass} text-[26px] tracking-[1px]`} type="password" placeholder="............"
          {...registerField("password", { onChange: () => setError("") })} />
      </label>

      <div className="grid gap-[13px] pt-1">
        <label className="grid grid-cols-[14px_1fr] items-start gap-4 text-[#525252] text-base font-normal leading-[1.25] max-[560px]:gap-3 max-[560px]:text-sm">
          <input className={checkboxClass} type="checkbox" {...registerField("receiveNews")} />
          <span>I want to receive latest news and updates from Deshub Community</span>
        </label>
        <label className="grid grid-cols-[14px_1fr] items-start gap-4 text-[#525252] text-base font-normal leading-[1.25] max-[560px]:gap-3 max-[560px]:text-sm">
          <input className={checkboxClass} type="checkbox" {...registerField("acceptedTerms")} />
          <span>I agree to the <a href="/terms" className="text-inherit underline">Terms &amp; Privacy Policy</a></span>
        </label>
      </div>

      {error && <p role="alert" className="text-[#b42318] text-sm leading-[1.35]">{error}</p>}

      <button
        className="w-full h-[44px] mt-4 border-0 rounded-none bg-[#a1a1aa] text-black text-base font-medium font-['Inter',system-ui,sans-serif] leading-[1.2] cursor-pointer hover:brightness-95 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px] disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Get started"}
      </button>
    </form>
  );
}
