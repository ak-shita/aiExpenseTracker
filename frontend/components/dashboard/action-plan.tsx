"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionPlanItem {
  recommendation: string;
  priority: "High" | "Medium" | "Low" | string;
  potential_savings: number;
}

interface ActionPlanSectionProps {
  actionPlan: ActionPlanItem[];
}

function getPriorityBadge(priority: ActionPlanItem["priority"]) {
  switch (priority) {
    case "High":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Medium":
      return "bg-warning/10 text-warning-foreground border-warning/20";
    case "Low":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "";
  }
}

export function ActionPlanSection({ actionPlan }: ActionPlanSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">
            AI Action Plan
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {actionPlan.map((plan, index) => (
            <li
              key={`${plan.recommendation}-${index}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/50"
            >
              <div className="flex items-start gap-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-0.5 text-xs font-medium",
                    getPriorityBadge(plan.priority)
                  )}
                >
                  {plan.priority}
                </Badge>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {plan.recommendation.replace(/\$/g, "₹")}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-success">
                    Save ₹{plan.potential_savings}
                    {plan.recommendation.toLowerCase().includes("duplicate") || plan.recommendation.toLowerCase().includes("unusual") ? "" : "/yr"}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-lg bg-primary/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Following all recommendations could save you
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">
            ₹{actionPlan.reduce((sum, p) => sum + p.potential_savings, 0).toFixed(0)}
            <span className="text-base font-normal text-muted-foreground">
              {" "}

            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
