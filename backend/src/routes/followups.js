const express = require("express");
const router = express.Router();
const prisma = require("../config/database");

// Get all follow-ups
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status && status !== "All") {
      where.status = status;
    }

    const followUps = await prisma.followUp.findMany({
      where,
      orderBy: { date: "asc" },
      include: {
        customer: { select: { id: true, name: true, phone: true, company: true } },
        lead: { select: { id: true, name: true, phone: true } },
      },
    });

    res.json(followUps);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ message: "Failed to fetch follow-ups" });
  }
});

// Create follow-up
router.post("/", async (req, res) => {
  try {
    const { customerId, leadId, date, note, status } = req.body;

    if (!date || !note) {
      return res.status(400).json({ message: "Date and note are required" });
    }

    const followUp = await prisma.followUp.create({
      data: {
        customerId: customerId ? Number(customerId) : null,
        leadId: leadId ? Number(leadId) : null,
        date: new Date(date),
        note: note.trim(),
        status: status || "Pending",
      },
      include: {
        customer: { select: { id: true, name: true, phone: true, company: true } },
        lead: { select: { id: true, name: true, phone: true } },
      },
    });

    res.status(201).json(followUp);
  } catch (error) {
    console.error("Error creating follow-up:", error);
    res.status(500).json({ message: "Failed to create follow-up" });
  }
});

// Update follow-up
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { customerId, leadId, date, note, status } = req.body;

    const followUp = await prisma.followUp.update({
      where: { id },
      data: {
        customerId: customerId ? Number(customerId) : null,
        leadId: leadId ? Number(leadId) : null,
        date: date ? new Date(date) : undefined,
        note: note ? note.trim() : undefined,
        status,
      },
      include: {
        customer: { select: { id: true, name: true, phone: true, company: true } },
        lead: { select: { id: true, name: true, phone: true } },
      },
    });

    res.json(followUp);
  } catch (error) {
    console.error("Error updating follow-up:", error);
    res.status(500).json({ message: "Failed to update follow-up" });
  }
});

// Toggle follow-up status
router.patch("/:id/toggle", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.followUp.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    const newStatus = existing.status === "Completed" ? "Pending" : "Completed";
    const updated = await prisma.followUp.update({
      where: { id },
      data: { status: newStatus },
      include: {
        customer: { select: { id: true, name: true, phone: true, company: true } },
        lead: { select: { id: true, name: true, phone: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error toggling follow-up:", error);
    res.status(500).json({ message: "Failed to toggle follow-up" });
  }
});

// Delete follow-up
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.followUp.delete({ where: { id } });
    res.json({ message: "Follow-up deleted successfully" });
  } catch (error) {
    console.error("Error deleting follow-up:", error);
    res.status(500).json({ message: "Failed to delete follow-up" });
  }
});

module.exports = router;