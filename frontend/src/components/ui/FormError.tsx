interface FormErrorProps {
  message: string;
  className?: string;
}

export function FormError({ message, className = "" }: FormErrorProps) {
  return (
    <p
      role="alert"
      className={`text-[#b42318] text-sm leading-[1.35] ${className}`}
    >
      {message}
    </p>
  );
}
