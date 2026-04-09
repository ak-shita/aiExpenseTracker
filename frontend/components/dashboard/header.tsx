"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

interface HeaderProps {
  onUploadClick: () => void;
}

export function DashboardHeader({ onUploadClick }: HeaderProps) {
  // Pull the logged-in user's data from Clerk
  const { user } = useUser();
  const firstName = user?.firstName || "User";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's what's happening with your expenses
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onUploadClick} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Statement
        </Button>

        {/* This replaces the fake Unsplash Avatar and gives you the real photo + logout menu */}
        <UserButton  />
      </div>
    </header>
  );
}