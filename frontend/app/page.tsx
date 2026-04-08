"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { UploadModal } from "@/components/dashboard/upload-modal";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { InsightsCards } from "@/components/dashboard/insights-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { LeakagesTable } from "@/components/dashboard/leakages-table";
import { SubscriptionsTable } from "@/components/dashboard/subscriptions-table";
import { ActionPlanSection } from "@/components/dashboard/action-plan";
import {
  mockFinancialData,
  type FinancialData,
  type SubscriptionApiItem,
  type ChartData,
  type ActionPlanApiItem,
  type Leakage,
  type LeakageType,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [financialData, setFinancialData] =
    useState<FinancialData>(mockFinancialData);


  const totalSpent = financialData.total_spent || 0;
  const predictionNextMonth = Number((financialData.prediction_next_month || 0).toFixed(2));
  const leakagesCount = financialData.leakages?.length || 0;
  const leakagesAmount = financialData.leakages?.reduce((sum, l) => sum + l.amount, 0) || 0;


  const handleAnalyzeSuccess = (apiData: {
    total_spent: number;
    prediction_next_month: number;
    leakages: Array<{
      id?: string;
      date: string;
      description: string;
      amount: number;
      confidence: number;
      type: string;
      merchant?: string;
    }>;
    subscriptions?: SubscriptionApiItem[];
    chart_data?: ChartData;
    action_plan?: ActionPlanApiItem[];
  }) => {
    const normalizedLeakages: Leakage[] = apiData.leakages.map((leakage, index) => {
      const allowedTypes: LeakageType[] = [
        "Duplicate",
        "Hidden Fee",
        "Anomaly",
        "Unused Sub",
      ];
      const type = allowedTypes.includes(leakage.type as LeakageType)
        ? (leakage.type as LeakageType)
        : "Anomaly";

      return {
        id: leakage.id ?? `${leakage.description}-${index}`,
        date: leakage.date,
        description: leakage.description,
        amount: Number(leakage.amount) || 0,
        confidence: Number(leakage.confidence) || 0,
        type,
        merchant: leakage.merchant ?? "Unknown",
      };
    });

    setFinancialData({
      total_spent: Number(apiData.total_spent) || 0,
      prediction_next_month: Number(apiData.prediction_next_month) || 0,
      leakages: normalizedLeakages,
      subscriptions: (apiData.subscriptions || []).map((sub) => ({
        merchant: sub.merchant || "Unknown",
        amount: Number(sub.amount) || 0,
        status: sub.status || "Active",
        next_billing: sub.next_billing || "",
      })),
      chart_data: {
        trend: (apiData.chart_data?.trend || []).map((point) => ({
          month: point.month || "",
          expenses: Number(point.expenses) || 0,
          leakages: Number(point.leakages) || 0,
        })),
        categories: (apiData.chart_data?.categories || []).map((point) => ({
          name: point.name || "Other",
          value: Number(point.value) || 0,
        })),
      },
      action_plan: (apiData.action_plan || []).map((plan) => ({
        recommendation: plan.recommendation || "",
        priority: plan.priority || "Low",
        potential_savings: Number(plan.potential_savings) || 0,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="pl-64">
        <DashboardHeader onUploadClick={() => setUploadModalOpen(true)} />
        
        <main className="p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* KPI Cards */}
            <section>
              <KPICards
                totalSpent={totalSpent}
                predictionNextMonth={predictionNextMonth}
                leakagesCount={leakagesCount}
                leakagesAmount={leakagesAmount}
              />
            </section>

            {/* Insights */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Key Insights
              </h2>
              <InsightsCards
                totalSpent={totalSpent}
                predictionNextMonth={predictionNextMonth}
                leakagesCount={leakagesCount}
                leakagesAmount={leakagesAmount}
              />
            </section>

            {/* Charts */}
            <section>
              <DashboardCharts chartData={financialData.chart_data} />
            </section>

            {/* Detected Leakages Table */}
            <section>
              <LeakagesTable leakages={financialData.leakages} />
            </section>

            {/* Two Column: Subscriptions + Action Plan */}
            <section className="grid gap-6 lg:grid-cols-2">
              <SubscriptionsTable subscriptions={financialData.subscriptions} />
              <ActionPlanSection actionPlan={financialData.action_plan} />
            </section>
          </div>
        </main>
      </div>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onAnalyzeSuccess={handleAnalyzeSuccess}
      />
    </div>
  );
}
