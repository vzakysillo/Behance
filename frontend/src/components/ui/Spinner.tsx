export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center min-h-[200px] ${className}`}>
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );
}
