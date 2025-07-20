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

  const themeIcon = !mounted ? (
    <CircleDashed className="animate-spin" />
  ) : theme === "light" && mounted ? (
    <Sun size="16" />
  ) : (
    <MoonIcon size="16" />
  );

  return (
    <DropdownTrigger icon={themeIcon}>
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
