"use client";

import ThemeSwitcher from "@/modules/home/components/theme-switcher";
import { SignedIn } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="h-full w-full">
      miscord welcome to clone
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ThemeSwitcher />
    </div>
  );
}
