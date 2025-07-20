"use client";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
  icon?: (props: {
    onClick: () => void;
    ref: React.RefObject<null>;
  }) => React.ReactNode;
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
      <div className="w-6 h-6 rounded-full flex items-center justify-center">
        {icon ? (
          icon({
            onClick: () => setShow((prev) => !prev),
            ref,
          })
        ) : (
          <EllipsisVertical
            size="16"
            ref={ref}
            onClick={() => setShow((prev) => !prev)}
          />
        )}
      </div>
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
