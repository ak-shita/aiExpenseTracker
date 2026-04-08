export const kpiData = {
  totalTransactions: 1247,
  transactionsChange: 12.5,
  activeSubscriptions: {
    count: 23,
    total: 847.99,
  },
  subscriptionsChange: -2,
  expenseLeakages: {
    count: 8,
    amount: 312.47,
  },
  leakagesChange: 15,
  savingsOpportunity: 1247.33,
  savingsChange: 8.2,
};

export const insightsData = [
  {
    id: 1,
    title: "Hidden Monthly Drain",
    description: "Recurring charges from forgotten trials and unused services",
    amount: 89.97,
    icon: "eye-off",
  },
  {
    id: 2,
    title: "Biggest Leak",
    description: "Duplicate Netflix subscription detected across accounts",
    amount: 15.99,
    merchant: "Netflix",
    icon: "alert-triangle",
  },
  {
    id: 3,
    title: "Savings Potential",
    description: "Cancel 3 unused subscriptions to save monthly",
    amount: 156.47,
    icon: "piggy-bank",
  },
  {
    id: 4,
    title: "Fee Alert",
    description: "Hidden processing fees detected in 5 transactions",
    amount: 42.50,
    icon: "receipt",
  },
];

export const categoryData = [
  { name: "Subscriptions", value: 847.99, fill: "var(--color-chart-1)" },
  { name: "Utilities", value: 423.50, fill: "var(--color-chart-2)" },
  { name: "Shopping", value: 1256.78, fill: "var(--color-chart-3)" },
  { name: "Food & Dining", value: 634.22, fill: "var(--color-chart-4)" },
  { name: "Other", value: 312.47, fill: "var(--color-chart-5)" },
];

export const monthlyTrendData = [
  { month: "Jan", expenses: 2850, leakages: 120 },
  { month: "Feb", expenses: 3100, leakages: 180 },
  { month: "Mar", expenses: 2950, leakages: 95 },
  { month: "Apr", expenses: 3200, leakages: 210 },
  { month: "May", expenses: 2780, leakages: 145 },
  { month: "Jun", expenses: 3450, leakages: 312 },
];

export type LeakageType = "Duplicate" | "Hidden Fee" | "Anomaly" | "Unused Sub";

export interface Leakage {
  id: string;
  date: string;
  description: string;
  amount: number;
  confidence: number;
  type: LeakageType;
  merchant: string;
}

export interface FinancialData {
  total_spent: number;
  prediction_next_month: number;
  leakages: Leakage[];
  subscriptions: SubscriptionApiItem[];
  chart_data: ChartData;
  action_plan: ActionPlanApiItem[];
}

export const detectedLeakages: Leakage[] = [
  {
    id: "1",
    date: "2026-04-05",
    description: "Duplicate streaming subscription charge",
    amount: 15.99,
    confidence: 95,
    type: "Duplicate",
    merchant: "Netflix",
  },
  {
    id: "2",
    date: "2026-04-03",
    description: "Hidden processing fee on international transfer",
    amount: 12.50,
    confidence: 88,
    type: "Hidden Fee",
    merchant: "Wise",
  },
  {
    id: "3",
    date: "2026-04-01",
    description: "Unusual charge amount variation",
    amount: 47.23,
    confidence: 72,
    type: "Anomaly",
    merchant: "Amazon",
  },
  {
    id: "4",
    date: "2026-03-28",
    description: "Subscription for cancelled service",
    amount: 9.99,
    confidence: 91,
    type: "Unused Sub",
    merchant: "Spotify",
  },
  {
    id: "5",
    date: "2026-03-25",
    description: "Double charge for same purchase",
    amount: 89.99,
    confidence: 98,
    type: "Duplicate",
    merchant: "Best Buy",
  },
  {
    id: "6",
    date: "2026-03-22",
    description: "Undisclosed currency conversion fee",
    amount: 8.75,
    confidence: 85,
    type: "Hidden Fee",
    merchant: "PayPal",
  },
];

export const mockFinancialData: FinancialData = {
  total_spent: 18330.0,
  prediction_next_month: 3210.45,
  leakages: detectedLeakages,
  subscriptions: [
    { merchant: "Netflix", amount: 15.99, status: "Active", next_billing: "2026-04-15" },
    { merchant: "Spotify", amount: 9.99, status: "Active", next_billing: "2026-04-18" },
  ],
  chart_data: {
    trend: monthlyTrendData,
    categories: categoryData.map((item) => ({ name: item.name, value: item.value })),
  },
  action_plan: [
    {
      recommendation: "Cancel duplicate Netflix charge to save ₹191.88/yr",
      priority: "High",
      potential_savings: 191.88,
    },
  ],
};

export interface SubscriptionApiItem {
  merchant: string;
  amount: number;
  status: "Active" | "Expiring" | "Trial" | string;
  next_billing: string;
}

export interface ChartTrendPoint {
  month: string;
  expenses: number;
  leakages: number;
}

export interface CategoryPoint {
  name: string;
  value: number;
}

export interface ChartData {
  trend: ChartTrendPoint[];
  categories: CategoryPoint[];
}

export interface ActionPlanApiItem {
  recommendation: string;
  priority: "High" | "Medium" | "Low" | string;
  potential_savings: number;
}

export interface Subscription {
  id: string;
  merchant: string;
  nextBilling: string;
  amount: number;
  status: "Active" | "Expiring" | "Trial";
  trend: "up" | "down" | "stable";
  logo: string;
}

export const activeSubscriptions: Subscription[] = [
  {
    id: "1",
    merchant: "Netflix",
    nextBilling: "2026-04-15",
    amount: 15.99,
    status: "Active",
    trend: "stable",
    logo: "N",
  },
  {
    id: "2",
    merchant: "Spotify",
    nextBilling: "2026-04-18",
    amount: 9.99,
    status: "Active",
    trend: "stable",
    logo: "S",
  },
  {
    id: "3",
    merchant: "Adobe CC",
    nextBilling: "2026-04-22",
    amount: 54.99,
    status: "Active",
    trend: "up",
    logo: "A",
  },
  {
    id: "4",
    merchant: "Notion",
    nextBilling: "2026-04-10",
    amount: 10.00,
    status: "Trial",
    trend: "stable",
    logo: "N",
  },
  {
    id: "5",
    merchant: "AWS",
    nextBilling: "2026-04-30",
    amount: 127.45,
    status: "Active",
    trend: "up",
    logo: "A",
  },
  {
    id: "6",
    merchant: "Figma",
    nextBilling: "2026-04-12",
    amount: 15.00,
    status: "Expiring",
    trend: "down",
    logo: "F",
  },
];

export interface ActionPlan {
  id: string;
  recommendation: string;
  priority: "High" | "Medium" | "Low";
  potentialSavings: number;
  category: string;
}

export const actionPlans: ActionPlan[] = [
  {
    id: "1",
    recommendation: "Cancel duplicate Netflix subscription",
    priority: "High",
    potentialSavings: 191.88,
    category: "Subscriptions",
  },
  {
    id: "2",
    recommendation: "Negotiate lower rate with AWS",
    priority: "Medium",
    potentialSavings: 300.00,
    category: "Cloud Services",
  },
  {
    id: "3",
    recommendation: "Switch to annual billing for Spotify",
    priority: "Low",
    potentialSavings: 24.00,
    category: "Subscriptions",
  },
  {
    id: "4",
    recommendation: "Cancel unused Notion trial before billing",
    priority: "High",
    potentialSavings: 120.00,
    category: "Productivity",
  },
  {
    id: "5",
    recommendation: "Use local bank for international transfers",
    priority: "Medium",
    potentialSavings: 150.00,
    category: "Banking",
  },
];
