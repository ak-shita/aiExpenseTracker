"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  CreditCard,
  AlertTriangle,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardsProps {
  totalSpent: number;
  predictionNextMonth: number;
  leakagesCount: number;
  leakagesAmount: number;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change: number;
  icon: React.ReactNode;
  variant?: "default" | "warning";
}

function KPICard({ title, value, subValue, change, icon, variant = "default" }: KPICardProps) {
  const isPositive = change > 0;
  const isWarning = variant === "warning";

  return (
    <Card className={cn(
      "relative overflow-hidden transition-shadow hover:shadow-md",
      isWarning && "border-destructive/30 bg-destructive/5"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={cn(
              "text-sm font-medium",
              isWarning ? "text-destructive" : "text-muted-foreground"
            )}>
              {title}
            </p>
            <p className={cn(
              "mt-2 text-2xl font-bold",
              isWarning ? "text-destructive" : "text-foreground"
            )}>
              {value}
            </p>
            {subValue && (
              <p className="mt-1 text-sm text-muted-foreground">{subValue}</p>
            )}
          </div>
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            isWarning ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1">
          {isPositive ? (
            <ArrowUpRight className={cn(
              "h-4 w-4",
              isWarning ? "text-destructive" : "text-success"
            )} />
          ) : (
            <ArrowDownRight className={cn(
              "h-4 w-4",
              isWarning ? "text-success" : "text-destructive"
            )} />
          )}
          <span className={cn(
            "text-sm font-medium",
            isWarning 
              ? (isPositive ? "text-destructive" : "text-success")
              : (isPositive ? "text-success" : "text-destructive")
          )}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICards({
  totalSpent,
  predictionNextMonth,
  leakagesCount,
  leakagesAmount,
}: KPICardsProps) {
  const predictionChange =
    totalSpent > 0 ? Number((((predictionNextMonth - totalSpent) / totalSpent) * 100).toFixed(1))
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Spent"
        value={`₹${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        change={0}
        icon={<Receipt className="h-5 w-5" />}
      />
      <KPICard
        title="Predicted Next Month"
        value={`₹${predictionNextMonth.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        change={predictionChange}
        icon={<CreditCard className="h-5 w-5" />}
      />
      <KPICard
        title="Expense Leakages"
        value={leakagesCount}
        subValue={`₹${leakagesAmount.toFixed(2)} detected`}
        change={0}
        icon={<AlertTriangle className="h-5 w-5" />}
        variant="warning"
      />
      <KPICard
        title="Savings Opportunity"
        value={`₹${leakagesAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        change={0}
        icon={<PiggyBank className="h-5 w-5" />}
      />
    </div>
  );
}
