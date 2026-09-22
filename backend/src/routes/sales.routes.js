const express = require("express");
const router = express.Router();
const prisma = require("../config/database");

// Get all sales with customer relation & optional status filter
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;

    const where = {};
    if (status && status !== "All") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { productName: { contains: search } },
        { customer: { name: { contains: search } } },
      ];
    }

    const sales = await prisma.sale.findMany({
      where,
      orderBy: { saleDate: "desc" },
      include: {
        customer: {
          select: { id: true, name: true, company: true, email: true },
        },
      },
    });

    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

// Create a sale
router.post("/", async (req, res) => {
  try {
    const { customerId, productName, amount, status, paymentMethod, saleDate } = req.body;

    if (!productName || amount === undefined || isNaN(Number(amount))) {
      return res.status(400).json({ message: "Valid product name and numeric amount are required" });
    }

    const sale = await prisma.sale.create({
      data: {
        customerId: customerId ? Number(customerId) : null,
        productName: productName.trim(),
        amount: Number(amount),
        status: status || "Completed",
        paymentMethod: paymentMethod || "Card",
        saleDate: saleDate ? new Date(saleDate) : new Date(),
      },
      include: {
        customer: {
          select: { id: true, name: true, company: true },
        },
      },
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Failed to create sale" });
  }
});

// Update a sale
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { customerId, productName, amount, status, paymentMethod, saleDate } = req.body;

    if (!productName || amount === undefined || isNaN(Number(amount))) {
      return res.status(400).json({ message: "Valid product name and numeric amount are required" });
    }

    const sale = await prisma.sale.update({
      where: { id },
      data: {
        customerId: customerId ? Number(customerId) : null,
        productName: productName.trim(),
        amount: Number(amount),
        status: status || "Completed",
        paymentMethod: paymentMethod || "Card",
        saleDate: saleDate ? new Date(saleDate) : undefined,
      },
      include: {
        customer: {
          select: { id: true, name: true, company: true },
        },
      },
    });

    res.json(sale);
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ message: "Failed to update sale" });
  }
});

// Delete a sale
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.sale.delete({ where: { id } });

    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ message: "Failed to delete sale" });
  }
});

module.exports = router;