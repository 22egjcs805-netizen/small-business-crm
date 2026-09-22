const express = require("express");
const router = express.Router();
const prisma = require("../config/database");

// Get all customers with search and status filter
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;

    const where = {};
    if (status && status !== "All") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { company: { contains: search } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        sales: {
          select: { id: true, amount: true, productName: true, saleDate: true, status: true },
        },
        followUps: {
          select: { id: true, date: true, note: true, status: true },
        },
      },
    });

    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

// Get single customer by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { sales: true, followUps: true },
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Failed to fetch customer" });
  }
});

// Create customer
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, address, status } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
        address: address ? address.trim() : null,
        status: status || "Active",
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Failed to create customer" });
  }
});

// Update customer
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, company, address, status } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
        address: address ? address.trim() : null,
        status: status || "Active",
      },
    });

    res.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Failed to update customer" });
  }
});

// Delete customer (safely handles relations)
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Unlink or clean relations
    await prisma.followUp.deleteMany({ where: { customerId: id } });
    await prisma.sale.updateMany({ where: { customerId: id }, data: { customerId: null } });

    await prisma.customer.delete({ where: { id } });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Failed to delete customer" });
  }
});

module.exports = router;
