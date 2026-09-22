const express = require("express");
const router = express.Router();
const prisma = require("../config/database");

// Get all employees
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { role: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const employees = await prisma.employee.findMany({
      where,
      orderBy: { id: "desc" },
    });

    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// Create employee
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, role, department, salary, status } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email, and role are required" });
    }

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        role: role.trim(),
        department: department || "General",
        salary: salary ? Number(salary) : null,
        status: status || "Active",
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "An employee with this email already exists" });
    }
    res.status(500).json({ message: "Failed to create employee" });
  }
});

// Update employee
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, role, department, salary, status } = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        email: email ? email.trim() : undefined,
        phone: phone ? phone.trim() : undefined,
        role: role ? role.trim() : undefined,
        department: department || undefined,
        salary: salary ? Number(salary) : null,
        status,
      },
    });

    res.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Failed to update employee" });
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.employee.delete({ where: { id } });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

module.exports = router;
