from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression
import numpy as np
import io
from datetime import timedelta

app = FastAPI()

# Allow Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def classify_category(description: str) -> str:
    text = str(description).lower()

    keyword_map = {
        "Subscriptions": ["netflix", "spotify", "prime", "subscription", "adobe", "notion"],
        "Food & Dining": ["swiggy", "zomato", "restaurant", "cafe", "uber eats", "food"],
        "Utilities": ["electric", "water", "gas", "internet", "utility", "wifi", "bill"],
        "Shopping": ["amazon", "flipkart", "myntra", "store", "shop", "purchase"],
        "Transport": ["uber", "ola", "metro", "fuel", "petrol", "diesel", "parking"],
    }

    for category, keywords in keyword_map.items():
        if any(keyword in text for keyword in keywords):
            return category
    return "Other"


def extract_merchant(description: str) -> str:
    text = str(description).strip()
    if not text:
        return "Unknown"
    return text.split()[0].strip(" -_/,:;").title() or "Unknown"

@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    # 1. Read the uploaded CSV safely
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Standardize column names to lowercase to avoid key errors
    df.columns = df.columns.str.lower()
    
    # Ensure necessary columns exist (basic validation)
    if not set(['date', 'description', 'amount']).issubset(df.columns):
        return {"error": "CSV must contain 'date', 'description', and 'amount' columns."}

    # 2. Data Formatting
    df["date"] = pd.to_datetime(df["date"])
    df["amount"] = df["amount"].astype(float)
    
    leakages = []
    leakage_records = []

    # --- ML MODEL 1: ISOLATION FOREST FOR ANOMALIES ---
    # Detects unusual transaction amounts (hidden fees, price hikes)
    if len(df) > 1:
        model_if = IsolationForest(contamination=0.05, random_state=42)
        df['anomaly'] = model_if.fit_predict(df[['amount']])
    else:
        df['anomaly'] = 1
    
    # IsolationForest returns -1 for anomalies
    anomalies = df[df['anomaly'] == -1]
    
    for _, row in anomalies.iterrows():
        merchant = extract_merchant(row["description"])
        leakage_record = {
            "date": row["date"],
            "description": row["description"],
            "amount": float(row["amount"]),
            "confidence": 85, # Base confidence for anomaly
            "type": "Anomaly",
            "merchant": merchant,
        }
        leakage_records.append(leakage_record)
        leakages.append({
            "date": row["date"].strftime("%b %d, %Y"),
            "description": row["description"],
            "amount": float(row["amount"]),
            "confidence": 85,
            "type": "Anomaly",
            "merchant": merchant,
        })

    # --- RULE-BASED: DUPLICATE DETECTION ---
    # Keeps your duplicate logic to catch accidental double-charges
    duplicates = df[df.duplicated(subset=["amount", "description"], keep=False)]
    
    for _, row in duplicates.iterrows():
        # Prevent adding the exact same transaction twice if it was also flagged as an anomaly
        if row["description"] not in [l["description"] for l in leakages]:
            merchant = extract_merchant(row["description"])
            leakage_record = {
                "date": row["date"],
                "description": row["description"],
                "amount": float(row["amount"]),
                "confidence": 99,
                "type": "Duplicate",
                "merchant": merchant,
            }
            leakage_records.append(leakage_record)
            leakages.append({
                "date": row["date"].strftime("%b %d, %Y"),
                "description": row["description"],
                "amount": float(row["amount"]),
                "confidence": 99,
                "type": "Duplicate",
                "merchant": merchant,
            })

    # --- SUBSCRIPTION DETECTION ---
    # Detect recurring merchants by repeated descriptions and estimate next billing date.
    subscriptions = []
    recurring = df.groupby("description").agg(
        count=("description", "count"),
        amount=("amount", "mean"),
        last_seen=("date", "max"),
    ).reset_index()
    recurring = recurring[recurring["count"] >= 2]

    for _, row in recurring.iterrows():
        merchant = extract_merchant(row["description"])
        next_billing = (row["last_seen"] + timedelta(days=30)).strftime("%Y-%m-%d")
        subscriptions.append({
            "merchant": merchant,
            "amount": round(float(row["amount"]), 2),
            "status": "Active",
            "next_billing": next_billing,
        })

    # --- ML MODEL 2: LINEAR REGRESSION FOR FORECASTING ---
    # Predicts next month's total spend based on historical trend
    monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum().reset_index()
    monthly["month_index"] = np.arange(len(monthly))
    
    prediction = 0
    if len(monthly) > 1: # Requires at least 2 months of data to plot a trend line
        X = monthly[["month_index"]]
        y = monthly["amount"]
        model_lr = LinearRegression()
        model_lr.fit(X, y)
        # Predict the next index (len(monthly))
        prediction = model_lr.predict([[len(monthly)]])[0]

    # --- CHART DATA ---
    trend = []
    monthly_expenses = (
        df.groupby(df["date"].dt.to_period("M"))["amount"].sum().reset_index(name="expenses")
    )
    monthly_leakages = (
        pd.DataFrame(leakage_records).assign(month=lambda x: x["date"].dt.to_period("M"))
        .groupby("month")["amount"]
        .sum()
        .reset_index(name="leakages")
        if leakage_records
        else pd.DataFrame(columns=["month", "leakages"])
    )

    if not monthly_expenses.empty:
        monthly_expenses = monthly_expenses.rename(columns={"date": "month"})
        merged = monthly_expenses.merge(monthly_leakages, on="month", how="left")
        merged["leakages"] = merged["leakages"].fillna(0.0)
        for _, row in merged.iterrows():
            trend.append({
                "month": row["month"].strftime("%b"),
                "expenses": round(float(row["expenses"]), 2),
                "leakages": round(float(row["leakages"]), 2),
            })

    category_totals = {}
    for _, row in df.iterrows():
        category = classify_category(row["description"])
        category_totals[category] = category_totals.get(category, 0.0) + float(row["amount"])

    categories = [
        {"name": name, "value": round(value, 2)}
        for name, value in category_totals.items()
        if value > 0
    ]

    chart_data = {
        "trend": trend,
        "categories": categories if categories else [],
    }

    # --- ACTION PLAN ---
    action_plan = []
    for leakage in leakage_records:
        yearly_savings = round(float(leakage["amount"]) * 12, 2)
        merchant = leakage.get("merchant", "Unknown")
        if leakage["type"] == "Duplicate":
            recommendation = f"Cancel duplicate {merchant} charge to save ${yearly_savings}/yr"
            priority = "High"
        elif leakage["type"] == "Anomaly":
            recommendation = f"Review unusual {merchant} transaction to prevent about ${yearly_savings}/yr in recurring loss"
            priority = "Medium"
        else:
            recommendation = f"Investigate {merchant} charge pattern and reduce potential loss of ${yearly_savings}/yr"
            priority = "Low"

        action_plan.append({
            "recommendation": recommendation,
            "priority": priority,
            "potential_savings": yearly_savings,
        })

    return {
        "total_spent": float(df["amount"].sum()),
        "prediction_next_month": float(prediction) if prediction > 0 else float(df["amount"].mean()),
        "leakages": leakages,
        "subscriptions": subscriptions,
        "chart_data": chart_data,
        "action_plan": action_plan,
    }