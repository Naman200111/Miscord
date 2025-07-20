"use client";

import { SignedIn } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      miscord welcome to clone
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
