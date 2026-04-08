"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendPoint {
  month: string;
  expenses: number;
  leakages: number;
}

interface CategoryPoint {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  chartData: {
    trend: TrendPoint[];
    categories: CategoryPoint[];
  };
}

const COLORS = [
  "hsl(280, 60%, 55%)",
  "hsl(160, 50%, 50%)",
  "hsl(50, 80%, 55%)",
  "hsl(25, 75%, 55%)",
  "hsl(220, 55%, 50%)",
];

export function DashboardCharts({ chartData }: DashboardChartsProps) {
  const categories = chartData?.categories || [];
  const trend = chartData?.trend || [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Category Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Expense Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {categories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Monthly Expense Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `₹${value}`,
                    name === "expenses" ? "Expenses" : "Leakages",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground capitalize">
                      {value}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(280, 60%, 55%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(280, 60%, 55%)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="leakages"
                  stroke="hsl(25, 75%, 55%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(25, 75%, 55%)", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
