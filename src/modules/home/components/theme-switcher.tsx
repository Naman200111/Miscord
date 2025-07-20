"use client";

import { DropdownItem, DropdownTrigger } from "@/components/custom/dropdown";
import { CircleDashed, MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const switcherIcon = !mounted ? (
    <CircleDashed className="animate-spin" />
  ) : theme === "light" && mounted ? (
    <Sun />
  ) : (
    <MoonIcon />
  );

  return (
    <DropdownTrigger
      icon={({ ref, onClick }) => (
        <div ref={ref} onClick={onClick}>
          {switcherIcon}
        </div>
      )}
    >
      <DropdownItem onClick={() => setTheme("light")}>
        <Sun /> Light
      </DropdownItem>
      <DropdownItem onClick={() => setTheme("dark")}>
        <MoonIcon />
        Dark
      </DropdownItem>
    </DropdownTrigger>
  );
};

export default ThemeSwitcher;
