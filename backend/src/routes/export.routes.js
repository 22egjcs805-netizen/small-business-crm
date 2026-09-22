const express = require("express");
const router = express.Router();
const prisma = require("../config/database");

// Helper to escape CSV values
const toCsvCell = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

// Export Customers CSV
router.get("/customers", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { id: "asc" },
      include: { sales: true },
    });

    const headers = ["ID", "Name", "Email", "Phone", "Company", "Address", "Status", "Total Sales Amount", "Created At"];
    const rows = customers.map((c) => {
      const totalSpent = c.sales.reduce((acc, s) => acc + (s.status === "Completed" ? s.amount : 0), 0);
      return [
        c.id,
        toCsvCell(c.name),
        toCsvCell(c.email),
        toCsvCell(c.phone),
        toCsvCell(c.company),
        toCsvCell(c.address),
        toCsvCell(c.status),
        totalSpent,
        toCsvCell(new Date(c.createdAt).toISOString()),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=customers_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error("Export customers error:", error);
    res.status(500).json({ message: "Failed to export customers" });
  }
});

// Export Leads CSV
router.get("/leads", async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { id: "asc" } });

    const headers = ["ID", "Name", "Email", "Phone", "Source", "Notes", "Status", "Created At"];
    const rows = leads.map((l) => [
      l.id,
      toCsvCell(l.name),
      toCsvCell(l.email),
      toCsvCell(l.phone),
      toCsvCell(l.source),
      toCsvCell(l.notes),
      toCsvCell(l.status),
      toCsvCell(new Date(l.createdAt).toISOString()),
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=leads_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error("Export leads error:", error);
    res.status(500).json({ message: "Failed to export leads" });
  }
});

// Export Sales CSV
router.get("/sales", async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { saleDate: "desc" },
      include: { customer: { select: { name: true, company: true } } },
    });

    const headers = ["ID", "Customer Name", "Customer Company", "Product Name", "Amount", "Status", "Payment Method", "Sale Date"];
    const rows = sales.map((s) => [
      s.id,
      toCsvCell(s.customer?.name || "N/A"),
      toCsvCell(s.customer?.company || "N/A"),
      toCsvCell(s.productName),
      s.amount,
      toCsvCell(s.status),
      toCsvCell(s.paymentMethod || "Card"),
      toCsvCell(new Date(s.saleDate).toISOString()),
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=sales_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error("Export sales error:", error);
    res.status(500).json({ message: "Failed to export sales" });
  }
});

module.exports = router;
