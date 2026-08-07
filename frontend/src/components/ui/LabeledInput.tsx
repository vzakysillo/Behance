import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

interface LabeledInputProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  children?: ReactNode;
}

export function LabeledInput({
  label,
  error,
  type = "text",
  className = "",
  onChange,
  onBlur,
  children,
  ...props
}: LabeledInputProps) {
  const { ref: registerRef, defaultValue, value: _value, ...inputProps } = props;

  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState<string>(String(defaultValue ?? _value ?? ""));
  const hasValue = value.length > 0;
  const isError = Boolean(error);
  const isFilled = hasValue && !isError && !focused;

  const labelClasses = [
    isError ? "text-brand-600" : isFilled ? "text-inkDark" : "text-ink",
    "group-hover:text-brand-600 group-focus-within:text-brand-600",
  ].join(" ");

  const boxClasses = [
    isError ? "border-brand-600" : isFilled ? "border-ink" : "border-line",
    "group-hover:border-brand-600 group-focus-within:border-brand-600",
  ].join(" ");

  const valueClasses = [
    isError ? "text-brand-600" : isFilled ? "text-inkDark" : "text-ink",
    "group-hover:text-brand-600",
  ].join(" ");

  const clear = () => {
    setValue("");
    onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
  };

  const Wrapper = children ? "div" : "label";

  return (
    <div className="flex flex-col gap-2">
      <Wrapper className={`group flex flex-col gap-2 ${className}`}>
        <span className={`text-base font-normal leading-[1.2] text-left ${labelClasses}`}>{label}</span>
        <div
          className={`flex items-center min-h-[45px] gap-2.5 px-[15px] py-2.5 rounded-[22.5px] border ${boxClasses}`}
        >
          {children ? (
            children
          ) : (
            <>
              <input
                ref={registerRef}
                type={type}
                value={value}
                className={`w-full bg-transparent text-sm font-medium leading-[1.2] outline-none placeholder:text-line ${valueClasses}`}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  setFocused(false);
                  onBlur?.(e);
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  onChange?.(e);
                }}
                {...inputProps}
              />
              {hasValue && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={clear}
                  aria-label={`Clear ${label}`}
                  className={`shrink-0 ${isError ? "text-error" : "text-ink"}`}
                >
                  <X size={16} strokeWidth={1.6} />
                </button>
              )}
            </>
          )}
        </div>
      </Wrapper>
      {error && <span className="text-xs text-error leading-[1.2]">{error}</span>}
    </div>
  );
}
