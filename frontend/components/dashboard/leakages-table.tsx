"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type Leakage, type LeakageType } from "@/lib/mock-data";

function getTypeBadgeVariant(type: LeakageType) {
  switch (type) {
    case "Duplicate":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Hidden Fee":
      return "bg-warning/10 text-warning-foreground border-warning/20";
    case "Anomaly":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Unused Sub":
      return "bg-chart-5/10 text-chart-5 border-chart-5/20";
    default:
      return "";
  }
}

interface LeakagesTableProps {
  leakages: Leakage[];
}

export function LeakagesTable({ leakages }: LeakagesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Detected Leakages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[120px]">Confidence</TableHead>
                <TableHead className="w-[110px]">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leakages.map((leakage) => (
                <TableRow
                  key={leakage.id}
                  className={cn(
                    leakage.type === "Duplicate" && "bg-destructive/5",
                    leakage.type === "Hidden Fee" && "bg-warning/5",
                    leakage.type === "Anomaly" && "bg-yellow-50"
                  )}
                >
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(leakage.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {leakage.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {leakage.merchant || "Unknown merchant"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-semibold text-destructive">
                      ₹{leakage.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={leakage.confidence}
                        className="h-2 w-16"
                      />
                      <span className="text-xs text-muted-foreground">
                        {leakage.confidence}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        getTypeBadgeVariant(leakage.type)
                      )}
                    >
                      {leakage.type}
                    </Badge>
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
