const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const prisma = require("./config/database");

// Route imports
const customerRoutes = require("./routes/customers.routes");
const leadRoutes = require("./routes/leads.routes");
const saleRoutes = require("./routes/sales.routes");
const followupRoutes = require("./routes/followups");
const employeeRoutes = require("./routes/employees.routes");
const settingsRoutes = require("./routes/settings.routes");
const reportsRoutes = require("./routes/reports.routes");
const exportRoutes = require("./routes/export.routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Request logger for clean terminal output
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/*
|--------------------------------------------------------------------------
| Health & Base Check
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Small Business CRM API is running successfully!",
    timestamp: new Date().toISOString(),
    documentation: "/api/dashboard",
  });
});

/*
|--------------------------------------------------------------------------
| Unified Dashboard KPI API
|--------------------------------------------------------------------------
*/
app.get("/api/dashboard", async (req, res) => {
  try {
    const [
      totalCustomers,
      totalLeads,
      totalEmployees,
      totalSales,
      completedSalesSum,
      pendingFollowUps,
      settings,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.lead.count(),
      prisma.employee.count(),
      prisma.sale.count(),
      prisma.sale.aggregate({
        where: { status: "Completed" },
        _sum: { amount: true },
      }),
      prisma.followUp.count({ where: { status: "Pending" } }),
      prisma.settings.findFirst(),
    ]);

    res.json({
      totalCustomers,
      totalLeads,
      totalEmployees,
      totalSales,
      totalSalesAmount: completedSalesSum._sum.amount || 0,
      pendingFollowUps,
      currency: settings?.currency || "₹",
      businessName: settings?.businessName || "Small Business CRM",
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard statistics" });
  }
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/followups", followupRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/export", exportRoutes);

/*
|--------------------------------------------------------------------------
| 404 & Global Error Handling
|--------------------------------------------------------------------------
*/
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🚀 CRM Backend Server listening on http://localhost:${PORT}`);
  console.log(`  📊 Database connected (SQLite at dev.db)`);
  console.log(`====================================================`);
});