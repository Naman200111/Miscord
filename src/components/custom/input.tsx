import { cn } from "@/lib/utils";

const Input = ({
  className,
  placeholder,
  value,
  onChange,
}: React.ComponentProps<"input">) => {
  return (
    <input
      onChange={onChange}
      className={cn("border py-1 px-3 rounded-md", className)}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default Input;
