"use client";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DropdownTriggerProps {
  children: React.ReactNode;
  ellipsisClassName?: string;
  className?: string;
}

export const DropdownTrigger = ({
  children,
  ellipsisClassName,
  className,
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
      <EllipsisVertical
        className={cn(ellipsisClassName, "")}
        size="16"
        ref={ref}
        onClick={() => setShow((prev) => !prev)}
      />
      {show ? <div className="flex flex-col">{children}</div> : null}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
}: React.ComponentProps<"button">) => {
  return (
    <Button className="select-none cursor-pointer" onClick={onClick}>
      {children}
    </Button>
  );
};
