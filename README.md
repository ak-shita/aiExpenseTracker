# AI Expense Auditor

A full-stack financial auditing application that leverages Machine Learning to detect hidden fees, duplicate charges, and unusual spending anomalies in bank statements. 

This tool shifts the paradigm from standard expense tracking to proactive financial auditing by using an algorithmic backend to flag leakages and forecast future burn rates.

## 🚀 Key Features

* **Anomaly Detection:** Utilizes an `Isolation Forest` model to hunt down unusual transaction amounts (hidden fees, sudden price hikes) with calculated confidence scores.
* **Predictive Forecasting:** Implements `Linear Regression` to analyze historical monthly spending trends and predict the next month's total expenses.
* **Rule-Based Auditing:** Automatically scans for duplicate charges and flags unused or redundant subscriptions.
* **Action Plan Generation:** Generates dynamic, AI-driven recommendations detailing exact potential savings per year (e.g., "Cancel duplicate Spotify charge to save ₹119/yr").
* **Interactive Dashboard:** A responsive Next.js frontend featuring dynamic Recharts and KPI tracking.

## 🛠️ Tech Stack

**Frontend**
* Next.js (React)
* Tailwind CSS
* shadcn/ui
* Recharts (Data Visualization)

**Backend**
* FastAPI (Python)
* scikit-learn (Machine Learning)
* Pandas & NumPy (Data Processing)

## 💻 Running Locally

### 1. Start the Python Backend
Navigate to the backend directory, install dependencies, and start the FastAPI server:
```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install fastapi uvicorn pandas scikit-learn python-multipart
uvicorn main:app --reload
