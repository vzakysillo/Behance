export function ErrorMessage({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-center items-center min-h-[200px] text-[#d32f2f] text-base font-sans ${className}`}
    >
      {message}
    </div>
  );
}
