import { cn } from "@/lib/utils";

const Input = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <input
      className={cn("border py-1 px-3 rounded-md", className)}
      {...props}
    />
  );
};

export default Input;
