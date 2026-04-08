"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionItem {
  merchant: string;
  amount: number;
  status: "Active" | "Expiring" | "Trial" | string;
  next_billing: string;
}

interface SubscriptionsTableProps {
  subscriptions: SubscriptionItem[];
}

function getStatusBadge(status: SubscriptionItem["status"]) {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Expiring":
      return "bg-warning/10 text-warning-foreground border-warning/20";
    case "Trial":
      return "bg-chart-1/10 text-chart-1 border-chart-1/20";
    default:
      return "";
  }
}

function getTrendIcon(status: SubscriptionItem["status"]) {
  switch (status) {
    case "Expiring":
      return <TrendingUp className="h-4 w-4 text-destructive" />;
    case "Trial":
      return <TrendingDown className="h-4 w-4 text-warning-foreground" />;
    case "Active":
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Active Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub, index) => (
                <TableRow key={`${sub.merchant}-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {sub.merchant.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">
                        {sub.merchant}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(sub.next_billing).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-foreground">
                      ₹{sub.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        getStatusBadge(sub.status)
                      )}
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getTrendIcon(sub.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
