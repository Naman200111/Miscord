import { getInitials } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Image from "next/image";

interface SidebarButtonProps {
  icon?: React.ReactNode;
  name?: string;
  imageUrl?: string;
}

const buttonVariants = cva(
  "rounded-xl bg-background p-3 mt-4 duration-200 cursor-pointer",
  {
    variants: {
      vairant: {
        icon: "hover:bg-indigo-400 active:bg-indigo-400",
        image: "relative",
        text: "hover:bg-indigo-400 active:bg-indigo-400",
      },
    },
    defaultVariants: {
      vairant: "icon",
    },
  }
);

const SidebarButton = ({ icon, imageUrl, name }: SidebarButtonProps) => {
  return (
    <>
      {icon && (
        <div className={buttonVariants({ vairant: "icon" })}>{icon}</div>
      )}
      {imageUrl && (
        <div className={buttonVariants({ vairant: "image" })}>
          <Image fill src={imageUrl} alt="Logo" />
        </div>
      )}
      {name && (
        <div className={buttonVariants({ vairant: "text" })}>
          {getInitials(name)}
        </div>
      )}
    </>
  );
};

export default SidebarButton;
