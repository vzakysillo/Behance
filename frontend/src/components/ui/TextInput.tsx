import { Search } from "lucide-react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "auth-dark" | "auth" | "edit" | "project";
}

const variantClasses: Record<string, string> = {
  "auth-dark":
    "w-full h-[45px] px-[15px] py-[10px] box-border border border-[#575656] rounded-none bg-white text-[#575656] text-sm font-medium font-sans leading-[1.2] outline-none placeholder:text-[#575656] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
  auth: "w-full h-[44px] px-[14px] py-[10px] box-border border border-[#525252] rounded-none bg-white text-[#525252] text-sm font-medium font-sans leading-[1.2] outline-none placeholder:text-[#525252] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-[#525252] focus-visible:outline-offset-[3px]",
  edit: "h-10 px-2.5 border border-[#676767] text-sm text-black font-sans bg-white w-full outline-none focus:border-black placeholder:text-[#676767]",
  project:
    "w-full h-11 px-2.5 border border-[#a2a0a0] text-sm font-normal font-sans leading-5 text-black bg-white outline-none placeholder:text-[#676767] focus:border-black",
};

export function TextInput({ variant = "edit", className = "", ...props }: TextInputProps) {
  const base = variantClasses[variant] || variantClasses.edit;
  return (
    <input
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "edit" | "project";
}

const textareaVariantClasses: Record<string, string> = {
  edit: "h-10 px-2.5 border border-[#676767] text-sm text-black font-sans bg-white w-full outline-none focus:border-black placeholder:text-[#676767]",
  project:
    "w-full h-11 px-2.5 border border-[#a2a0a0] text-sm font-normal font-sans leading-5 text-black bg-white outline-none placeholder:text-[#676767] focus:border-black",
};

export function TextArea({ variant = "edit", className = "", ...props }: TextAreaProps) {
  const base = textareaVariantClasses[variant] || textareaVariantClasses.edit;
  return (
    <textarea
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder, className = "" }: SearchInputProps) {
  return (
    <div
      className={`flex items-center gap-2 px-5 py-2.5 border border-[#d9d9d9] mx-5 mb-2 ${className}`}
    >
      <Search size={14} className="text-[#5B5B5B] shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-black outline-none placeholder:text-[#aeaeae] border-none"
      />
    </div>
  );
}
