"use client";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  position: "top-right" | "right";
}

const positionClasses = {
  // "top-left": "absolute top-0 left-0 translate-y-[-100%] mb-2",
  "top-right": "absolute top-[-5px] left-[10px] translate-y-[-100%] mb-2",
  right: "absolute top-[50px] left-[50px] translate-y-[-100%] mb-2",
  // "bottom-left": "absolute bottom-0 left-0 translate-y-[100%] mt-2",
  // "bottom-right": "absolute bottom-0 right-0 translate-y-[100%] mt-2",
};

export const DropdownTrigger = ({
  children,
  className,
  icon,
  position,
}: DropdownTriggerProps) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseClick = () => {
      if (show) {
        setShow(false);
      }
    };

    document.addEventListener("click", handleMouseClick);
    return () => {
      document.removeEventListener("click", handleMouseClick);
    };
  }, [show]);

  return (
    <div className={cn("relative select-none cursor-pointer", className)}>
      {icon ? (
        <div
          className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center hover:bg-indigo-400",
            className
          )}
          onClick={() => setShow((prev) => !prev)}
          ref={ref}
        >
          {icon}
        </div>
      ) : (
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center hover:bg-indigo-400",
            className
          )}
          ref={ref}
          onClick={() => setShow((prev) => !prev)}
        >
          <EllipsisVertical size="16" />
        </div>
      )}
      {show ? (
        <div
          className={cn(
            "flex flex-col w-[100px] rounded-sm overflow-hidden absolute",
            positionClasses[position]
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
}: React.ComponentProps<"button">) => {
  return (
    <Button
      className="select-none cursor-pointer rounded-none bg-background text-foreground hover:bg-muted z-100"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
