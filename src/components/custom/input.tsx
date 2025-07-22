import { cn } from "@/lib/utils";

const Input = ({ className, placeholder }: React.ComponentProps<"input">) => {
  return (
    <input
      className={cn("border py-1 px-3 rounded-md", className)}
      placeholder={placeholder}
    />
  );
};

export default Input;
