"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <CircleDashed className="animate-spin text-foreground" />
  ) : theme === "light" && mounted ? (
    <Sun size="16" className="text-[#2b2b2d]" />
  ) : (
    <MoonIcon size="16" className="text-[#eff4fa]" />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none p-2">
        {themeIcon}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon /> Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
