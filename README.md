# 🏢 Apex Solutions - Small Business CRM (Full-Stack)

> A modern, full-stack Customer Relationship Management (CRM) platform designed specifically for small businesses and service agencies. Built with **React 19**, **Vite**, **Express.js**, and **Prisma ORM**, featuring automated sales pipelines, 1-click lead conversion, interactive visual analytics, customizable business settings, and CSV data export.

---

## 🚀 Key Features

- 📊 **Executive Dashboard**: Real-time KPI summary cards (Total Revenue, Active Customers, Pipeline Leads, Pending Tasks) with recent transaction feeds and urgent reminder alerts.
- 👥 **Customer Management**: Complete CRUD operations, real-time search & status filtering (Active, Inactive, Potential), company linking, and customer purchase history tracking.
- 🎯 **Lead Pipeline & 1-Click Conversion**: Multi-stage lead tracker (New, Contacted, Qualified, Converted, Lost) with single-click conversion from Lead directly into an active Customer record.
- 💰 **Relational Sales Tracking**: Sales transactions linked directly to customer accounts with payment method categorization (Card, Bank Transfer, UPI, Cash) and revenue calculation.
- 📅 **Follow-Up & Reminder Scheduler**: Interactive due-date task manager with single-click completion toggles and customer/lead badge tags.
- 📈 **Visual Reports & Analytics**: Lightweight, high-performance SVG monthly revenue trend bar charts, lead conversion funnel analytics, and customer lifetime value (LTV) rankings.
- 🧑‍💼 **Team & Employee Directory**: Role-based team directory tracking department allocation and payroll information.
- ⚙️ **Persistent Business Settings**: Customizable organization identity, localized currency symbols (`₹`, `$`, `€`, `£`), contact details, and tax rates stored in the database.
- 📥 **CSV Data Export**: One-click raw CSV streaming downloads for Customers, Leads, and Sales data suitable for Excel / BI tool ingestion.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, Modern CSS | Component-based UI with responsive layouts, inline SVG charts, and toast alerts |
| **Backend API** | Node.js, Express.js | Modular RESTful API with CORS, structured logging, and robust error handling |
| **ORM & Database** | Prisma v6, SQLite (dev) / PostgreSQL (prod) | Type-safe relational schema with foreign key constraints and automated migrations |
| **DevOps / Containers** | Docker, Docker Compose | Containerized PostgreSQL configuration for multi-environment deployments |

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               React 19 Frontend (Port 5173)                 │
│   Dashboard • Customers • Leads • Sales • Follow-ups        │
│   Reports & Analytics • Employees • Business Settings       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON REST APIs
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Express.js Backend (Port 5000)                │
│   ├── /api/customers (CRUD + Search + Filter)               │
│   ├── /api/leads (CRUD + 1-Click Conversion)                │
│   ├── /api/sales (CRUD + Customer Linking + Totals)         │
│   ├── /api/followups (CRUD + Quick Status Toggle)           │
│   ├── /api/reports (Monthly Trends + Funnel Analytics)      │
│   ├── /api/settings (Organization Settings Persistence)     │
│   └── /api/export (Streaming CSV Downloads)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma ORM Client
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                         │
│   • Local Dev: SQLite (`backend/prisma/dev.db`)             │
│   • Production: PostgreSQL (`docker-compose.yml`)           │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <your-repository-url>

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../small-business-crm/frontend
npm install
```

### 2. Database Initialization
```bash
cd backend

# Sync schema and generate Prisma client
npx prisma db push

# Seed realistic business demo data
node prisma/seed.js
```

### 3. Run the Stack

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd small-business-crm/frontend
npm run dev
# App opens on http://localhost:5173
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Aggregated executive KPIs and metrics |
| `GET` | `/api/customers` | List all customers with search & filter |
| `POST` | `/api/customers` | Create a new customer |
| `PUT` | `/api/customers/:id` | Update customer record |
| `DELETE` | `/api/customers/:id` | Remove customer and cascade references |
| `GET` | `/api/leads` | List leads pipeline |
| `POST` | `/api/leads` | Create a new lead |
| `POST` | `/api/leads/:id/convert` | Convert lead into an active customer |
| `GET` | `/api/sales` | List sales with customer relationship |
| `POST` | `/api/sales` | Record a new sale linked to customer |
| `GET` | `/api/followups` | Retrieve scheduled reminders |
| `PATCH` | `/api/followups/:id/toggle` | Toggle follow-up status (Pending/Completed) |
| `GET` | `/api/reports` | Monthly revenue trends & conversion analytics |
| `GET` | `/api/settings` | Retrieve business organization settings |
| `PUT` | `/api/settings` | Update organization settings |
| `GET` | `/api/export/:resource` | Stream CSV file for `customers`, `leads`, or `sales` |

---

## 💼 Resume & Portfolio Highlights

If you are featuring this project in your portfolio or resume, consider highlighting:
- **Full-Stack Architecture**: Designed and implemented end-to-end RESTful architecture connecting a React 19 SPA with an Express.js backend and Prisma ORM.
- **Relational Data Modeling**: Built structured relations between Customers, Sales, and Follow-ups with data integrity checks and cascade-safe deletion handling.
- **Business Workflow Automation**: Developed a single-click lead conversion pipeline that transfers prospective lead data directly into customer databases while migrating scheduled tasks.
- **High-Performance Analytics**: Created lightweight, zero-dependency SVG data visualizations (monthly revenue bar charts, conversion funnels) eliminating heavy third-party bundle bloat.
- **Data Portability**: Implemented streaming CSV export endpoints allowing direct data extraction into business spreadsheets.
