import { DropdownItem, DropdownTrigger } from "@/components/custom/dropdown";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownTrigger ellipsisClassName="hover:bg-muted rounded-full">
      <DropdownItem onClick={() => setTheme("light")}>Light</DropdownItem>
      <DropdownItem onClick={() => setTheme("dark")}>Dark</DropdownItem>
    </DropdownTrigger>
  );
};

export default ThemeSwitcher;
