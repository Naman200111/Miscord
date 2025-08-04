import { cn } from "@/lib/utils";

const Input = ({
  className,
  placeholder,
  value,
  onChange,
  disabled,
}: React.ComponentProps<"input">) => {
  return (
    <input
      onChange={onChange}
      className={cn("border py-1 px-3 rounded-md", className)}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
    />
  );
};

export default Input;
