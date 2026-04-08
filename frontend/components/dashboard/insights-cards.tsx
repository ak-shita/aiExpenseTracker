"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EyeOff, AlertTriangle, PiggyBank, Receipt } from "lucide-react";

interface InsightItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  icon: keyof typeof iconMap;
}

interface InsightsCardsProps {
  totalSpent: number;
  predictionNextMonth: number;
  leakagesCount: number;
  leakagesAmount: number;
}

const iconMap = {
  "eye-off": EyeOff,
  "alert-triangle": AlertTriangle,
  "piggy-bank": PiggyBank,
  receipt: Receipt,
};

export function InsightsCards({
  totalSpent,
  predictionNextMonth,
  leakagesCount,
  leakagesAmount,
}: InsightsCardsProps) {
  const insightsData: InsightItem[] = [
    {
      id: "current-month",
      title: "Current Spend",
      description: "Aggregate outflow analyzed from uploaded statement",
      amount: totalSpent,
      icon: "receipt",
    },
    {
      id: "next-month",
      title: "Forecast",
      description: "Projected next-month outflow based on historical trend",
      amount: predictionNextMonth,
      icon: "piggy-bank",
    },
    {
      id: "leakages",
      title: "Leakages Found",
      description: `${leakagesCount} transactions flagged for potential leakage risk`,
      amount: leakagesAmount,
      icon: "alert-triangle",
    },
    {
      id: "savings",
      title: "Potential Savings",
      description: "Estimated recoverable monthly value from identified leakages",
      amount: leakagesAmount,
      icon: "eye-off",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {insightsData.map((insight) => {
        const Icon = iconMap[insight.icon as keyof typeof iconMap] || Receipt;
        return (
          <Card
            key={insight.id}
            className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning-foreground transition-colors group-hover:bg-warning/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {insight.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {insight.description}
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    ₹{insight.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
