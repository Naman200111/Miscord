"use client";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const DropdownTrigger = ({
  children,
  className,
  icon,
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
    <div className={cn("select-none cursor-pointer", className)}>
      {icon ? (
        <div
          className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center hover:bg-accent",
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
            "w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent",
            className
          )}
          ref={ref}
          onClick={() => setShow((prev) => !prev)}
        >
          <EllipsisVertical size="16" />
        </div>
      )}
      {show ? (
        <div className="flex flex-col w-[100px] rounded-sm overflow-hidden">
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
      className="select-none cursor-pointer rounded-none"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
