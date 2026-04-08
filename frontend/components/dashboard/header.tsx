"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
}

export function DashboardHeader({ onUploadClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Welcome back, Akshita
        </h1>
        <p className="text-sm text-muted-foreground">
          {"Here's what's happening with your expenses"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onUploadClick} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Statement
        </Button>

        <Avatar className="h-9 w-9 border-2 border-primary/20">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" />
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
