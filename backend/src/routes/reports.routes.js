const express = require("express");
const router = express.Router();
const prisma = require("../config/database");

// Get comprehensive analytics & report data
router.get("/", async (req, res) => {
  try {
    const [
      totalCustomers,
      totalLeads,
      totalSales,
      completedSales,
      allSales,
      allLeads,
      settings,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.lead.count(),
      prisma.sale.count(),
      prisma.sale.findMany({
        where: { status: "Completed" },
        include: { customer: { select: { name: true, company: true } } },
      }),
      prisma.sale.findMany({
        orderBy: { saleDate: "asc" },
      }),
      prisma.lead.findMany(),
      prisma.settings.findFirst(),
    ]);

    // 1. Total & Average Revenue
    const totalRevenue = completedSales.reduce((acc, s) => acc + Number(s.amount || 0), 0);
    const avgDealSize = completedSales.length > 0 ? Math.round(totalRevenue / completedSales.length) : 0;

    // 2. Monthly Revenue Trend (Last 6 Months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};

    // Initialize past 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[key] = { month: key, revenue: 0, count: 0 };
    }

    allSales.forEach((sale) => {
      const d = new Date(sale.saleDate);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyMap[key] && sale.status === "Completed") {
        monthlyMap[key].revenue += Number(sale.amount || 0);
        monthlyMap[key].count += 1;
      }
    });

    const monthlyRevenue = Object.values(monthlyMap);

    // 3. Lead Funnel Breakdown
    const leadStatusCounts = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
    };
    allLeads.forEach((l) => {
      if (leadStatusCounts[l.status] !== undefined) {
        leadStatusCounts[l.status]++;
      }
    });

    const conversionRate = totalLeads > 0 ? ((leadStatusCounts.Converted / totalLeads) * 100).toFixed(1) : 0;

    // 4. Sales by Payment Method
    const paymentMethods = {};
    allSales.forEach((s) => {
      const pm = s.paymentMethod || "Card";
      paymentMethods[pm] = (paymentMethods[pm] || 0) + Number(s.amount || 0);
    });

    // 5. Top 5 Customers by Revenue
    const customerRevenueMap = {};
    completedSales.forEach((s) => {
      if (s.customer) {
        const cName = s.customer.name;
        customerRevenueMap[cName] = (customerRevenueMap[cName] || 0) + Number(s.amount || 0);
      }
    });

    const topCustomers = Object.entries(customerRevenueMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      currency: settings?.currency || "₹",
      kpis: {
        totalRevenue,
        avgDealSize,
        totalCustomers,
        totalLeads,
        totalSales,
        conversionRate: `${conversionRate}%`,
      },
      monthlyRevenue,
      leadStatusCounts,
      paymentMethods,
      topCustomers,
    });
  } catch (error) {
    console.error("Error generating reports:", error);
    res.status(500).json({ message: "Failed to generate report analytics" });
  }
});

module.exports = router;
