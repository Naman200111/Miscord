import { getInitials } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Image from "next/image";

interface SidebarButtonProps {
  icon?: React.ReactNode;
  name?: string;
  imageUrl?: string | null;
  onClick?: () => void;
}

const buttonVariants = cva(
  "rounded-xl bg-background p-2 duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        icon: "hover:bg-indigo-400 active:bg-indigo-400",
        image:
          "relative object-cover h-[40px] w-full overflow-hidden rounded-md",
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
}: SidebarButtonProps) => {
  return (
    <>
      {icon && (
        <div className={buttonVariants({ variant: "icon" })} onClick={onClick}>
          {icon}
        </div>
      )}
      {imageUrl && (
        <div className={buttonVariants({ variant: "image" })} onClick={onClick}>
          <Image fill src={imageUrl} alt="Logo" />
        </div>
      )}
      {name && (
        <div className={buttonVariants({ variant: "text" })} onClick={onClick}>
          {getInitials(name)}
        </div>
      )}
    </>
  );
};

export default SidebarButton;
