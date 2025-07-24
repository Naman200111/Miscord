import { getInitials } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Image from "next/image";

interface SidebarButtonProps {
  icon?: React.ReactNode;
  name?: string;
  imageUrl?: string | null;
  onClick?: () => void;
  className?: string;
}

const buttonVariants = cva(
  "rounded-xl bg-background p-2 duration-200 cursor-pointer flex justify-center items-center",
  {
    variants: {
      variant: {
        icon: "hover:bg-indigo-400 active:bg-indigo-400 mx-auto",
        image: "relative object-cover min-h-[40px] overflow-hidden rounded-md",
        text: "hover:bg-indigo-400 active:bg-indigo-400 text-center",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
);

const SidebarButton = ({
  icon,
  imageUrl,
  name,
  onClick,
  className,
}: SidebarButtonProps) => {
  return (
    <>
      {icon && (
        <div
          className={buttonVariants({ className, variant: "icon" })}
          onClick={onClick}
        >
          {icon}
        </div>
      )}
      {imageUrl && (
        <div
          className={buttonVariants({ className, variant: "image" })}
          onClick={onClick}
        >
          <Image fill src={imageUrl} alt="Logo" />
        </div>
      )}
      {name && !imageUrl && (
        <div
          className={buttonVariants({ className, variant: "text" })}
          onClick={onClick}
        >
          {getInitials(name)}
        </div>
      )}
    </>
  );
};

export default SidebarButton;
