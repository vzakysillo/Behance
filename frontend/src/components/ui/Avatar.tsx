interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt = "", size = 40, className = "" }: AvatarProps) {
  return (
    <div
      className={`rounded-full bg-[#D9D9D9] overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {src && (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      )}
    </div>
  );
}
