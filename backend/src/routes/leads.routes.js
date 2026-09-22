const express = require("express");
const router = express.Router();
const prisma = require("../config/database");

// Get all leads with search and status filter
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
        { source: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        followUps: true,
      },
    });

    res.json({ success: true, leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

// Create lead
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, source, notes, status } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Lead name is required" });
    }

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        source: source || "Website",
        notes: notes || null,
        status: status || "New",
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Failed to create lead" });
  }
});

// Update lead
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, source, notes, status } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Lead name is required" });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        source: source || "Website",
        notes: notes || null,
        status: status || "New",
      },
    });

    res.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ message: "Failed to update lead" });
  }
});

// Convert Lead to Customer (Key Feature for CRM Resume)
router.post("/:id/convert", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // 1. Create active customer from lead info
    const customer = await prisma.customer.create({
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: req.body.company || `${lead.name}'s Business`,
        address: req.body.address || "Converted from Lead",
        status: "Active",
      },
    });

    // 2. Mark lead as Converted
    await prisma.lead.update({
      where: { id },
      data: { status: "Converted" },
    });

    // 3. Move pending follow-ups to the new customer
    await prisma.followUp.updateMany({
      where: { leadId: id },
      data: { customerId: customer.id },
    });

    res.json({
      success: true,
      message: `Lead "${lead.name}" successfully converted to an active Customer!`,
      customer,
    });
  } catch (error) {
    console.error("Error converting lead to customer:", error);
    res.status(500).json({ message: "Failed to convert lead to customer" });
  }
});

// Delete lead
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.followUp.deleteMany({ where: { leadId: id } });
    await prisma.lead.delete({ where: { id } });

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Failed to delete lead" });
  }
});

module.exports = router;
